import  zod  from 'zod';

export const ValidarSeguimiento = (datos) => {
    const esquema = zod.object({
        idUsuarioSeguidor: zod.number({
            required_error: "El ID del usuario seguidor es requerido",
            invalid_type_error: "El ID del usuario seguidor debe ser un número"
        }).int({
            message: "El ID del usuario seguidor debe ser un número entero"
        }).positive({
            message: "El ID del usuario seguidor debe ser un número positivo"
        }),
        idUsuarioSeguido: zod.number({
            required_error: "El ID del usuario seguido es requerido",
            invalid_type_error: "El ID del usuario seguido debe ser un número"
        }).int({
            message: "El ID del usuario seguido debe ser un número entero"
        }).positive({
            message: "El ID del usuario seguido debe ser un número positivo"
        })
    }).refine(data => data.idUsuarioSeguidor !== data.idUsuarioSeguido, {
        message: "Un usuario no puede seguirse a sí mismo",
        path: ["idUsuarioSeguido"]
    });

    return esquema.safeParse(datos);
};

export const ValidarIdUsuario = (datos) => {
    const esquema = zod.object({
        idUsuario: zod.number({
            required_error: "El ID del usuario es requerido",
            invalid_type_error: "El ID del usuario debe ser un número"
        }).int({
            message: "El ID del usuario debe ser un número entero"
        }).positive({
            message: "El ID del usuario debe ser un número positivo"
        })
    });
    
    return esquema.safeParse(datos);
};