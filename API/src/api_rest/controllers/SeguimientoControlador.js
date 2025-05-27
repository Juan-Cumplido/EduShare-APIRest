import { ValidarSeguimiento, ValidarIdUsuario } from "../schemas/Seguimiento.js";
import { logger } from "../utilidades/logger.js";

export class SeguimientoControlador {
    constructor({ ModeloSeguimiento }) {
        this.modeloSeguimiento = ModeloSeguimiento;
    }

    SeguirUsuario = async (req, res) => {
        try {
            const idUsuarioSeguidor = req.idUsuario; // Del JWT
            const { idUsuarioSeguido } = req.body;

            // Validar que el usuario del JWT coincida con el que hace la solicitud
            if (!idUsuarioSeguidor) {
                return this.responderConError(res, 401, "Token de autenticación inválido");
            }

            const resultadoValidacion = ValidarSeguimiento({ 
                idUsuarioSeguidor, 
                idUsuarioSeguido 
            });

            if (!resultadoValidacion.success) {
                const errores = resultadoValidacion.error.formErrors.fieldErrors;
                return this.responderConError(res, 400, errores);
            }

            const { idUsuarioSeguidor: seguidorValidado, idUsuarioSeguido: seguidoValidado } = resultadoValidacion.data;
            
            const resultado = await this.modeloSeguimiento.SeguirUsuario({
                idUsuarioSeguidor: seguidorValidado,
                idUsuarioSeguido: seguidoValidado
            });

            this.manejarResultadoOperacion(res, resultado);

        } catch (error) {
            logger(`Error en SeguirUsuario: ${error}`);
            this.responderConError(res, 500, "Ha ocurrido un error al seguir al usuario");
        }
    }

    DejarDeSeguirUsuario = async (req, res) => {
        try {
            const idUsuarioSeguidor = req.idUsuario; // Del JWT
            const { idUsuarioSeguido } = req.body;

            // Validar que el usuario del JWT coincida con el que hace la solicitud
            if (!idUsuarioSeguidor) {
                return this.responderConError(res, 401, "Token de autenticación inválido");
            }

            const resultadoValidacion = ValidarSeguimiento({ 
                idUsuarioSeguidor, 
                idUsuarioSeguido 
            });

            if (!resultadoValidacion.success) {
                const errores = resultadoValidacion.error.formErrors.fieldErrors;
                return this.responderConError(res, 400, errores);
            }

            const { idUsuarioSeguidor: seguidorValidado, idUsuarioSeguido: seguidoValidado } = resultadoValidacion.data;
            
            const resultado = await this.modeloSeguimiento.DejarDeSeguirUsuario({
                idUsuarioSeguidor: seguidorValidado,
                idUsuarioSeguido: seguidoValidado
            });

            this.manejarResultadoOperacion(res, resultado);

        } catch (error) {
            logger(`Error en DejarDeSeguirUsuario: ${error}`);
            this.responderConError(res, 500, "Ha ocurrido un error al dejar de seguir al usuario");
        }
    }

    VerificarSeguimiento = async (req, res) => {
        try {
            const idUsuarioSeguidor = req.idUsuario; // Del JWT
            const { idUsuarioSeguido } = req.params;

            // Validar que el usuario del JWT esté presente
            if (!idUsuarioSeguidor) {
                return this.responderConError(res, 401, "Token de autenticación inválido");
            }

            const resultadoValidacion = ValidarSeguimiento({ 
                idUsuarioSeguidor, 
                idUsuarioSeguido: parseInt(idUsuarioSeguido)
            });

            if (!resultadoValidacion.success) {
                const errores = resultadoValidacion.error.formErrors.fieldErrors;
                return this.responderConError(res, 400, errores);
            }

            const { idUsuarioSeguidor: seguidorValidado, idUsuarioSeguido: seguidoValidado } = resultadoValidacion.data;
            
            const resultado = await this.modeloSeguimiento.VerificarSeguimiento({
                idUsuarioSeguidor: seguidorValidado,
                idUsuarioSeguido: seguidoValidado
            });

            const codigo = parseInt(resultado.estado);
            
            if (codigo === 200) {
                this.responderConExito(res, resultado.mensaje, {
                    siguiendo: resultado.siguiendo === 1
                });
            } else {
                this.responderConError(res, codigo, resultado.mensaje);
            }

        } catch (error) {
            logger(`Error en VerificarSeguimiento: ${error}`);
            this.responderConError(res, 500, "Ha ocurrido un error al verificar el seguimiento");
        }
    }

    ObtenerSeguidores = async (req, res) => {
        try {
            const { idUsuario } = req.params;

            const resultadoValidacion = ValidarIdUsuario({ idUsuario: parseInt(idUsuario) });

            if (!resultadoValidacion.success) {
                const errores = resultadoValidacion.error.formErrors.fieldErrors;
                return this.responderConError(res, 400, errores);
            }

            const { idUsuario: idUsuarioValidado } = resultadoValidacion.data;
            
            const resultado = await this.modeloSeguimiento.RecuperarSeguidores({
                idUsuario: idUsuarioValidado
            });

            const codigo = parseInt(resultado.estado);
            
            if (codigo === 200) {
                this.responderConExito(res, resultado.mensaje, {
                    seguidores: resultado.datos || []
                });
            } else {
                this.responderConError(res, codigo, resultado.mensaje);
            }

        } catch (error) {
            logger(`Error en ObtenerSeguidores: ${error}`);
            this.responderConError(res, 500, "Ha ocurrido un error al obtener los seguidores");
        }
    }

    ObtenerSeguidos = async (req, res) => {
        try {
            const { idUsuario } = req.params;

            const resultadoValidacion = ValidarIdUsuario({ idUsuario: parseInt(idUsuario) });

            if (!resultadoValidacion.success) {
                const errores = resultadoValidacion.error.formErrors.fieldErrors;
                return this.responderConError(res, 400, errores);
            }

            const { idUsuario: idUsuarioValidado } = resultadoValidacion.data;
            
            const resultado = await this.modeloSeguimiento.RecuperarSeguidos({
                idUsuario: idUsuarioValidado
            });

            const codigo = parseInt(resultado.estado);
            
            if (codigo === 200) {
                this.responderConExito(res, resultado.mensaje, {
                    seguidos: resultado.datos || []
                });
            } else {
                this.responderConError(res, codigo, resultado.mensaje);
            }

        } catch (error) {
            logger(`Error en ObtenerSeguidos: ${error}`);
            this.responderConError(res, 500, "Ha ocurrido un error al obtener los usuarios seguidos");
        }
    }

    manejarResultadoOperacion = (res, resultado) => {
        const codigo = parseInt(resultado.resultado);
        
        if (codigo === 200 || codigo === 201) {
            this.responderConExito(res, resultado.mensaje);
        } else {
            this.responderConError(res, codigo, resultado.mensaje);
        }
    }

    responderConExito = (res, mensaje, datos = null) => {
        const respuesta = {
            error: false,
            estado: 200,
            mensaje
        };

        if (datos) {
            respuesta.datos = datos;
        }

        res.status(200).json(respuesta);
    }

    responderConError = (res, codigo, mensaje) => {
        res.status(codigo).json({
            error: true,
            estado: codigo,
            mensaje
        });
    }
}