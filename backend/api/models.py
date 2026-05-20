from django.db import models

#DEFINE LA ESTRUCTURA DE LA BASE DE DATOS

# Create your models here.
class Item(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

# NUEVA CONEXIÓN: Clase Usuario de tu diagrama
class Usuario(models.Model):
    ci = models.IntegerField(unique=True)
    nombre = models.CharField(max_length=100)
    email = models.EmailField()
    telefono = models.CharField(max_length=20)
    intencion_agua = models.BooleanField(default=False)
    intencion_servicio = models.BooleanField(default=False)
    contrasena = models.CharField(max_length=100)
    certificado = models.BooleanField(default=False)
    activo = models.BooleanField(default=True)
    litros_agua = models.FloatField(default=0.0)
    codigo_casa = models.CharField(max_length=50)

    # MÉTODO ESPECÍFICO DE LA CLASE
    def recargar_agua(self, cantidad):
        """Suma litros al balance del usuario y guarda directamente en Supabase."""
        if cantidad > 0:
            self.litros_agua += cantidad
            self.save() # Guarda los cambios de forma persistente
            return True
        return False

class Certificado(models.Model):
    # CORRECCIÓN 1: Apuntamos directamente a tu clase 'Usuario' (sin comillas porque está arriba)
    usuario = models.ForeignKey(
        Usuario, 
        on_delete=models.CASCADE, 
        related_name='certificados'
    )
    tipo_servicio = models.CharField(max_length=255)
    
    # CORRECCIÓN 2: Cambiado 'upload_or' por 'upload_to'
    archivo = models.FileField(upload_to='comprobantes_certificados/')
    creado_el = models.DateTimeField(auto_now_add=True)

    # CORRECCIÓN 3: Ajustado para usar '.nombre' en lugar de '.username'
    def __str__(self):
        return f"{self.tipo_servicio} - {self.usuario.nombre}"