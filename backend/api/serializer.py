from rest_framework import serializers
from .models import Certificado, CobroComunal, DirectorioServicio, Transaccion, Usuario, Residencia, Servicio, Oferta, Resena
from django.db import transaction
from django.db.models import F
from django.contrib.auth import get_user_model

User = get_user_model()

class UsuarioSerializer(serializers.ModelSerializer):
    codigo_casa = serializers.SlugRelatedField(
        slug_field='codigo',
        queryset=Residencia.objects.all(),
        error_messages={
            'does_not_exist': 'El número de propiedad ingresado no pertenece a ninguna residencia válida de la urbanización.'
        }
    )
    
    litros_disponibles = serializers.ReadOnlyField()
    litros_bloqueados = serializers.ReadOnlyField()

    class Meta:
        model = Usuario
        fields = '__all__'
        extra_kwargs = {
            'password': {'write_only': True} 
        }

    def validate_codigo_casa(self, value):
        if value.ocupada:
            raise serializers.ValidationError("Esta propiedad ya se encuentra vinculada a un usuario registrado.")
        return value

class UsuarioAdminSerializer(serializers.ModelSerializer):
    codigo_casa = serializers.SlugRelatedField(
        slug_field='codigo',
        read_only=True
    )
    certificado_url = serializers.SerializerMethodField()

    class Meta:
        model = Usuario
        fields = [
            'id', 'ci', 'nombre', 'email', 'telefono', 'codigo_casa',
            'intencion_agua', 'intencion_servicio', 'tipo_servicio_intencion',
            'certificado', 'certificado_url', 'estado', 'litros_agua', 'es_admin','litros_disponibles', 'litros_bloqueados'
        ]

    def get_certificado_url(self, obj):
        request = self.context.get('request')
        
        tipo_servicio_valor = obj.tipo_servicio_intencion
        if not tipo_servicio_valor or tipo_servicio_valor in [None, '', 'null', 'None']:
            return None

        tipo_servicio_id = tipo_servicio_valor.id if hasattr(tipo_servicio_valor, 'id') else tipo_servicio_valor
        
        if not tipo_servicio_id or tipo_servicio_id in [None, '', 'null', 'None']:
            return None

        certificado = Certificado.objects.filter(
            usuario_id=obj.id,
            tipo_servicio_id=tipo_servicio_id
        ).last()

        if certificado and certificado.archivo:
            if request is not None:
                return request.build_absolute_uri(certificado.archivo.url)
            return certificado.archivo.url
        return None

class CertificadoSerializer(serializers.ModelSerializer):
    archivo_url = serializers.SerializerMethodField()

    class Meta:
        model = Certificado
        fields = ['id', 'archivo', 'archivo_url', 'creado_el', 'usuario', 'tipo_servicio']

    def get_archivo_url(self, obj):
        request = self.context.get('request')
        if obj.archivo and hasattr(obj.archivo, 'url'):
            if request is not None:
                return request.build_absolute_uri(obj.archivo.url)
        return None
        
class ServicioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Servicio
        fields = '__all__' 

class DirectorioServicioSerializer(serializers.ModelSerializer):
    class Meta:
        model = DirectorioServicio
        fields = '__all__'
        
class OfertaSerializer(serializers.ModelSerializer):
    usuario_nombre = serializers.ReadOnlyField(source='usuario.nombre')

    class Meta:
        model = Oferta
        fields = '__all__' 
        extra_kwargs = {
            'usuario': {'required': False}
        }

class TransaccionSerializer(serializers.ModelSerializer):
    comprador_nombre = serializers.ReadOnlyField(source='comprador.nombre')
    vendedor_nombre = serializers.ReadOnlyField(source='vendedor.nombre')
    
    oferta_resumen = serializers.SerializerMethodField()

    ya_calificada = serializers.SerializerMethodField()
    usuario_agua_id = serializers.SerializerMethodField()

    class Meta:
        model = Transaccion
        fields = '__all__' 
        extra_kwargs = {
            'oferta': {'required': False},
            'estado': {'required': False},
            'confirmacion_comprador': {'required': False},
            'confirmacion_vendedor': {'required': False}
        }

    def get_oferta_resumen(self, obj):
        if not obj.oferta:
            return "Oferta no disponible"
            
        try:
            ofrecido = str(obj.oferta.tipo_ofrecido).upper()
            cantidad_o = obj.oferta.cantidad_ofrecida
            solicitado = str(obj.oferta.tipo_solicitado).upper()
            cantidad_s = obj.oferta.cantidad_solicitada

            texto_ofrecido = f"{cantidad_o}L de Agua" if ofrecido == 'AGUA' else f"{cantidad_o}h de Servicio"
            texto_solicitado = f"{cantidad_s}L de Agua" if solicitado == 'AGUA' else f"{cantidad_s}h de Servicio"
            
            return f"{texto_ofrecido} ⇄ {texto_solicitado}"
        except Exception:
            return f"Oferta #{obj.oferta.id}"

    def get_ya_calificada(self, obj):
        return hasattr(obj, 'resena')

    def get_usuario_agua_id(self, obj):
        if not obj.oferta:
            return None
        if obj.oferta.tipo_ofrecido == 'AGUA':
            return obj.vendedor.id
        elif obj.oferta.tipo_solicitado == 'AGUA':
            return obj.comprador.id
        return None

class ResenaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resena
        fields = '__all__'
        extra_kwargs = {
            'evaluador': {'required': False},
            'evaluado': {'required': False}
        }

class CobroSerializer(serializers.ModelSerializer):
    class Meta:
        model = CobroComunal
        fields = '__all__'
        # Bloqueamos estos campos para que el frontend no pueda alterarlos
        read_only_fields = ('alicuota', 'fecha_creacion', 'usuarios_involucrados')


    @transaction.atomic
    def create(self, validated_data):
        monto_total = validated_data['monto_total']

        # Paso 1: Filtramos ESTRICTAMENTE a los usuarios con estado ACTIVO
        usuarios_activos = User.objects.filter(estado='ACTIVO')
        
        # Contamos cuántos usuarios activos hay realmente en la base de datos
        cantidad_usuarios_reales = usuarios_activos.count()

        # Validación de seguridad: Si no hay usuarios activos, abortamos la operación
        if cantidad_usuarios_reales == 0:
            raise serializers.ValidationError({
                "error": "No hay usuarios en estado ACTIVO para aplicar este cobro."
            })

        # Forzamos que el registro guarde la cantidad real, ignorando si el frontend mandó otro número
        validated_data['usuarios_involucrados'] = cantidad_usuarios_reales

        # Paso 2 matemático: Cálculo de la porción por persona
        alicuota_calculada = monto_total / cantidad_usuarios_reales
        validated_data['alicuota'] = alicuota_calculada

        # Creamos el registro del cobro comunal
        cobro_maestro = super().create(validated_data)

        # Paso 3 matemático: Descontamos directamente solo al grupo de usuarios activos
        usuarios_activos.update(litros_agua=F('litros_agua') - alicuota_calculada)

        return cobro_maestro