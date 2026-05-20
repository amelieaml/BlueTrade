from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models

class UsuarioManager(BaseUserManager):
    def create_user(self, email, nombre, ci, contrasena=None, **extra_fields):
        if not email:
            raise ValueError('El email es obligatorio')
        email = self.normalize_email(email)
        
        # Por defecto, los registros normales no son administradores
        extra_fields.setdefault('es_admin', False)
        extra_fields.setdefault('activo', True)
        
        user = self.model(email=email, nombre=nombre, ci=ci, **extra_fields)
        user.set_password(contrasena)  # <-- ¡Aquí ocurre la encriptación! 🔐
        user.save(using=self._db)
        return user

    def create_superuser(self, email, nombre, ci, contrasena=None, **extra_fields):
        extra_fields.setdefault('es_admin', True)
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, nombre, ci, contrasena, **extra_fields)

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
    activo = models.BooleanField(default=True)
    litros_agua = models.FloatField(default=0.0)
    codigo_casa = models.CharField(max_length=50)

    objects = UsuarioManager()

    USERNAME_FIELD = 'email' 
    REQUIRED_FIELDS = ['nombre', 'ci']

    def recargar_agua(self, cantidad):
        if cantidad > 0:
            self.litros_agua += cantidad
            self.save()
            return True
        return False

class Certificado(models.Model):
    usuario = models.ForeignKey(
        Usuario, 
        on_delete=models.CASCADE, 
        related_name='certificados'
    )
    tipo_servicio = models.CharField(max_length=255)
    
    archivo = models.FileField(upload_to='comprobantes_certificados/')
    creado_el = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.tipo_servicio} - {self.usuario.nombre}"
