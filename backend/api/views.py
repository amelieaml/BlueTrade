from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .serializer import ItemSerializer
from .models import Item
from .serializer import UsuarioSerializer
from .models import Usuario


# Create your views here.
class ItemView(viewsets.ModelViewSet):
    #DEFINE EL SERIALIZADOR 
    serializer_class = ItemSerializer
    #INDICA DE DONDE SE SACARAN LOS DATOS
    queryset = Item.objects.all()

class UsuarioView(viewsets.ModelViewSet):
    serializer_class = UsuarioSerializer
    queryset = Usuario.objects.all()

    # EXPONER EL MÉTODO A LA API
    # detail=True significa que la URL requerirá el ID del usuario: /usuarios/id/recargar_agua/
    @action(detail=True, methods=['post'])
    def recargar_agua(self, request, pk=None):
        usuario = self.get_object() # Busca automáticamente al usuario por su ID
        cantidad = request.data.get('cantidad', 0) # Obtiene la cantidad enviada desde el front
        
        # Ejecuta el método específico de la clase que definimos en models.py
        if usuario.recargar_agua(float(cantidad)):
            return Response({
                "status": "Recarga exitosa",
                "nuevo_saldo_litros": usuario.litros_agua
            })
        return Response({"error": "La cantidad debe ser mayor a 0"}, status=400)