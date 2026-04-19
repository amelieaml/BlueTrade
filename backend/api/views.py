from rest_framework import viewsets
from .serializer import ItemSerializer
from .models import Item

# Create your views here.
class ItemView(viewsets.ModelViewSet):
    #DEFINE EL SERIALIZADOR 
    serializer_class = ItemSerializer
    #INDICA DE DONDE SE SACARAN LOS DATOS
    queryset = Item.objects.all()