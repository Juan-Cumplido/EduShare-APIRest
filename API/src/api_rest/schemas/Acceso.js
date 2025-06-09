import zod from 'zod';
import { SoloLetras, SoloLetrasYNumeros, SoloRutas, SoloIdentificadores } from '../utilidades/RegexValidadores.js';


const CuentaEsquema = zod.object(
{
    correo: zod.string().email({ invalid_type_error: 'El correo ingresado no es válido',required_error: 'El correo es un campo requerido'}).max(256),
    contrasenia: zod.string({ invalid_type_error: 'La contraseña ingresado no es válido',required_error: 'La contraseña es un campo requerido'}).min(8).max(300),
    nombreUsuario: zod.string({ invalid_type_error: 'El nombre de usuario ingresado no es válido',required_error: 'El nombre de usuario es un campo requerido'}).min(2).max(15).regex(SoloLetrasYNumeros,
         {message: 'El nombre de usuario solo puede contener letras y números'}
    ),
   
    nombre: zod.string({ invalid_type_error: 'El nombre ingresado no es válido',required_error: 'El nombre es un campo requerido'}).min(1).max(30).regex(SoloLetras),
    primerApellido: zod.string({ invalid_type_error: 'El primer apellido ingresado no es válido',required_error: 'El primer apellido es un campo requerido'}).min(1).max(30).regex(SoloLetras),
    segundoApellido: zod.string({ invalid_type_error: 'El segundo apellido no es válido'}).min(0).max(80).regex(SoloLetras).nullable(),
    
    
    idInstitucion: zod.number().int({ invalid_type_error: 'La institución no es válida',required_error: 'La institución es un campo requerido'}).positive()
});

const InicioSesionEsquema = zod.object({
    identifier: zod.string()
        .min(1)
        .max(256)
        .regex(SoloIdentificadores, {
            message: 'Debe ser un nombre de usuario (solo letras y números) o correo electrónico válido'
        }),
    contrasenia: zod.string({invalid_type_error: 'La contraseña ingresada no es válida', required_error: 'La contraseña es un campo requerido'}).min(8, 
        { message: 'La contraseña debe tener al menos 8 caracteres' }).max(300, { message: 'La contraseña es demasiado larga' })
});

const CorreoEsquema = zod.object({
  correo: zod.string().email({invalid_type_error: 'El correo no es válido', required_error: 'El campo correo es requerido'}).max(256,
    'El correo es demasiado grande. Max 256')
});

const CuentaEliminaciónEsquema = zod.object({
  correo: zod.string().email({invalid_type_error: 'El correo no es válido', required_error: 'El campo correo es requerido'}).max(256,
    'El correo es demasiado grande. Max 256'),
  contrasenia: zod.string({ invalid_type_error: 'La contraseña ingresado no es válido',required_error: 'La contraseña es un campo requerido'}).min(8).max(300),
});

const ContraseñaNuevaEsquema = zod.object({
    correo: zod.string().email({ message: "Formato de correo electrónico inválido" }),
    codigo: zod.string().min(6, { message: "El código debe tener al menos 6 caracteres" }),
    nuevaContrasenia: zod.string()
        .min(8, { message: "La contraseña debe tener al menos 8 caracteres" })
        .regex(/[A-Z]/, { message: "La contraseña debe tener al menos una letra mayúscula" })
        .regex(/[a-z]/, { message: "La contraseña debe tener al menos una letra minúscula" })
        .regex(/[0-9]/, { message: "La contraseña debe tener al menos un número" })
        .regex(/[^A-Za-z0-9]/, { message: "La contraseña debe tener al menos un carácter especial" })
});

const CuentaEsquemaEdicion = zod.object(
{
    idAcceso: zod.number({ invalid_type_error: 'El idAcceso ingresado no es válido',required_error: 'El idAcceso es un campo requerido'}).int().positive(),
    correo: zod.string().email({ invalid_type_error: 'El correo ingresado no es válido',required_error: 'El correo es un campo requerido'}),
    contrasenia: zod.string({ invalid_type_error: 'La contraseña ingresado no es válido',required_error: 'El contraseña es un campo requerido'}),
    estadoAcceso: zod.string({ invalid_type_error: 'El estado ingresado no es válido'}).min(7).max(13).regex(SoloLetras),
    tipoDeUsuario: zod.string({ invalid_type_error: 'El tipo de acceso ingresado no es válido'}).min(7).max(13).regex(SoloLetras)
}
)

const CuentaAdminEsquema = CuentaEsquema.extend({
    tipoAcceso: zod.literal('Administrador')
});

const BaneoEsquema = zod.object({
  idUsuarioRegistrado: zod.number().int({ invalid_type_error: 'El id usuario no es válido', required_error: 'El idUsuario es un campo requerido'}).positive(),
}
)

export function ValidarInsercionAdmin(entrada) {
    return CuentaAdminEsquema.safeParse(entrada);
}

export function ValidarCredenciales(entrada) {
    return InicioSesionEsquema.safeParse(entrada);
}

export function ValidarBaneo(entrada){
    const resultado = BaneoEsquema.safeParse(entrada);
    return resultado;
}


export function ValidarEliminacionCuenta(entrada) {
  return CuentaEliminaciónEsquema.safeParse(entrada);
}


export function ValidarCambioContraseña(entrada){
    return ContraseñaNuevaEsquema.safeParse(entrada)
}   

export function ValidarCorreo(entrada){
  return CorreoEsquema.safeParse(entrada)
}

export function ValidarInsercionAcceso(entrada)
{
    return CuentaEsquema.safeParse(entrada);
}

export function ValidarEdicionParcialAcceso(entrada)
{
    return CuentaEsquemaEdicion.partial().safeParse(entrada);
}

