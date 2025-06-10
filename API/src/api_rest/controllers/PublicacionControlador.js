import { ValidarInsercionPublicacion, ValidarEliminacionPublicacion } from "../schemas/Publicacion.js";
import { manejarResultado, responderConError, responderConExito, validarId } from "../utilidades/Respuestas.js";
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

    ObtenerPublicacionPorId = async (req, res) => {
        try {
            const { idPublicacion } = req.params;
            const id = parseInt(idPublicacion);
            
            if (!validarId(id, res, "la publicación")) {
                return
            }            

            const resultado = await this.modeloPublicacion.obtenerPublicacionPorId(id);
            manejarResultado(res, resultado);
        } catch (error) {
            logger({ mensaje: `Error en ObtenerPublicacionPorId: ${error}` });
            responderConError(res, 500, "Ha ocurrido un error al obtener la publicación");
        }
    }

    ObtenerPublicacionesPropias = async (req, res) => {
        try {
            const idUsuario = req.idUsuario; 
            const resultado = await this.modeloPublicacion.obtenerPublicacionesPropias(idUsuario);
            manejarResultado(res, resultado);
        } catch (error) {
            logger({ mensaje: `Error en ObtenerPublicacionesPropias: ${error}` });
            responderConError(res, 500, "Ha ocurrido un error al obtener las publicaciones propias");
        }
    }

    ObtenerPorCategoria = async (req, res) => {
        try {
            const { categoriaId } = req.params;
            const id = parseInt(categoriaId);
            
                if (!validarId(id, res, "la categoría")) {
                    return
                }

            const resultado = await this.modeloPublicacion.obtenerPublicacionesPorCategoria(id);
            manejarResultado(res, resultado);
        } catch (error) {
            logger({ mensaje: `Error en ObtenerPorCategoria: ${error}` });
            responderConError(res, 500, "Ha ocurrido un error al obtener las publicaciones por categoría");
        }
    }   

    ObtenerPorRama = async (req, res) => {
        try {
            const { ramaId } = req.params;
            const id = parseInt(ramaId);
            
            if (!validarId(id, res, "la rama")) {
                return
            }

            const resultado = await this.modeloPublicacion.obtenerPublicacionesPorRama(id);
            manejarResultado(res, resultado);
        } catch (error) {
            logger({ mensaje: `Error en ObtenerPorRama: ${error}` });
            responderConError(res, 500, "Ha ocurrido un error al obtener las publicaciones por rama");
        }
    }

    ObtenerPorNivelEducativo = async (req, res) => {
        try {
            const { nivelEducativo } = req.params;
            
            if (nivelEducativo !== 'Preparatoria' && nivelEducativo !== 'Universidad') {
                return responderConError(res, 400, "El nivel educativo debe ser 'Preparatoria' o 'Universidad'");
            }

            const resultado = await this.modeloPublicacion.obtenerPublicacionesPorNivelEducativo(nivelEducativo);
            manejarResultado(res, resultado);
        } catch (error) {
            logger({ mensaje: `Error en ObtenerPorNivelEducativo: ${error}` });
            responderConError(res, 500, "Ha ocurrido un error al obtener las publicaciones por nivel educativo");
        }
    }

    ObtenerPorUsuario = async (req, res) => {
        try {
            const { usuarioId } = req.params;
            const id = parseInt(usuarioId);
            
            if (!validarId(id, res, "el usuario")) {
                return
            }

            const resultado = await this.modeloPublicacion.obtenerPublicacionesPorUsuario(id);
            manejarResultado(res, resultado);
        } catch (error) {
            logger({ mensaje: `Error en ObtenerPorUsuario: ${error}` });
            responderConError(res, 500, "Ha ocurrido un error al obtener las publicaciones del usuario");
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