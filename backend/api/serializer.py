from rest_framework import serializers
from .models import Certificado, Usuario, Residencia

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
    class Meta:
        model = Certificado
        fields = '__all__'  # Incluye de forma automática todos los atributos en el JSON