from rest_framework import serializers
from .models import Certificado, Usuario

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = '__all__' # Mantiene todos los atributos automáticamente en el JSON
        extra_kwargs = {
            # Esto permite recibir la contraseña al registrarse, pero NUNCA la envía de vuelta a React
            'password': {'write_only': True} 
        }

    # Interceptamos la creación del usuario para aplicar la encriptación segura
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        # Usamos el manager que creamos (create_user) para que guarde la clave hasheada en Supabase
        usuario = Usuario.objects.create_user(contrasena=password, **validated_data)
        return usuario

# Serializer para la clase Certificado
class CertificadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certificado
        fields = '__all__'  # Incluye de forma automática todos los atributos en el JSON