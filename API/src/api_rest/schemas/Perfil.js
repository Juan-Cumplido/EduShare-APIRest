import zod from 'zod';
import { SoloLetras, SoloLetrasYNumeros } from '../utilidades/RegexValidadores.js';

const ActualizacionPerfilEsquema = zod.object({
    nombre: zod.string({ invalid_type_error: 'El nombre ingresado no es válido',required_error: 'El nombre es un campo requerido'}).min(1).max(30).regex(SoloLetras),
    primerApellido: zod.string({ invalid_type_error: 'El primer apellido ingresado no es válido',required_error: 'El primer apellido es un campo requerido'}).min(1).max(30).regex(SoloLetras),
    segundoApellido: zod.string({ invalid_type_error: 'El segundo apellido no es válido'}).min(0).max(80).regex(SoloLetras).nullable(),
    correo: zod.string().email({ invalid_type_error: 'El correo ingresado no es válido',required_error: 'El correo es un campo requerido'}).max(256),
    nombreUsuario: zod.string({ invalid_type_error: 'El nombre de usuario ingresado no es válido',required_error: 'El nombre de usuario es un campo requerido'}).min(2).max(15).regex(SoloLetrasYNumeros,
             {message: 'El nombre de usuario solo puede contener letras y números'}
        ),
    idInstitucion: zod.number().int({ invalid_type_error: 'La institución no es válida',required_error: 'La institución es un campo requerido'}).positive()
})

const ActualizacionAvatarEsquema = zod.object({
    fotoPerfil: zod.string({
        invalid_type_error: 'La foto de perfil debe ser una cadena de texto',
           required_error: 'La foto de perfil es un campo requerido'
    })
    .min(1, "La ruta de la foto de perfil es requerida")
    .max(500, "La ruta de la foto de perfil es demasiado larga")
});

export function ValidarActualizacionPerfil(entrada){
    return ActualizacionPerfilEsquema.safeParse(entrada)
}

export function ValidarActualizacionAvatar(entrada) {
    return ActualizacionAvatarEsquema.safeParse(entrada);
}