from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone
from datetime import timedelta
from .models import Transaccion, Notificacion, Usuario

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