from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models
from django.conf import settings

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
        
        # Por defecto, los registros normales no son administradores
        extra_fields.setdefault('es_admin', False)
        extra_fields.setdefault('estado', EstadoUsuario.EN_ESPERA)# Por defecto, los usuarios no están activos hasta que se verifique su residencia
        
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
        default=EstadoUsuario.EN_ESPERA  # Por defecto entran en espera
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

class Servicio(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    descripcion = models.TextField(max_length=255, unique=True)
    necesita_certificado = models.BooleanField(default=False)

    def __str__(self):
        return self.nombre
    
class Certificado(models.Model):
    archivo = models.FileField(upload_to='comprobantes_certificados/')
    creado_el = models.DateTimeField(auto_now_add=True)
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='certificados')
    tipo_servicio = models.ForeignKey('Servicio', on_delete=models.CASCADE, related_name='certificados')