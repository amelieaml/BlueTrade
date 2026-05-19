from rest_framework import serializers
from .models import Item
from .models import Usuario

#TRADUCE EL CODIGO DE PYTHON A JSON PARA QUE PUEDA SER ENVIADO A TRAVES DE LA API

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = '__all__'

# NUEVA CONEXIÓN: Serializer para la clase Usuario
class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = '__all__' # Incluye de forma automática todos los atributos en el JSON