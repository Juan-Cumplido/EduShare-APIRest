import { ValidarInsercionPublicacion, ValidarEdicionPublicacion, ValidarEliminacionPublicacion } from "../schemas/Publicacion.js";
import { logger } from "../utilidades/logger.js";

export class PublicacionControlador {
    constructor({ ModeloPublicaciones }) {
        this.modeloPublicaciones = ModeloPublicaciones;
    }

    CrearPublicacion = async (req, res) => {
        try {
            const ResultadoValidacion = ValidarInsercionPublicacion(req.body);
            if (ResultadoValidacion.success) {
                const ResultadoInsercion = await this.modeloPublicaciones.insertarPublicacion(ResultadoValidacion.data);
                let resultadoInsercion = parseInt(ResultadoInsercion.resultado);
                
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
                        datos: ResultadoInsercion.datos
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
            const { limite = 10, pagina = 1, categoria, nivelEducativo, idRama, idMateria } = req.query;
            
            // Crear filtros basados en parámetros de consulta
            const filtros = {};
            if (categoria) filtros.categoria = categoria;
            if (nivelEducativo) filtros.nivelEducativo = nivelEducativo;
            if (idRama) filtros.idRama = parseInt(idRama);
            if (idMateria) filtros.idMateria = parseInt(idMateria);
            
            const opciones = {
                limite: parseInt(limite),
                pagina: parseInt(pagina)
            };
            
            const publicaciones = await this.modeloPublicaciones.obtenerPublicaciones(filtros, opciones);
            
            res.status(200).json({
                error: false,
                estado: 200,
                mensaje: "Publicaciones obtenidas correctamente",
                datos: publicaciones.datos,
                paginacion: {
                    total: publicaciones.total,
                    pagina: opciones.pagina,
                    limite: opciones.limite,
                    totalPaginas: Math.ceil(publicaciones.total / opciones.limite)
                }
            });
        } catch (error) {
            logger({ mensaje: error });
            res.status(500).json({
                error: true,
                estado: 500,
                mensaje: "Ha ocurrido un error al obtener las publicaciones."
            });
        }
    }

    ObtenerPublicacionPorId = async (req, res) => {
        try {
            const { id } = req.params;
            
            if (!id || isNaN(parseInt(id))) {
                return res.status(400).json({
                    error: true,
                    estado: 400,
                    mensaje: "ID de publicación inválido"
                });
            }
            
            const publicacion = await this.modeloPublicaciones.obtenerPublicacionPorId(parseInt(id));
            
            if (!publicacion) {
                return res.status(404).json({
                    error: true,
                    estado: 404,
                    mensaje: "Publicación no encontrada"
                });
            }
            
            res.status(200).json({
                error: false,
                estado: 200,
                mensaje: "Publicación obtenida correctamente",
                datos: publicacion
            });
        } catch (error) {
            logger({ mensaje: error });
            res.status(500).json({
                error: true,
                estado: 500,
                mensaje: "Ha ocurrido un error al obtener la publicación."
            });
        }
    }

    ActualizarPublicacion = async (req, res) => {
        try {
            const { id } = req.params;
            
            if (!id || isNaN(parseInt(id))) {
                return res.status(400).json({
                    error: true,
                    estado: 400,
                    mensaje: "ID de publicación inválido"
                });
            }
            
            // Combinar el ID con los datos del cuerpo
            const datosActualizacion = {
                idPublicacion: parseInt(id),
                ...req.body
            };
            
            const ResultadoValidacion = ValidarEdicionPublicacion(datosActualizacion);
            
            if (ResultadoValidacion.success) {
                const ResultadoActualizacion = await this.modeloPublicaciones.actualizarPublicacion(
                    ResultadoValidacion.data.idPublicacion, 
                    ResultadoValidacion.data
                );
                
                let resultadoActualizacion = parseInt(ResultadoActualizacion.resultado);
                
                if (resultadoActualizacion === 500) {
                    logger({ mensaje: ResultadoActualizacion.mensaje });
                    res.status(resultadoActualizacion).json({
                        error: true,
                        estado: ResultadoActualizacion.resultado,
                        mensaje: 'Ha ocurrido un error en la base de datos al actualizar la publicación'
                    });
                } else if (resultadoActualizacion === 404) {
                    res.status(resultadoActualizacion).json({
                        error: true,
                        estado: ResultadoActualizacion.resultado,
                        mensaje: 'Publicación no encontrada'
                    });
                } else {
                    res.status(resultadoActualizacion).json({
                        error: resultadoActualizacion !== 200,
                        estado: ResultadoActualizacion.resultado,
                        mensaje: ResultadoActualizacion.mensaje,
                        datos: ResultadoActualizacion.datos
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
            logger({ mensaje: error });
            res.status(500).json({
                error: true,
                estado: 500,
                mensaje: "Ha ocurrido un error al actualizar la publicación."
            });
        }
    }

    EliminarPublicacion = async (req, res) => {
        try {
            const { id } = req.params;
            
            if (!id || isNaN(parseInt(id))) {
                return res.status(400).json({
                    error: true,
                    estado: 400,
                    mensaje: "ID de publicación inválido"
                });
            }
            
            const datosEliminacion = {
                idPublicacion: parseInt(id)
            };
            
            const ResultadoValidacion = ValidarEliminacionPublicacion(datosEliminacion);
            
            if (ResultadoValidacion.success) {
                const ResultadoEliminacion = await this.modeloPublicaciones.eliminarPublicacion(
                    ResultadoValidacion.data.idPublicacion
                );
                
                let resultadoEliminacion = parseInt(ResultadoEliminacion.resultado);
                
                if (resultadoEliminacion === 500) {
                    logger({ mensaje: ResultadoEliminacion.mensaje });
                    res.status(resultadoEliminacion).json({
                        error: true,
                        estado: ResultadoEliminacion.resultado,
                        mensaje: 'Ha ocurrido un error en la base de datos al eliminar la publicación'
                    });
                } else if (resultadoEliminacion === 404) {
                    res.status(resultadoEliminacion).json({
                        error: true,
                        estado: ResultadoEliminacion.resultado,
                        mensaje: 'Publicación no encontrada'
                    });
                } else {
                    res.status(resultadoEliminacion).json({
                        error: resultadoEliminacion !== 200,
                        estado: ResultadoEliminacion.resultado,
                        mensaje: ResultadoEliminacion.mensaje
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
            logger({ mensaje: error });
            res.status(500).json({
                error: true,
                estado: 500,
                mensaje: "Ha ocurrido un error al eliminar la publicación."
            });
        }
    }
}