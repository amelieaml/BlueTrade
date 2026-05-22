from django.db import transaction
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import AllowAny

from .serializer import (
    UsuarioSerializer, 
    ServicioSerializer, 
    CertificadoSerializer, 
    OfertaSerializer, 
    UsuarioAdminSerializer,
    TransaccionSerializer
)
from .models import Servicio, Usuario, Certificado, Oferta, Transaccion

class UsuarioView(viewsets.ModelViewSet):
    serializer_class = UsuarioSerializer
    queryset = Usuario.objects.all()

    @action(detail=False, methods=['get'], url_path='listar-admin')
    def listar_admin(self, request):
        usuarios = Usuario.objects.all().order_by('id')
        # Es vital pasar el contexto para que las URLs del certificado funcionen
        serializer = UsuarioAdminSerializer(
            usuarios, 
            many=True, 
            context={'request': request}
        )
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'], parser_classes=(MultiPartParser, FormParser))
    @transaction.atomic 
    def registro_completo(self, request):
        usuario_serializer = UsuarioSerializer(data=request.data)
        
        if usuario_serializer.is_valid():
            usuario = usuario_serializer.save()
            archivo_fisico = request.FILES.get('certificado')
            tipo_servicio = request.data.get('tipo_servicio')
            
            if archivo_fisico and tipo_servicio:
                Certificado.objects.create(
                    usuario=usuario,
                    tipo_servicio_id=tipo_servicio,
                    archivo=archivo_fisico
                )
            
            return Response({"message": "Registro exitoso", "id": usuario.id}, status=status.HTTP_201_CREATED)
        return Response(usuario_serializer.errors, status=status.HTTP_400_BAD_REQUEST) 
    
    @action(detail=True, methods=['post'])
    def recargar_agua(self, request, pk=None):
        usuario = self.get_object() 
        cantidad = request.data.get('cantidad', 0) 
        if usuario.recargar_agua(float(cantidad)):
            return Response({"status": "Recarga exitosa", "nuevo_saldo_litros": usuario.litros_agua})
        return Response({"error": "La cantidad debe ser mayor a 0"}, status=400)

    @action(detail=True, methods=['post'], parser_classes=(MultiPartParser, FormParser), url_path='guardar_certificado')
    def guardar_certificado(self, request, pk=None):
        try:
            usuario_instancia = self.get_object() 
            tipo_servicio = request.data.get('tipoServicio')
            archivo_fisico = request.FILES.get('certificado')

            if not archivo_fisico:
                return Response({"error": "El certificado es obligatorio"}, status=status.HTTP_400_BAD_REQUEST)

            nuevo_certificado = Certificado(
                usuario=usuario_instancia, 
                tipo_servicio_id=tipo_servicio,
                archivo=archivo_fisico
            )
            nuevo_certificado.save() 

            return Response({"message": "Certificado guardado con éxito", "id": nuevo_certificado.id}, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['post'], url_path='login')
    def login(self, request):
        from django.contrib.auth import authenticate
        
        email = request.data.get('email')
        password = request.data.get('password') 

        if not email or not password:
            return Response(
                {"error": "El correo y la contraseña son obligatorios"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        user = authenticate(username=email, password=password)

        if user is None:
            return Response(
                {"error": "Credenciales inválidas. Verifica tu correo y contraseña"}, 
                status=status.HTTP_401_UNAUTHORIZED
            )

        # Pasamos el contexto aquí también para que el usuario logueado obtenga su URL de certificado
        serializer = UsuarioAdminSerializer(
            user, 
            context={'request': request}
        )

        return Response({
            "message": "Inicio de sesión exitoso",
            "user": serializer.data
        }, status=status.HTTP_200_OK)
        
class ServicioView(viewsets.ModelViewSet):
    serializer_class = ServicioSerializer
    queryset = Servicio.objects.all()

class CertificadoView(viewsets.ModelViewSet):
    serializer_class = CertificadoSerializer
    queryset = Certificado.objects.all()
    parser_classes = (MultiPartParser, FormParser)

class OfertaView(viewsets.ModelViewSet):
    serializer_class = OfertaSerializer
    queryset = Oferta.objects.all().order_by('-creado_el')

class TransaccionViewSet(viewsets.ModelViewSet):
    queryset = Transaccion.objects.all()
    serializer_class = TransaccionSerializer
    
    # 1. Apagamos la seguridad SOLAMENTE para pruebas
    permission_classes = [AllowAny]
    authentication_classes = [] # <-- Vital para evitar el 403 por CSRF
    
    # Nota: Hemos eliminado get_queryset y perform_create temporalmente.
    # El Serializer se encargará automáticamente de tomar el 'oferta', 'vendedor' 
    # y 'comprador' directamente del JSON que manda React y guardarlo.