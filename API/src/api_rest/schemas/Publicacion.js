import zod from 'zod';
import { SoloLetrasNumerosCaracteres, SoloRutas } from '../utilidades/RegexValidadores.js';

const EstadoPublicacionEnum = zod.enum(['aceptado', 'rechazado', 'eliminado', 'enRevisión']);
const EstadoUsuarioEnum = zod.enum(['activo', 'baneado']);
const NivelEducativoEnum = zod.enum(['Preparatoria', 'Universidad']);

const PublicacionEsquema = zod.object({
  categoria: zod.number({ invalid_type_error: 'El idCategoria no es válido', required_error: 'El idCategoria es un campo requerido' })
    .int('El idCategoria debe ser un entero')
    .positive('El idCategoria debe ser positivo'),

  resuContenido: zod.string({ invalid_type_error: 'El resumen de contenido no es válido', required_error: 'El resumen de contenido es un campo requerido' })
    .min(1, 'El resumen debe tener al menos 1 carácter')
    .max(200, 'El resumen debe tener máximo 200 caracteres')
    .regex(SoloLetrasNumerosCaracteres, 'El resumen solo puede contener letras, números y caracteres permitidos'),

  estado: EstadoPublicacionEnum,

  nivelEducativo: NivelEducativoEnum,

  idUsuarioRegistrado: zod.number({ invalid_type_error: 'El idUsuarioRegistrado no es válido', required_error: 'El idUsuarioRegistrado es un campo requerido' })
    .int('El idUsuarioRegistrado debe ser un entero')
    .positive('El idUsuarioRegistrado debe ser positivo'),

  idRama: zod.number({ invalid_type_error: 'El idRama no es válido', required_error: 'El idRama es un campo requerido' })
    .int('El idRama debe ser un entero')
    .positive('El idRama debe ser positivo'),

  idMateria: zod.number({ invalid_type_error: 'El idMateria no es válido', required_error: 'El idMateria es un campo requerido' })
    .int('El idMateria debe ser un entero')
    .positive('El idMateria debe ser positivo'),

  idDocumento: zod.number({ invalid_type_error: 'El idDocumento no es válido', required_error: 'El idDocumento es un campo requerido' })
    .int('El idDocumento debe ser un entero')
    .positive('El idDocumento debe ser positivo'),
});

const PublicacionEliminacion = zod.object({
  idPublicacion: zod.number({ invalid_type_error: 'El idPublicacion no es válido', required_error: 'El idPublicacion es un campo requerido' })
    .int('El idPublicacion debe ser un entero')
    .positive('El idPublicacion debe ser positivo'),
    
  idUsuarioRegistrado: zod.number({ invalid_type_error: 'El idUsuarioRegistrado no es válido', required_error: 'El idUsuarioRegistrado es un campo requerido' })
  .int('El idUsuarioRegistrado debe ser un entero')
  .positive('El idUsuarioRegistrado debe ser positivo'),
});

// Esquema para edición de Publicación (requiere id + campos modificables)
const PublicacionEsquemaEdicion = zod.object({
  idPublicacion: zod.number({ invalid_type_error: 'El idPublicacion no es válido', required_error: 'El idPublicacion es un campo requerido' })
    .int('El idPublicacion debe ser un entero')
    .positive('El idPublicacion debe ser positivo'),
  categoria: CategoriaEnum.optional(),
  
  resuContenido: zod.string().min(1).max(200).regex(SoloLetrasNumerosCaracteres).optional(),
  estado: EstadoPublicacionEnum.optional(),
  nivelEducativo: NivelEducativoEnum.optional(),
  idRama: zod.number().int().positive().optional(),
  idMateria: zod.number().int().positive().optional(),
  idDocumento: zod.number().int().positive().optional(),
});

const CorreoEsquema = zod.object({
  correo: zod.string().email({invalid_type_error: 'El correo no es válido', required_error: 'El campo correo es requerido'}).max(256,
    'El correo es demasiado grande. Max 256')
});

export function ValidarCorreo(entrada){
  return CorreoEsquema.parse(entrada)
}

export function ValidarInsercionPublicacion(entrada) {
  return PublicacionEsquema.safeParse(entrada);
}

export function ValidarEdicionPublicacion(entrada) {
  return PublicacionEsquemaEdicion.partial().safeParse(entrada);
}

export function ValidarEliminacionPublicacion(entrada) {
  return PublicacionEliminacion.safeParse(entrada);
}
