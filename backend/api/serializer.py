from rest_framework import serializers
from .models import Certificado, Usuario, Residencia, Servicio

class UsuarioSerializer(serializers.ModelSerializer):
    codigo_casa = serializers.SlugRelatedField(
        slug_field='codigo',
        queryset=Residencia.objects.all(),
        error_messages={
            'does_not_exist': 'El número de propiedad ingresado no pertenece a ninguna residencia válida de la urbanización.'
        }
    )

    class Meta:
        model = Usuario
        fields = '__all__' # Mantiene todos los atributos automáticamente en el JSON
        extra_kwargs = {
            'password': {'write_only': True} 
        }

    def validate_codigo_casa(self, value):
        # value ya es el objeto Residencia encontrado en Supabase
        
        # REGLA: Si la casa ya está ocupada, rechaza el registro inmediatamente
        if value.ocupada:
            raise serializers.ValidationError("Esta propiedad ya se encuentra vinculada a un usuario registrado.")

        return value
    
    def create(self, validated_data):
        
        password = validated_data.pop('password', None)
        usuario = Usuario.objects.create_user(password=password, **validated_data)
        residencia = validated_data['codigo_casa']
        residencia.ocupada = True
        residencia.save()
        return usuario

# Serializer para la clase Certificado
class CertificadoSerializer(serializers.ModelSerializer):
    # 1. Declaramos un campo personalizado que se generará al vuelo
    archivo_url = serializers.SerializerMethodField()

    class Meta:
        model = Certificado
        # 2. Agregamos el nuevo campo a la lista (puedes dejar '__all__' si prefieres, 
        # pero es mejor ser explícito para evitar problemas)
        fields = ['id', 'archivo', 'archivo_url', 'creado_el', 'usuario', 'tipo_servicio']

    # 3. Esta función construye la URL completa
    def get_archivo_url(self, obj):
        request = self.context.get('request') # Obtenemos el contexto (quién nos está llamando)
        if obj.archivo and hasattr(obj.archivo, 'url'):
            if request is not None:
                # build_absolute_uri toma '/media/comprobantes/archivo.pdf' y le pega 'http://127.0.0.1:8000'
                return request.build_absolute_uri(obj.archivo.url)
        return None
        
class ServicioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Servicio
        fields = '__all__' 