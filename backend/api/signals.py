from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone
from datetime import timedelta
from .models import CobroComunal, Transaccion, Notificacion, Usuario, Resena

@receiver(post_save, sender=Transaccion)
def notificar_cambios_transaccion(sender, instance, created, **kwargs):
    if created:
        # 1. Notificar al vendedor que le aceptaron su oferta (Inicia la transacción)
        Notificacion.objects.create(
            usuario=instance.vendedor,
            tipo='TRANS_INICIADA',
            data={'transaccion_id': instance.id, 'mensaje': 'Alguien ha aceptado tu oferta e iniciado una transacción.'}
        )
        return

    # 2. Notificaciones de Confirmación
    # Si el comprador confirma, avisamos al vendedor
    if instance.confirmacion_comprador:
        Notificacion.objects.create(
            usuario=instance.vendedor,
            tipo='CONFIRMACION_RECIBIDA',
            data={'transaccion_id': instance.id, 'rol': 'comprador', 'nombre_usuario': instance.comprador.nombre}
        )

    # Si el vendedor confirma, avisamos al comprador
    if instance.confirmacion_vendedor:
        Notificacion.objects.create(
            usuario=instance.comprador,
            tipo='CONFIRMACION_RECIBIDA',
            data={'transaccion_id': instance.id, 'rol': 'vendedor', 'nombre_usuario': instance.vendedor.nombre}
        )

    # 3. Estados Finales (Ya existentes, pero consolidados)
    if instance.estado == 'COMPLETADA':
        Notificacion.objects.create(usuario=instance.comprador, tipo='TRANS_COMPLETADA', data={'transaccion_id': instance.id})
        Notificacion.objects.create(usuario=instance.vendedor, tipo='TRANS_COMPLETADA', data={'transaccion_id': instance.id})
        
    elif instance.estado == 'CANCELADA':
        Notificacion.objects.create(usuario=instance.comprador, tipo='TRANS_CANCELADA', data={'transaccion_id': instance.id})
        Notificacion.objects.create(usuario=instance.vendedor, tipo='TRANS_CANCELADA', data={'transaccion_id': instance.id})
        
@receiver(post_save, sender=CobroComunal)
def notificar_nuevo_cobro_comunal(sender, instance, created, **kwargs):
    """
    Se dispara automáticamente cuando se registra un nuevo cobro maestro.
    Envía una notificación individual a cada residente activo del sistema.
    """
    if created:
        # 1. Buscamos a todos los usuarios que formen parte activa de la comunidad
        usuarios_activos = Usuario.objects.filter(estado='ACTIVO')
        
        # 2. Iteramos sobre cada usuario para registrar su notificación en la base de datos
        for usuario in usuarios_activos:
            Notificacion.objects.create(
                usuario=usuario,
                tipo='NUEVO_COBRO_COMUNAL',
                data={
                    'cobro_id': instance.id,
                    'motivo': instance.descripcion,
                    # Formateamos el monto de la alícuota calculada en serializer.py a 2 decimales
                    'monto_cuota': f"{instance.alicuota:.2f}",
                    'mensaje': f"Se ha publicado un nuevo cobro comunal por motivo de '{instance.descripcion}'."
                }
            )

@receiver(post_save, sender=Resena)
def notificar_nueva_resena(sender, instance, created, **kwargs):
    """
    Se ejecuta automáticamente al registrarse una nueva reseña.
    Envía una notificación al usuario 'evaluado' informándole de su nueva calificación.
    """
    if created:
        Notificacion.objects.create(
            usuario=instance.evaluado,  # El usuario que recibe la calificación
            tipo='NUEVA_RESENA',
            data={
                'resena_id': instance.id,
                'calificacion': instance.calificacion,
                'nombre_evaluador': instance.evaluador.nombre,
                'comentario': instance.comentario,
                'mensaje': f"{instance.evaluador.nombre} te ha calificado con {instance.calificacion} estrellas."
            }
        )
    
@receiver(post_save, sender=Usuario)
def notificar_admins_nuevo_usuario(sender, instance, created, **kwargs):
    # 'created' es True solo si es una fila nueva en la base de datos
    # Verificamos además que el estado inicial sea EN_ESPERA
    if created and instance.estado == 'EN_ESPERA':
        
        administradores = Usuario.objects.filter(es_admin=True)
        
        for admin in administradores:
            Notificacion.objects.create(
                usuario=admin,
                tipo='NUEVO_USUARIO_PENDIENTE',
                data={
                    'usuario_id': instance.id,
                    'nombre_usuario': instance.nombre,
                    'mensaje': f'El usuario {instance.nombre} solicita validación.'
                }
            )
    if not created and instance.estado == 'ACTIVO':
        # Evitamos bucles verificando si ya existe esta notificación específica de aprobación
        ya_notificado = Notificacion.objects.filter(
            usuario=instance, 
            tipo='PERFIL_APROBADO'
        ).exists()
        
        if not ya_notificado:
            Notificacion.objects.create(
                usuario=instance,  # Se le envía directamente al usuario aprobado
                tipo='PERFIL_APROBADO',
                data={
                    'usuario_id': instance.id,
                    'mensaje': '¡Felicidades! Tu perfil ha sido aprobado. Ya puedes operar en el sistema.'
                }
            )