from rest_framework import serializers
from .models import Certificado, Item, Usuario

# Serializer para la clase Item
class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = '__all__'

# Serializer para la clase Usuario
class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = '__all__'  # Incluye de forma automática todos los atributos en el JSON

# Serializer para la clase Certificado
class CertificadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certificado
        fields = '__all__'  # Incluye de forma automática todos los atributos en el JSON