import zod from 'zod';
import { SoloLetrasNumerosCaracteres, SoloRutas } from '../utilidades/RegexValidadores.js';

const EstadoPublicacionEnum = zod.enum(['Aceptado', 'Rechazado', 'Eliminado', 'EnRevision']);
const NivelEducativoEnum = zod.enum(['Preparatoria', 'Universidad']);

const PublicacionEsquema = zod.object({
  idCategoria: zod.number({ invalid_type_error: 'El idCategoria no es válido', required_error: 'El idCategoria es un campo requerido' })
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

  idMateriaYRama: zod.number({ invalid_type_error: 'El idMateria no es válido', required_error: 'El idMateria es un campo requerido' })
    .int('El idMateria debe ser un entero')
    .positive('El idMateria debe ser positivo'),

  idDocumento: zod.number({ invalid_type_error: 'El idDocumento no es válido', required_error: 'El idDocumento es un campo requerido' })
    .int('El idDocumento debe ser un entero')
    .positive('El idDocumento debe ser positivo'),
});

const DocumentoEsquema = zod.object({
  titulo: zod.string()
    .min(1, 'El título debe tener al menos 1 carácter')
    .max(100, 'El título debe tener máximo 100 caracteres')
    .regex(SoloLetrasNumerosCaracteres, 'El título solo puede contener letras, números y caracteres permitidos'),

  ruta: zod.string()
    .min(1, "La ruta es requerida")
    .max(500, "La ruta es demasiado larga"),

  idUsuarioRegistrado: zod.number({
    required_error: 'El ID de usuario es requerido',
    invalid_type_error: 'El ID de usuario debe ser un número'
  })
});



const PublicacionEliminacion = zod.object({
  idPublicacion: zod.number({ invalid_type_error: 'El idPublicacion no es válido', required_error: 'El idPublicacion es un campo requerido' })
    .int('El idPublicacion debe ser un entero')
    .positive('El idPublicacion debe ser positivo'),
    
});

export function ValidarInsercionPublicacion(entrada) {
  return PublicacionEsquema.safeParse(entrada);
}

export function ValidarInsercionDocumento(entrada){
  return DocumentoEsquema.safeParse(entrada);
}

export function ValidarEliminacionPublicacion(entrada) {
  return PublicacionEliminacion.safeParse(entrada);
}



