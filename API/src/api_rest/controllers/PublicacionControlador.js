import { ValidarInsercionPublicacion, ValidarEliminacionPublicacion } from "../schemas/Publicacion.js";
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
                estado: req.body.estado,
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
            logger({ mensaje: error });
            res.status(500).json({
                error: true,
                estado: 500,
                mensaje: "Ha ocurrido un error al querer crear la publicación."
            });
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
            
            if (ResultadoValidacion.success) {
                const ResultadoEliminacion = await this.modeloPublicacion.eliminarPublicacion(
                    ResultadoValidacion.data.idPublicacion,
                    ResultadoValidacion.data.idUsuario
                );
                
                let resultadoEliminacion = parseInt(ResultadoEliminacion.resultado);
                
                switch(resultadoEliminacion) {
                    case 200:
                        res.status(200).json({
                            error: false,
                            estado: 200,
                            mensaje: ResultadoEliminacion.mensaje,
                            //data: { idPublicacion: id }
                        });
                        break;
                    case 403:
                        res.status(403).json({
                            error: true,
                            estado: 403,
                            mensaje: 'No tienes permiso para eliminar esta publicación'
                        });
                        break;
                    case 404:
                        res.status(404).json({
                            error: true,
                            estado: 404,
                            mensaje: 'Publicación no encontrada'
                        });
                        break;
                    case 500:
                        logger({ mensaje: ResultadoEliminacion.mensaje });
                        res.status(500).json({
                            error: true,
                            estado: 500,
                            mensaje: 'Ha ocurrido un error en la base de datos al eliminar la publicación'
                        });
                        break;
                    default:
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