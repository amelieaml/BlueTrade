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

    def create(self, request, *args, **kwargs):
        """
        Flujo de POO Estricto:
        1. El controlador recibe los datos JSON.
        2. El controlador gestiona la obtención de la instancia del usuario.
        3. El controlador delega la validación al Serializer.
        4. El controlador realiza la persistencia (save).
        """
        data = request.data.copy()
        
        # 1. Obtención de la instancia del usuario (Asumiendo que el frontend envía usuario_id)
        usuario_id = data.get('usuario_id')
        if not usuario_id:
            return Response({"error": "El campo 'usuario_id' es obligatorio."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            usuario_instancia = Usuario.objects.get(pk=usuario_id)
        except Usuario.DoesNotExist:
            return Response({"error": "Usuario no encontrado."}, status=status.HTTP_404_NOT_FOUND)

        # 2. Validación a través del Serializer
        # Excluimos 'usuario' de la data validada temporalmente para inyectar la instancia después
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)

        # 3. Creación explícita de la instancia
        # Usamos .validated_data para asegurar que solo tenemos datos limpios
        nueva_oferta = Oferta(
            usuario=usuario_instancia,
            tipo_ofrecido=serializer.validated_data.get('tipo_ofrecido'),
            cantidad_ofrecida=serializer.validated_data.get('cantidad_ofrecida'),
            categoria_ofrecida=serializer.validated_data.get('categoria_ofrecida'),
            tipo_solicitado=serializer.validated_data.get('tipo_solicitado'),
            cantidad_solicitada=serializer.validated_data.get('cantidad_solicitada'),
            categoria_solicitada=serializer.validated_data.get('categoria_solicitada'),
            descripcion=serializer.validated_data.get('descripcion')
        )

        nueva_oferta.save()

        return Response(OfertaSerializer(nueva_oferta).data, status=status.HTTP_201_CREATED)

class TransaccionViewSet(viewsets.ModelViewSet):
    queryset = Transaccion.objects.all()
    serializer_class = TransaccionSerializer
    permission_classes = [AllowAny]
    authentication_classes = []

    def create(self, request, *args, **kwargs):
        data = request.data
        
        oferta_id = data.get('oferta') or data.get('oferta_id')
        comprador_id = data.get('comprador') or data.get('comprador_id')
        
        if not oferta_id or not comprador_id:
            return Response({"error": "No se encontraron los IDs necesarios"}, status=400)

        try:
            # 1. Obtenemos la oferta para poder identificar al vendedor
            oferta_instancia = Oferta.objects.get(pk=oferta_id)
            
            # 2. Creamos la transacción asignando el vendedor de la oferta
            nueva_transaccion = Transaccion.objects.create(
                oferta=oferta_instancia, 
                vendedor=oferta_instancia.usuario, 
                comprador_id=comprador_id,
                estado='PENDIENTE',
                confirmacion_comprador=False,
                confirmacion_vendedor=False
            )
            return Response(TransaccionSerializer(nueva_transaccion).data, status=201)
            
        except Oferta.DoesNotExist:
            return Response({"error": "La oferta no existe"}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=500)
    
    