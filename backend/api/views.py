from django.db import transaction
import requests
from django.utils import timezone
from .services import MatchingEngine
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import AllowAny
from django.contrib.auth import get_user_model

from rest_framework.exceptions import ValidationError

from .serializer import (
    User,
    UsuarioSerializer, 
    ServicioSerializer, 
    CertificadoSerializer, 
    OfertaSerializer, 
    UsuarioAdminSerializer,
    UsuarioListadoAdminSerializer,
    TransaccionSerializer,
    DirectorioServicioSerializer,
    ResenaSerializer,
    CobroSerializer,
    NotificacionSerializer
)
from .models import DirectorioServicio, Servicio, Usuario, Certificado, Oferta, Transaccion, Resena, CobroComunal, Notificacion

class UsuarioView(viewsets.ModelViewSet):
    serializer_class = UsuarioSerializer
    queryset = Usuario.objects.select_related(
        'codigo_casa'
    ).prefetch_related(
        'certificados__tipo_servicio'
    )
    
    @action(detail=False, methods=['get'], url_path='listar-admin')
    def listar_admin(self, request):
        usuarios = (
            Usuario.objects
            .select_related('codigo_casa')
            .only(
                'id',
                'nombre',
                'email',
                'codigo_casa',
                'intencion_agua',
                'intencion_servicio',
                'tipo_servicio_intencion',
                'estado',
                'es_admin',
            )
            .order_by('es_admin', 'id')
        )

        serializer = UsuarioListadoAdminSerializer(
            usuarios,
            many=True
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    @action(detail=False, methods=['post'], parser_classes=(MultiPartParser, FormParser))
    @transaction.atomic 
    def registro_completo(self, request):
        usuario_serializer = UsuarioSerializer(data=request.data)
        
        if usuario_serializer.is_valid(): 
            nuevo_usuario = Usuario(
                nombre=usuario_serializer.validated_data['nombre'],
                ci=usuario_serializer.validated_data['ci'],
                email=usuario_serializer.validated_data['email'],
                telefono=usuario_serializer.validated_data['telefono'],
                codigo_casa=usuario_serializer.validated_data['codigo_casa']
            )
            
            nuevo_usuario.set_password(request.data.get('password'))
            
            nuevo_usuario.save()
            
            residencia = nuevo_usuario.codigo_casa
            residencia.ocupada = True
            residencia.save()

            return Response({"message": "Usuario registrado exitosamente"}, status=status.HTTP_201_CREATED)
        
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

        serializer = UsuarioAdminSerializer(
            user, 
            context={'request': request}
        )

        return Response({
            "message": "Inicio de sesión exitoso",
            "user": serializer.data
        }, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['get'], url_path='resenas_recibidas')
    def resenas_recibidas(self, request, pk=None):
        usuario = self.get_object()
        resenas = Resena.objects.filter(evaluado=usuario).order_by('-id')
        serializer = ResenaSerializer(resenas, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='comunidad')
    def comunidad(self, request):
    
        queryset = Usuario.objects.filter(estado='ACTIVO')

        nombre = request.query_params.get('nombre', None)
        servicio = request.query_params.get('servicio', None)
        reputacion = request.query_params.get('reputacion', None)
        ordenar = request.query_params.get('ordenar', 'alfabetico')

        if nombre:
            queryset = queryset.filter(nombre__icontains=nombre)
            
        if servicio:
            queryset = queryset.filter(tipo_servicio_intencion__icontains=servicio)

        if ordenar == 'reputacion':
            
            usuarios_ordenados = sorted(queryset, key=lambda u: u.promedio_calificacion, reverse=True)
        else:
            usuarios_ordenados = queryset.order_by('nombre')

        if reputacion and float(reputacion) > 0:
            usuarios_ordenados = [u for u in usuarios_ordenados if u.promedio_calificacion >= float(reputacion)]

        data = []
        for u in usuarios_ordenados:
            data.append({
                "id": u.id,
                "nombre": u.nombre,
                "codigo_casa": u.codigo_casa.codigo if u.codigo_casa else "S/N",
                "tipo_servicio_principal": u.tipo_servicio_intencion or "Consumidor de Agua",
                "certificado_verificado": u.certificado,
                "reputacion": str(u.promedio_calificacion)
            })

        return Response(data, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['get'])
    def certificados(self, request, pk=None):
        """
        Devuelve la lista de certificados asociados a un usuario específico.
        """
        # Obtenemos la instancia del usuario según el ID (pk) de la URL
        usuario_instancia = self.get_object() 
        
        # Filtramos los certificados que le pertenecen a este usuario
        certificados = Certificado.objects.filter(usuario=usuario_instancia)
        
        # Utilizamos el serializador que ya tienes creado
        serializer = CertificadoSerializer(
            certificados, 
            many=True, 
            context={'request': request} # Importante para construir las URLs absolutas de los archivos
        )
        
        return Response(serializer.data, status=status.HTTP_200_OK)
        
class ServicioView(viewsets.ModelViewSet):
    serializer_class = ServicioSerializer
    queryset = Servicio.objects.all()

    def list(self, request, *args, **kwargs):
        # verifica los servicios externos
        total_directorio = DirectorioServicio.objects.count()
        total_catalogo_externo = Servicio.objects.filter(es_externo=True).count()
        
        if total_directorio != total_catalogo_externo:
            # instancia el controlador del directorio para ejecutar la sicncronizacion
            directorio_view = DirectorioServicioViewSet()
            directorio_view.ejecutar_sincronizacion_interna()

        return super().list(request, *args, **kwargs)


class DirectorioServicioViewSet(viewsets.ModelViewSet):
    queryset = DirectorioServicio.objects.all()
    serializer_class = DirectorioServicioSerializer

    @action(detail=False, methods=['post'], url_path='sincronizar')
    @transaction.atomic
    def descubrir_y_actualizar(self, request):
        resultados = self.ejecutar_sincronizacion_interna()
        return Response({
            "status": "Proceso de descubrimiento finalizado",
            "resultado": resultados
        }, status=status.HTTP_200_OK)

    def ejecutar_sincronizacion_interna(self):
        #toma la data de servicios externos
        servicios_en_directorio = DirectorioServicio.objects.all()
        servicios_descubiertos = []
        nombres_externos_activos = []

        for item in servicios_en_directorio:
            try:
                response = requests.get(item.api_conexion, timeout=5) #evalua la respuesta de las apis externas
                if response.status_code == 200:
                    item.esta_activo = True
                    item.ultima_consulta = timezone.now()
                    item.save()
                    #valida el formato de la respuesta de la api
                    data_externa = response.json()
                    if isinstance(data_externa, dict):
                        descripcion_externa = data_externa.get('descripcion', f'Servicio externo integrado desde {item.nombre_servicio}')
                    elif isinstance(data_externa, list) and len(data_externa) > 0:
                        descripcion_externa = data_externa[0].get('descripcion', f'Servicio externo integrado desde {item.nombre_servicio}')
                    else:
                        descripcion_externa = f'Servicio externo integrado desde {item.nombre_servicio}'
                    #crea o actualiza el servicio 
                    Servicio.objects.update_or_create(
                        nombre=item.nombre_servicio,
                        es_externo=True,
                        defaults={
                            'descripcion': descripcion_externa,
                            'necesita_certificado': False,
                            'api_origen': item.api_conexion
                        }
                    )
                    nombres_externos_activos.append(item.nombre_servicio)
                    servicios_descubiertos.append({"servicio": item.nombre_servicio, "estado": "Activo"})
                else:
                    item.esta_activo = False
                    item.save()
            except (requests.exceptions.RequestException, ValueError):
                item.esta_activo = False
                item.save()

        # limpia los servicios externos no activos 
        Servicio.objects.filter(es_externo=True).exclude(nombre__in=nombres_externos_activos).delete()
        return servicios_descubiertos

class CertificadoView(viewsets.ModelViewSet):
    serializer_class = CertificadoSerializer
    queryset = Certificado.objects.all()
    parser_classes = (MultiPartParser, FormParser)


class OfertaView(viewsets.ModelViewSet):
    serializer_class = OfertaSerializer

    def get_queryset(self):
        usuario_id = self.request.query_params.get('usuario_id')

        queryset = Oferta.objects.select_related('usuario').order_by('-creado_el')

        if not usuario_id:
            return queryset.filter(estado='ACTIVO')

        try:
            usuario = Usuario.objects.only('id', 'es_admin').get(pk=usuario_id)
        except Usuario.DoesNotExist:
            return Oferta.objects.none()

        if usuario.es_admin:
            return queryset.filter(estado='ACTIVO')

        return queryset.filter(
            estado='ACTIVO'
        ).exclude(
            usuario_id=usuario.id
        )
    
    @action(detail=False, methods=['get'], url_path='completadas')
    def completadas(self, request):
        usuario_id = request.query_params.get('usuario_id')

        try:
            limit = int(request.query_params.get('limit', 20))
            offset = int(request.query_params.get('offset', 0))
        except ValueError:
            return Response(
                {"error": "limit y offset deben ser números válidos."},
                status=status.HTTP_400_BAD_REQUEST
            )

        limit = min(max(limit, 1), 50)
        offset = max(offset, 0)

        if not usuario_id:
            return Response(
                {"error": "usuario_id es obligatorio."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            usuario = Usuario.objects.only('id', 'es_admin').get(pk=usuario_id)
        except Usuario.DoesNotExist:
            return Response(
                {"error": "Usuario no encontrado."},
                status=status.HTTP_404_NOT_FOUND
            )

        if not usuario.es_admin:
            return Response(
                {"error": "No autorizado."},
                status=status.HTTP_403_FORBIDDEN
            )

        queryset = Oferta.objects.select_related('usuario').filter(
            estado='COMPLETADO'
        ).order_by('-creado_el')

        total = queryset.count()
        ofertas = queryset[offset:offset + limit]

        serializer = self.get_serializer(ofertas, many=True)

        siguiente_offset = offset + limit
        hay_mas = siguiente_offset < total

        return Response({
            "total": total,
            "limit": limit,
            "offset": offset,
            "next_offset": siguiente_offset if hay_mas else None,
            "results": serializer.data
        }, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        
        data = request.data.copy()
        usuario_id = data.get('usuario_id')

        if not usuario_id:
            return Response({"error": "El campo 'usuario_id' es obligatorio."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            usuario_instancia = Usuario.objects.get(pk=usuario_id)
        except Usuario.DoesNotExist:
            return Response({"error": "Usuario no encontrado."}, status=status.HTTP_404_NOT_FOUND)

        tipo_ofrecido = data.get('tipo_ofrecido')
        cantidad_ofrecida = float(data.get('cantidad_ofrecida', 0))

        if tipo_ofrecido == 'AGUA' and usuario_instancia.litros_agua < cantidad_ofrecida:
            return Response({"error": "Saldo insuficiente para cubrir esta oferta."}, status=status.HTTP_400_BAD_REQUEST)

        if tipo_ofrecido == 'AGUA':
            usuario_instancia.litros_agua -= cantidad_ofrecida
            usuario_instancia.save()

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)

        nueva_oferta = serializer.save(usuario=usuario_instancia)

        return Response(OfertaSerializer(nueva_oferta).data, status=status.HTTP_201_CREATED)
    @action(detail=False, methods=['post'], url_path='matching')
    def realizar_matching(self, request):
        data = request.data
        
        # Diccionario normalizado
        params = {
            'tipo_que_busco': data.get('tipo_solicitado'),
            'cat_que_busco': data.get('categoria_solicitada'),
            'tipo_que_ofrecido': data.get('tipo_ofrecido'),
            'cat_que_ofrecido': data.get('categoria_ofrecida')
        }
        
        # Filtro de seguridad: aseguramos que el usuario esté autenticado
        usuario_id = data.get('usuario_id')

        ofertas_disponibles = Oferta.objects.select_related('usuario').filter(
            estado='ACTIVO'
        )

        if usuario_id:
            ofertas_disponibles = ofertas_disponibles.exclude(
                usuario_id=usuario_id
            )
        
        mejor_match = MatchingEngine.encontrar_mejor_match(params, ofertas_disponibles)
        
        if mejor_match:
            return Response(OfertaSerializer(mejor_match).data, status=status.HTTP_200_OK)
        
        return Response({"message": "No hay coincidencias."}, status=status.HTTP_404_NOT_FOUND)

    
    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        nuevo_estado = request.data.get('estado')
        
        if instance.tipo_ofrecido == 'AGUA' and nuevo_estado != instance.estado:
            usuario = instance.usuario
            cantidad = instance.cantidad_ofrecida

            if instance.estado == 'ACTIVO' and nuevo_estado in ['PAUSADO', 'CANCELADO']:
                usuario.litros_agua += cantidad
                usuario.save()
            
            elif instance.estado == 'PAUSADO' and nuevo_estado == 'ACTIVO':
                if usuario.litros_disponibles < cantidad:
                    return Response({"detail": "Saldo insuficiente para reactivar la oferta."}, status=status.HTTP_400_BAD_REQUEST)
                usuario.litros_agua -= cantidad
                usuario.save()

        return super().partial_update(request, *args, **kwargs)
    
class TransaccionViewSet(viewsets.ModelViewSet):
    queryset = Transaccion.objects.select_related('comprador', 'vendedor', 'oferta').all()
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
            
            oferta_instancia = Oferta.objects.get(pk=oferta_id)
            
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
    
    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        
        if instance.estado == 'COMPLETADA':
            return Response(
                {"error": "No se puede modificar una transacción que ya ha sido completada."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        response = super().partial_update(request, *args, **kwargs)
        
        instance.refresh_from_db()
        if instance.confirmacion_comprador and instance.confirmacion_vendedor:
            if instance.estado in ['PENDIENTE', 'EN_PROCESO']:
                instance.estado = 'COMPLETADA'
                instance.save()
                serializer = self.get_serializer(instance)
                return Response(serializer.data, status=status.HTTP_200_OK)
                
        return response

class NotificacionViewSet(viewsets.ModelViewSet):
    serializer_class = NotificacionSerializer
    permission_classes = [AllowAny] # Mantenemos AllowAny para que no dependa de la sesión

    def get_queryset(self):
        # Intentamos obtener el ID del usuario desde los parámetros de la URL
        usuario_id = self.request.query_params.get('usuario_id')
        
        if usuario_id:
            # Filtramos específicamente por el ID recibido
            return Notificacion.objects.filter(usuario_id=usuario_id).order_by('-creado_el')
        
        # Si no se envía el ID, devolvemos nada (o podrías retornar Notificacion.objects.all() si quieres que sea público)
        return Notificacion.objects.none()

    @action(detail=True, methods=['patch'])
    def marcar_leida(self, request, pk=None):
        try:
            # Forzamos la búsqueda de la notificación por el ID (pk)
            notificacion = Notificacion.objects.get(pk=pk)
            
            # Opcional: Validar que la notificación pertenece al usuario_id que envías
            usuario_id = request.query_params.get('usuario_id')
            if usuario_id and int(notificacion.usuario_id) != int(usuario_id):
                return Response({'error': 'No autorizado'}, status=status.HTTP_403_FORBIDDEN)
            
            notificacion.leido = True
            notificacion.save()
            return Response({'status': 'notificación leída'}, status=status.HTTP_200_OK)
            
        except Notificacion.DoesNotExist:
            return Response({'error': f'No existe notificación con ID {pk}'}, status=status.HTTP_404_NOT_FOUND)
    
class ResenaViewSet(viewsets.ModelViewSet):
    queryset = Resena.objects.all()
    serializer_class = ResenaSerializer

    def perform_create(self, serializer):
        transaccion_id = self.request.data.get('transaccion')
        from .models import Transaccion
        transaccion_instancia = Transaccion.objects.get(id=transaccion_id)
        
        oferta = transaccion_instancia.oferta
        usuario_que_ofrecio_agua = None

        if oferta.tipo_ofrecido == 'AGUA':
            usuario_que_ofrecio_agua = transaccion_instancia.vendedor
        elif oferta.tipo_solicitado == 'AGUA':
            usuario_que_ofrecio_agua = transaccion_instancia.comprador

        evaluador = self.request.user 
        
        if evaluador.is_anonymous:
            evaluador = usuario_que_ofrecio_agua
        else:
            if evaluador != usuario_que_ofrecio_agua:
                raise ValidationError(
                    {"error": "Acceso denegado. Solo los usuarios que aportaron Agua pueden calificar al proveedor del Servicio."}
                )

        if evaluador == transaccion_instancia.comprador:
            evaluado = transaccion_instancia.vendedor
        else:
            evaluado = transaccion_instancia.comprador

        serializer.save(evaluador=evaluador, evaluado=evaluado)


class CobroComunalViewSet(viewsets.ModelViewSet):
    queryset = CobroComunal.objects.all()
    serializer_class = CobroSerializer
