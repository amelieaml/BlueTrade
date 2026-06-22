from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models
from django.conf import settings
from django.utils import timezone

class Residencia(models.Model):
    codigo = models.CharField(max_length=50, unique=True) 
    ocupada = models.BooleanField(default=False) 

    def __str__(self):
        estado = "Ocupada" if self.ocupada else "Disponible"
        return f"{self.codigo} - {estado}"
    
class UsuarioManager(BaseUserManager):
    def create_user(self, email, nombre, ci, password=None, **extra_fields):
        if not email:
            raise ValueError('El email es obligatorio')
        email = self.normalize_email(email)
        
        extra_fields.setdefault('es_admin', False)
        extra_fields.setdefault('estado', EstadoUsuario.EN_ESPERA)
        
        user = self.model(email=email, nombre=nombre, ci=ci, **extra_fields)
        user.set_password(password)  
        user.save(using=self._db)
        return user

    def create_superuser(self, email, nombre, ci, password=None, **extra_fields):
        extra_fields.setdefault('es_admin', True)
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, nombre, ci, password, **extra_fields)
    
class EstadoUsuario(models.TextChoices):
    ACTIVO = 'ACTIVO', 'Activo'
    EN_ESPERA = 'EN_ESPERA', 'En Espera'
    REVISION_PENDIENTE = 'REVISION_PENDIENTE', 'Revisión Pendiente'
    RECHAZADO = 'RECHAZADO', 'Rechazado'

class Usuario(AbstractBaseUser):
    ci = models.IntegerField(unique=True)
    nombre = models.CharField(max_length=100)
    email = models.EmailField(unique=True)  
    telefono = models.CharField(max_length=20)
    
    intencion_agua = models.BooleanField(default=False)
    intencion_servicio = models.BooleanField(default=False)
    tipo_servicio_intencion = models.CharField(max_length=50, blank=True, null=True)
    
    es_admin = models.BooleanField(default=False)
    certificado = models.BooleanField(default=False)

    estado = models.CharField(
        max_length=30,
        choices=EstadoUsuario.choices,
        default=EstadoUsuario.EN_ESPERA  
    )
    
    litros_agua = models.FloatField(default=0.0)
    
    codigo_casa = models.ForeignKey(Residencia, on_delete=models.PROTECT, to_field='codigo', db_column='codigo_casa')
    
    objects = UsuarioManager()

    USERNAME_FIELD = 'email' 
    REQUIRED_FIELDS = ['nombre', 'ci']

    @property
    def is_active(self):
        """
        Devuelve True siempre que el usuario no esté rechazado, 
        permitiendo así que Django valide el login.
        """
        return self.estado != EstadoUsuario.RECHAZADO

    def recargar_agua(self, cantidad):
        if cantidad > 0:
            self.litros_agua += cantidad
            self.save()
            return True
        return False
    
    @property
    def litros_bloqueados(self):
        bloqueados_compras = self.compras.filter(
            estado__in=['PENDIENTE', 'EN_PROCESO'],
            oferta__tipo_solicitado__iexact='AGUA'
        ).aggregate(
            total=models.Sum('oferta__cantidad_solicitada')
        )['total'] or 0

        return float(bloqueados_compras)

    @property
    def litros_disponibles(self):
        return float(self.litros_agua) - self.litros_bloqueados

    @property
    def promedio_calificacion(self):
        from .models import Resena
        promedio = Resena.objects.filter(evaluado=self).aggregate(
            promed=models.Avg('calificacion')
        )['promed']
        
        return round(float(promedio), 1) if promedio is not None else 0.0

class Servicio(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    descripcion = models.TextField(max_length=255, unique=True)
    necesita_certificado = models.BooleanField(default=False)
    #campos de la táctica 
    es_externo = models.BooleanField(default=False)
    api_origen = models.URLField(max_length=255, blank=True, null=True)

    def __str__(self):
        prefix = "[Externo] " if self.es_externo else "[Interno] " 
        return f"{prefix}{self.nombre}"
    
class DirectorioServicio(models.Model):
    nombre_servicio = models.CharField(max_length=100, unique=True)
    api_conexion = models.URLField(max_length=255, unique=True)
    esta_activo = models.BooleanField(default=False)
    ultima_consulta = models.DateTimeField(auto_now=True)

    def __str__(self):
        estado = "Activo" if self.esta_activo else "Inactivo"
        return f"{self.nombre_servicio} ({estado})"  
    
class Certificado(models.Model):
    archivo = models.FileField(upload_to='comprobantes_certificados/')
    creado_el = models.DateTimeField(auto_now_add=True)
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='certificados')
    tipo_servicio = models.ForeignKey('Servicio', on_delete=models.CASCADE, related_name='certificados')

