import { ValidarInsercionPublicacion, ValidarEliminacionPublicacion } from "../schemas/Publicacion.js";
import { manejarResultado, responderConError, responderConExito } from "../utilidades/Respuestas.js";
import { logger } from "../utilidades/Logger.js";

export class PublicacionControlador {
    constructor({ ModeloPublicacion }) {
        this.modeloPublicacion = ModeloPublicacion;
    }

    CrearPublicacion = async (req, res) => {
        try {

            const datosPublicacion = {
                idCategoria: req.body.idCategoria,
                resuContenido: req.body.resuContenido,
                estado: "EnRevision",
                nivelEducativo: req.body.nivelEducativo,
                idUsuarioRegistrado: req.idUsuario,
                idMateriaYRama: req.body.idMateriaYRama, 
                idDocumento: req.body.idDocumento
            };

            const ResultadoValidacion = ValidarInsercionPublicacion(datosPublicacion)   

            if (ResultadoValidacion.success) {
                const ResultadoInsercion = await this.modeloPublicacion.insertarPublicacion(ResultadoValidacion.data)

                let resultadoInsercion = parseInt(ResultadoInsercion.resultado)
                
                if (resultadoInsercion === 500) {
                    logger({ mensaje: ResultadoInsercion.mensaje });
                    res.status(resultadoInsercion).json({
                        error: true,
                        estado: ResultadoInsercion.resultado,
                        mensaje: 'Ha ocurrido un error en la base de datos al querer insertar la publicación'
                    });
                } else {
                    res.status(resultadoInsercion).json({
                        error: resultadoInsercion !== 201,
                        estado: ResultadoInsercion.resultado,
                        mensaje: ResultadoInsercion.mensaje,
                        id: ResultadoInsercion.id
                    });
                }
            } else {

                res.status(400).json({
                    error: true,
                    estado: 400,
                    mensaje: ResultadoValidacion.error.formErrors
                });
            }
        } catch (error) {
            console.error('[Controlador] Error inesperado:', error); 
            logger({ mensaje: error });
            res.status(500).json({
                error: true,
                estado: 500,
                mensaje: "Ha ocurrido un error al querer crear la publicación."
            });
        }
    }

    ObtenerPublicaciones = async (req, res) => {
        try {
            const resultado = await this.modeloPublicacion.obtenerPublicaciones();
            manejarResultado(res, resultado);
        } catch (error) {
            logger({ mensaje: `Error en ObtenerPublicaciones: ${error}` });
            responderConError(res, 500, "Ha ocurrido un error al obtener las publicaciones");
        }
    }

    EliminarPublicacion = async (req, res) => {
        try {
            const { id } = req.params;
            
            const datosEliminacion = {
                idPublicacion: parseInt(id),
                idUsuario: req.idUsuario
            };
            
            const ResultadoValidacion = ValidarEliminacionPublicacion(datosEliminacion);
            
            if (!ResultadoValidacion.success) {
                return responderConError(res, 400, ResultadoValidacion.error.formErrors);
            }

            const ResultadoEliminacion = await this.modeloPublicacion.eliminarPublicacion(
                ResultadoValidacion.data.idPublicacion,
                ResultadoValidacion.data.idUsuario
            );

            manejarResultado(res, ResultadoEliminacion);
        } catch (error) {
            logger({ mensaje: `Error en EliminarPublicacion: ${error}` });
            responderConError(res, 500, "Ha ocurrido un error al eliminar la publicación");
        }
    }
}