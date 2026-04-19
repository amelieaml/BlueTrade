from rest_framework import serializers
from .models import Item

#TRADUCE EL CODIGO DE PYTHON A JSON PARA QUE PUEDA SER ENVIADO A TRAVES DE LA API

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = '__all__'