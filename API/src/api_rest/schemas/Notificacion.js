import zod from 'zod';
const TipoNotificacionEnum = zod.enum(['Seguimiento', 'Nuevo_Documento', 'Chat'], {
    invalid_type_error: 'El tipo de notificación no es válido',
    required_error: 'El tipo de notificación es requerido'
});


const NotificacionEsquema = zod.object({
    usuarioDestinoId: zod.number({invalid_type_error: 'El ID del usuario destino no es válido', required_error: 'El ID del usuario destino es requerido'
    }).int().positive(),
    
    titulo: zod.string({ invalid_type_error: 'El título no es válido', required_error: 'El título es requerido'})
    .min(1, 'El título no puede estar vacío').max(255, 'El título es muy largo'),
    
    mensajeNotificacion: zod.string({ invalid_type_error: 'El mensaje no es válido', required_error: 'El mensaje es requerido'})
    .min(1, 'El mensaje no puede estar vacío'),
    
    tipo: TipoNotificacionEnum
});

export function ValidarNotificacion(entrada) {
    return NotificacionEsquema.safeParse(entrada);
}