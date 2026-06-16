from rest_framework import serializers
from .models import Certificado, Transaccion, Usuario, Residencia, Servicio, Oferta

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
        # REGLA: Si la casa ya está ocupada, rechaza el registro inmediatamente
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


class OfertaSerializer(serializers.ModelSerializer):
    usuario_nombre = serializers.ReadOnlyField(source='usuario.nombre')

    class Meta:
        model = Oferta
        fields = '__all__' 
        extra_kwargs = {
            'usuario': {'required': False}
        }

class TransaccionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaccion
        fields = '__all__'
        extra_kwargs = {
            'oferta': {'required': False},
            'estado': {'required': False},
            'confirmacion_comprador': {'required': False},
            'confirmacion_vendedor': {'required': False}
        }