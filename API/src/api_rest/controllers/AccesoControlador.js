import { ValidarInsercionAcceso, ValidarCredenciales, ValidarCambioContraseña, ValidarCorreo, ValidarEliminacionCuenta, ValidarBaneo} from "../schemas/Acceso.js";
import { logger } from "../utilidades/logger.js";
import path from 'path';
import {EnviarCorreoDeVerificacion} from "../utilidades/Correo.js";
import { GenerarJWT } from "../utilidades/generadorjwt.js";

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
                
                const respuesta = {
                    error: false,
                    estado: 200,
                    mensaje: "Se ha enviado un código de recuperación a tu correo"
                };

                if (process.env.TEST == 'TRUE') {
                    respuesta.codigo = codigo;
                }

                res.status(200).json(respuesta);
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

            try {
                const payloadJWT = { 
                    idUsuario: resultado.datosAdicionales.idUsuarioRegistrado 
                };
                
                const token = await GenerarJWT(payloadJWT);
                
                return res.status(200).json({
                    error: false,
                    estado: 200,
                    mensaje: resultado.mensaje,
                    token: token, // Incluir el token en la respuesta
                    datos: {
                        idUsuario: resultado.datosAdicionales.idUsuarioRegistrado,
                        nombre: resultado.datosAdicionales.nombre,
                        fotoPerfil: resultado.datosAdicionales.fotoPerfil
                    }
                });
            } catch (errorToken) {
                logger({ mensaje: `Error al generar JWT: ${errorToken}` });
                return res.status(500).json({
                    error: true,
                    estado: 500,
                    mensaje: "Error al generar token de autenticación"
                });
            }
        } catch (error) {
            logger({ mensaje: `Error al intentar verificar las credenciales de un usuario: ${error}` });
            res.status(500).json({
                error: true,
                estado: 500,
                mensaje: "Ha ocurrido un error al intentar iniciar sesión"
            });
        }
    }

    EliminarCuenta = async (req, res) => {
        try {
            const ResultadoValidacion = ValidarEliminacionCuenta(req.body);

            if (!ResultadoValidacion.success) {
                return res.status(400).json({
                    error: true,
                    estado: 400,
                    mensaje: ResultadoValidacion.error.formErrors.fieldErrors
                });
            }

            const resultado = await this.modeloAcceso.EliminarCuenta({ 
                datos: ResultadoValidacion.data 
            });

            let codigoResultado = parseInt(resultado.resultado);

            if (codigoResultado !== 200) {
                return res.status(codigoResultado).json({
                    error: true,
                    estado: codigoResultado,
                    mensaje: resultado.mensaje
                });
            }

            return res.status(200).json({
                error: false,
                estado: 200,
                mensaje: resultado.mensaje
            });
    } catch (error) {
            logger({ mensaje: `Error al intentar eliminar la cuenta: ${error}` });
            res.status(500).json({
                error: true,
                estado: 500,
                mensaje: "Ha ocurrido un error al intentar eliminar la cuenta"
            });
        }
    }   

    BanearUsuario = async (req, res) => {
        try{
            const ResultadoValidacion = ValidarBaneo(req.body);

            if (!ResultadoValidacion.success){  
                return res.status(400).json({
                    error: true,
                    estado: 400,
                    mensaje: ResultadoValidacion.error.formErrors.fieldErrors
                });
            }   

            const idAdministrador = req.idUsuario; 

            const adminUser = await this.modeloAcceso.VerificarAdmin({ idUsuario: idAdministrador });
        
            if (!adminUser || adminUser.tipoAcceso !== 'Administrador') {
            return res.status(403).json({
                error: true,
                estado: 403,
                mensaje: 'No tiene permisos para realizar esta acción.'
            });
        }

            const datosBaneo = {
                idUsuarioRegistrado: ResultadoValidacion.data.idUsuarioRegistrado,
                idAdministrador: idAdministrador 
            };

            const resultado = await this.modeloAcceso.BanearUsuario({
                datos: datosBaneo
            })

            let codigoResultado = parseInt(resultado.resultado);
            
            if (codigoResultado !== 200) {
                return res.status(codigoResultado).json({
                    error: true,
                    estado: codigoResultado,
                    mensaje: resultado.mensaje
                });
            }

            return res.status(200).json({
                error: false,
                estado: 200,
                mensaje: resultado.mensaje
            });
        } catch (error){
            logger({ mensaje: `Error al intentar banear al usuario: ${error}` });
            res.status(500).json({
                error: true,
                estado: 500,
                mensaje: "Ha ocurrido un error al intentar banear al usuario"
            });
        }
    }

    RegistrarAccesoAdmin = async (req, res) => {
        try {
            const ResultadoValidacion = ValidarInsercionAcceso(req.body);

            if (ResultadoValidacion.success) {
                const ResultadoInsercion = await this.modeloAcceso.InsertarNuevaCuentaAdmin({ 
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
}