import { ValidarInsercionAcceso, ValidarCredenciales, ValidarCambioContraseña, ValidarCorreo } from "../schemas/Acceso.js";
import { logger } from "../utilidades/logger.js";
import path from 'path';
import {EnviarCorreoDeVerificacion} from "../utilidades/Correo.js";

export class AccesoControlador
{
    constructor({ModeloAcceso})
    {
        this.modeloAcceso = ModeloAcceso;
        this.codigosRecuperacion = new Map();
    }

    RegistrarAcceso = async (req, res) => {
        try {
            const ResultadoValidacion = ValidarInsercionAcceso(req.body);
            if (ResultadoValidacion.success) {
                const ResultadoInsercion = await this.modeloAcceso.InsertarNuevaCuenta({ 
                    datos: ResultadoValidacion.data 
                });
                
                let resultadoInsercion = parseInt(ResultadoInsercion.resultado);
                if (resultadoInsercion === 500) {
                    logger({ mensaje: ResultadoInsercion.mensaje });
                    res.status(resultadoInsercion).json({
                        error: true,
                        estado: ResultadoInsercion.resultado,
                        mensaje: 'Ha ocurrido un error en la base de datos al querer insertar los datos una nueva cuenta de acceso'
                    });
                } else {
                    res.status(resultadoInsercion).json({
                        error: resultadoInsercion !== 200,
                        estado: ResultadoInsercion.resultado,
                        mensaje: ResultadoInsercion.mensaje
                    });
                }
            } else {
                res.status(400).json({
                    error: true,
                    estado: 400,
                    mensaje: ResultadoValidacion.error.formErrors.fieldErrors
                });
            }
        } catch (error) {
            logger({ mensaje: error });
            res.status(500).json({
                error: true,
                estado: 500,
                mensaje: "Ha ocurrido un error al querer registrar el Acceso."
            });
        }
    }

    RecuperarContrasena = async(req, res) =>{
        try {
            const ResultadoValidacion = ValidarCorreo(req.body);

            if (!ResultadoValidacion.success) {
                return res.status(400).json({
                    error: true,
                    estado: 400,
                    mensaje: ResultadoValidacion.error.formErrors.fieldErrors
                });
            }

            const { correo } = ResultadoValidacion.data;
            const ResultadoRecuperacion = await this.modeloAcceso.RecuperarContrasena({
                correo: correo
            });

            //CLASE ESTÁTICA.
            /*        const ResultadoRecuperacion = await ModeloAcceso.RecuperarContraseña({
            correo: correo
            });*/

            let codigoResultado = parseInt(ResultadoRecuperacion.resultado); 
        
            if (codigoResultado == 200 ){
                const codigo = Math.floor(100000 + Math.random() * 900000);

                this.codigosRecuperacion.set(correo, {
                    codigo: codigo.toString(),
                    expira: Date.now() + 30 * 60 * 1000 
                });

            try {
                 const rutaPlantilla = path.join(process.cwd(), 'resources', 'plantillas', 'recuperacion-contrasena.html');
                 await EnviarCorreoDeVerificacion(rutaPlantilla, correo, codigo.toString());
                
                res.status(200).json({
                    error: false,
                    estado: 200,
                    mensaje: "Se ha enviado un código de recuperación a tu correo",
                    codigo: codigo // BORRAR ANTES DE VERSION FINAL. SOLO PARA PRUEBAS
                });
            } catch (error){
                logger({ mensaje: `Error al enviar correo de recuperación: ${error.message}` });
                res.status(500).json({
                    error: true,
                    estado: 500,
                    mensaje: "Ha ocurrido un error al intentar enviar código de cambio de contraseña"
                });
            }
        } else {
            res.status(codigoResultado).json({
                error: true,
                estado: codigoResultado,
                mensaje: ResultadoRecuperacion.mensaje
            });
        }

        } catch (error){
            logger({ mensaje: `Error en RecuperarContrasena: ${error}` });
            res.status(500).json({
                error: true,
                estado: 500,
                mensaje: "Ha ocurrido un error al intentar recuperar la contraseña"
            });
        }
    }

    VerificarCodigoYCambiarContrasena = async(req, res) => {
        try {   
            const ResultadoValidacion = ValidarCambioContraseña(req.body);

            if (!ResultadoValidacion.success) {
                return res.status(400).json({
                    error: true,
                    estado: 400,
                    mensaje: ResultadoValidacion.error.formErrors.fieldErrors
                });
            }

            const { correo, codigo, nuevaContrasenia } = ResultadoValidacion.data;
            
            const infoRecuperacion = this.codigosRecuperacion.get(correo);
            
            if (!infoRecuperacion) {
                return res.status(404).json({
                    error: true,
                    estado: 404,
                    mensaje: "No hay una solicitud de recuperación para este correo o ha expirado"
                });
            }
            
            if (Date.now() > infoRecuperacion.expira) {
                this.codigosRecuperacion.delete(correo);
                return res.status(401).json({
                    error: true,
                    estado: 401,
                    mensaje: "El código de verificación ha expirado"
                });
            }
            
            if (infoRecuperacion.codigo !== codigo) {
                return res.status(400).json({
                    error: true,
                    estado: 400,
                    mensaje: "El código de verificación es incorrecto"
                });
            }
            
            const ResultadoCambio = await this.modeloAcceso.CambiarContrasena({
                datos: { correo, nuevaContrasenia }
            });
            
            this.codigosRecuperacion.delete(correo);
            
            let codigoResultado = parseInt(ResultadoCambio.resultado);
            
            if (codigoResultado == 200) {
                res.status(200).json({
                    error: false,
                    estado: 200,
                    mensaje: "La contraseña ha sido actualizada exitosamente"
                });
            } else {
                res.status(codigoResultado).json({
                    error: true,
                    estado: codigoResultado,
                    mensaje: ResultadoCambio.mensaje
                });
            }
        } catch (error) {
            logger({ mensaje: `Error en VerificarCodigoYCambiarContrasena: ${error}` });
            res.status(500).json({
                error: true,
                estado: 500,
                mensaje: "Ha ocurrido un error al intentar cambiar la contraseña"
            });
        }
    }

VerificarCredenciales = async (req, res) => {
    try {
        const ResultadoValidacion = ValidarCredenciales(req.body);

        if (!ResultadoValidacion.success) {
            return res.status(400).json({
                error: true,
                estado: 400,
                mensaje: ResultadoValidacion.error.formErrors.fieldErrors
            });
        }

        const resultado = await this.modeloAcceso.VerificarCredenciales({ 
            datos: ResultadoValidacion.data 
        });

        let codigoResultado = parseInt(resultado.resultado);

        if (codigoResultado != 200) {
            return res.status(codigoResultado).json({
                error: true,
                estado: codigoResultado,
                mensaje: resultado.mensaje
            });
        }

        return res.status(200).json({
            error: false,
            estado: 200,
            mensaje: resultado.mensaje,
            datos: {
                idUsuarioRegistrado: resultado.datosAdicionales.idUsuarioRegistrado,
                nombre: resultado.datosAdicionales.nombre,
                fotoPerfil: resultado.datosAdicionales.fotoPerfil
            }
        });
    } catch (error) {
        logger({ mensaje: `Error al intentar verificar las credenciales de un usuario: ${error}` });
        res.status(500).json({
            error: true,
            estado: 500,
            mensaje: "Ha ocurrido un error al intentar iniciar sesión"
        });
    }
}
}