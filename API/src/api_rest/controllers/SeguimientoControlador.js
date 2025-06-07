import { ValidarSeguimiento, ValidarConsultaSeguimiento } from "../schemas/Seguimiento.js";
import { logger } from "../utilidades/Logger.js";

export class SeguimientoControlador {
    constructor({ ModeloSeguimiento }) {
        this.modeloSeguimiento = ModeloSeguimiento;
    }

   SeguirUsuario = async (req, res) => {
        try {
            const datos = {
                idUsuarioSeguidor: req.idUsuario,
                idUsuarioSeguido: parseInt(req.body.idUsuarioSeguido)
            };

            const ResultadoValidacion = ValidarSeguimiento(datos);

            if (!ResultadoValidacion.success) {
                return res.status(400).json({
                    error: true,
                    estado: 400,
                    mensaje: ResultadoValidacion.error.formErrors.fieldErrors
                });
            }

            const ResultadoSeguimiento = await this.modeloSeguimiento.SeguirUsuario({
                datos: ResultadoValidacion.data
            });

            let codigoResultado = parseInt(ResultadoSeguimiento.resultado);

            res.status(codigoResultado).json({
                error: codigoResultado !== 200,
                estado: codigoResultado,
                mensaje: ResultadoSeguimiento.mensaje
            });

        } catch (error) {
            logger({ mensaje: `Error al seguir usuario: ${error}` });
            res.status(500).json({
                error: true,
                estado: 500,
                mensaje: "Ha ocurrido un error al intentar seguir al usuario"
            });
        }
    }

    DejarDeSeguirUsuario = async (req, res) => {
        try {
            const datos = {
                idUsuarioSeguidor: req.idUsuario,
                idUsuarioSeguido: parseInt(req.body.idUsuarioSeguido)
            };

            const ResultadoValidacion = ValidarSeguimiento(datos);

            if (!ResultadoValidacion.success) {
                return res.status(400).json({
                    error: true,
                    estado: 400,
                    mensaje: ResultadoValidacion.error.formErrors.fieldErrors
                });
            }

            const ResultadoDejarSeguir = await this.modeloSeguimiento.DejarDeSeguirUsuario({
                datos: ResultadoValidacion.data
            });

            let codigoResultado = parseInt(ResultadoDejarSeguir.resultado);

            res.status(codigoResultado).json({
                error: codigoResultado !== 200,
                estado: codigoResultado,
                mensaje: ResultadoDejarSeguir.mensaje
            });

        } catch (error) {
            logger({ mensaje: `Error al dejar de seguir usuario: ${error}` });
            res.status(500).json({
                error: true,
                estado: 500,
                mensaje: "Ha ocurrido un error al intentar dejar de seguir al usuario"
            });
        }
    }

    ObtenerSeguidores = async (req, res) => {
        try {
            const datos = {
                idUsuario: req.idUsuario
            };

            const ResultadoValidacion = ValidarConsultaSeguimiento(datos);

            if (!ResultadoValidacion.success) {
                return res.status(400).json({
                    error: true,
                    estado: 400,
                    mensaje: ResultadoValidacion.error.formErrors.fieldErrors
                });
            }

            const ResultadoSeguidores = await this.modeloSeguimiento.ObtenerSeguidores({
                datos: ResultadoValidacion.data
            });

            let codigoResultado = parseInt(ResultadoSeguidores.resultado);

            if (codigoResultado !== 200) {
                return res.status(codigoResultado).json({
                    error: true,
                    estado: codigoResultado,
                    mensaje: ResultadoSeguidores.mensaje
                });
            }

            res.status(200).json({
                error: false,
                estado: 200,
                mensaje: ResultadoSeguidores.mensaje,
                datos: ResultadoSeguidores.datos
            });

        } catch (error) {
            logger({ mensaje: `Error al obtener seguidores: ${error}` });
            res.status(500).json({
                error: true,
                estado: 500,
                mensaje: "Ha ocurrido un error al obtener los seguidores"
            });
        }
    }

    ObtenerSeguidos = async (req, res) => {
        try {
            const datos = {
                idUsuario: req.idUsuario
            };

            const ResultadoValidacion = ValidarConsultaSeguimiento(datos);

            if (!ResultadoValidacion.success) {
                return res.status(400).json({
                    error: true,
                    estado: 400,
                    mensaje: ResultadoValidacion.error.formErrors.fieldErrors
                });
            }

            const ResultadoSeguidos = await this.modeloSeguimiento.ObtenerSeguidos({
                datos: ResultadoValidacion.data
            });

            let codigoResultado = parseInt(ResultadoSeguidos.resultado);

            if (codigoResultado !== 200) {
                return res.status(codigoResultado).json({
                    error: true,
                    estado: codigoResultado,
                    mensaje: ResultadoSeguidos.mensaje
                });
            }

            res.status(200).json({
                error: false,
                estado: 200,
                mensaje: ResultadoSeguidos.mensaje,
                datos: ResultadoSeguidos.datos
            });

        } catch (error) {
            logger({ mensaje: `Error al obtener seguidos: ${error}` });
            res.status(500).json({
                error: true,
                estado: 500,
                mensaje: "Ha ocurrido un error al obtener los usuarios seguidos"
            });
        }
    }

    VerificarSeguimiento = async (req, res) => {
        try {
            const datos = {
                idUsuarioSeguidor: req.idUsuario,
                idUsuarioSeguido: parseInt(req.params.idUsuario)
            };

            const ResultadoValidacion = ValidarSeguimiento(datos);

            if (!ResultadoValidacion.success) {
                return res.status(400).json({
                    error: true,
                    estado: 400,
                    mensaje: ResultadoValidacion.error.formErrors.fieldErrors
                });
            }

            const ResultadoVerificacion = await this.modeloSeguimiento.VerificarSeguimiento({
                datos: ResultadoValidacion.data
            });

            let codigoResultado = parseInt(ResultadoVerificacion.resultado);

            res.status(codigoResultado).json({
                error: codigoResultado !== 200,
                estado: codigoResultado,
                mensaje: ResultadoVerificacion.mensaje,
                siguiendo: codigoResultado === 200
            });

        } catch (error) {
            logger({ mensaje: `Error al verificar seguimiento: ${error}` });
            res.status(500).json({
                error: true,
                estado: 500,
                mensaje: "Ha ocurrido un error al verificar el seguimiento"
            });
        }
    }
}