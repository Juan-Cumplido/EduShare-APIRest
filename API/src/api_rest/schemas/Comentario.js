import zod from 'zod';

const CreacionComentarioEsquema = zod.object({
    contenido: zod.string({ 
        invalid_type_error: 'El contenido del comentario debe ser texto',
        required_error: 'El contenido del comentario es requerido'
    })
    .min(1, "El contenido del comentario es requerido")
    .max(200, "El contenido del comentario no puede exceder 200 caracteres")
    .trim(),
    
    idPublicacion: zod.number({
        invalid_type_error: 'El ID de la publicación debe ser un número',
        required_error: 'El ID de la publicación es requerido'
    })
    .int("El ID de la publicación debe ser un número entero")
    .positive("El ID de la publicación debe ser un número positivo")
}).strict();

export function ValidarCreacionComentario(entrada) {
    return CreacionComentarioEsquema.safeParse(entrada);
}