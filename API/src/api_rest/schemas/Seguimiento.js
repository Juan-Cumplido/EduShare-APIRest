import zod from 'zod';

const SeguimientoEsquema = zod.object({
    idUsuarioSeguidor: zod.number({
        invalid_type_error: 'El ID del usuario seguidor debe ser un número',
        required_error: 'El ID del usuario seguidor es requerido'
    }).int({
        message: 'El ID del usuario seguidor debe ser un número entero'
    }).positive({
        message: 'El ID del usuario seguidor debe ser positivo'
    }),
    
    idUsuarioSeguido: zod.number({
        invalid_type_error: 'El ID del usuario a seguir debe ser un número',
        required_error: 'El ID del usuario a seguir es requerido'
    }).int({
        message: 'El ID del usuario a seguir debe ser un número entero'
    }).positive({
        message: 'El ID del usuario a seguir debe ser positivo'
    })
}).refine(data => data.idUsuarioSeguidor !== data.idUsuarioSeguido, {
    message: 'Un usuario no puede seguirse a sí mismo',
    path: ['idUsuarioSeguido']
});

const ConsultaSeguimientoEsquema = zod.object({
    idUsuario: zod.number({
        invalid_type_error: 'El ID del usuario debe ser un número',
        required_error: 'El ID del usuario es requerido'
    }).int({
        message: 'El ID del usuario debe ser un número entero'
    }).positive({
        message: 'El ID del usuario debe ser positivo'
    })
});

export function ValidarSeguimiento(entrada) {
    return SeguimientoEsquema.safeParse(entrada);
}

export function ValidarConsultaSeguimiento(entrada) {
    return ConsultaSeguimientoEsquema.safeParse(entrada);
}