class EstadoOferta(models.TextChoices):
    ACTIVO = 'ACTIVO', 'Activo'
    EN_PROCESO = 'EN_PROCESO', 'En Proceso'
    PAUSADO = 'PAUSADO', 'Pausado'
    COMPLETADO = 'COMPLETADO', 'Completado'
    CANCELADO = 'CANCELADO', 'Cancelado'

class Oferta(models.Model):
    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='ofertas'
    )
    
    estado = models.CharField(
        max_length=20,
        choices=EstadoOferta.choices,
        default=EstadoOferta.ACTIVO
    )
    
    # Lo que el vecino OFRECE
    tipo_ofrecido = models.CharField(max_length=20)  # Agua o Servicio
    cantidad_ofrecida = models.FloatField(blank=True, null=True)  # Litros si ofrece agua, horas si ofrece servicio
    categoria_ofrecida = models.CharField(max_length=100, blank=True, null=True)
    
    # Lo que el vecino SOLICITA a cambio
    tipo_solicitado = models.CharField(max_length=20)  # Agua o Servicio
    cantidad_solicitada = models.FloatField(blank=True, null=True)  # Litros si pide agua, horas si pide servicio
    categoria_solicitada = models.CharField(max_length=100, blank=True, null=True)
    
    descripcion = models.TextField(max_length=500, blank=True, null=True)
    creado_el = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Oferta {self.id} - {self.usuario.nombre} ({self.estado})"
    
class EstadoTransaccion(models.TextChoices):
    PENDIENTE = 'PENDIENTE', 'Pendiente'
    EN_PROCESO = 'EN_PROCESO', 'En Proceso'
    COMPLETADA = 'COMPLETADA', 'Completada'
    CANCELADA = 'CANCELADA', 'Cancelada'

class Transaccion(models.Model):
    oferta = models.ForeignKey('Oferta', on_delete=models.PROTECT, related_name='transacciones')
    comprador = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='compras')
    vendedor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='ventas')
    
    estado = models.CharField(max_length=20, choices=EstadoTransaccion.choices, default=EstadoTransaccion.PENDIENTE)
    
    confirmacion_comprador = models.BooleanField(default=False)
    confirmacion_vendedor = models.BooleanField(default=False)
    
    fecha_inicio = models.DateTimeField(auto_now_add=True)
    fecha_finalizacion = models.DateTimeField(null=True, blank=True)

    def save(self, *args, **kwargs):
        if self.confirmacion_comprador and self.confirmacion_vendedor and self.estado != 'COMPLETADA':
            
            if self.oferta.tipo_ofrecido == 'AGUA':
                self.comprador.litros_agua += self.oferta.cantidad_ofrecida
                self.comprador.save()
                
            elif self.oferta.tipo_solicitado == 'AGUA':
                if self.comprador.litros_agua >= self.oferta.cantidad_solicitada:
                    self.comprador.litros_agua -= self.oferta.cantidad_solicitada
                    self.oferta.usuario.litros_agua += self.oferta.cantidad_solicitada
                    
                    self.comprador.save()
                    self.oferta.usuario.save()
                else:
                    raise ValueError("Saldo insuficiente del comprador.")

            self.estado = 'COMPLETADA'
            self.fecha_finalizacion = timezone.now()
            self.oferta.estado = 'COMPLETADO'
            self.oferta.save()

        super().save(*args, **kwargs)

    @property
    def litros_involucrados(self):

        if self.oferta.tipo_ofrecido == 'AGUA':
            return self.oferta.cantidad_ofrecida
        return 0

    def __str__(self):
        return f"Transacción {self.id} | Comprador: {self.comprador.nombre} | Estado: {self.estado}"

class Resena(models.Model):
    transaccion = models.OneToOneField('Transaccion', on_delete=models.CASCADE, related_name='resena')
    evaluador = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='resenas_realizadas')
    evaluado = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='resenas_recibidas')
    calificacion = models.IntegerField(choices=[(1, 1), (2, 2), (3, 3), (4, 4), (5, 5)])
    comentario = models.TextField(max_length=500)
    fecha = models.DateTimeField(auto_now_add=True)