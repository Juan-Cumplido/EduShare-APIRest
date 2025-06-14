import { ValidarInsercionPublicacion, ValidarEliminacionPublicacion, ValidarInsercionDocumento } from "../schemas/Publicacion.js";
import { manejarResultado, responderConError, responderConExito, validarId } from "../utilidades/Respuestas.js";
import { logger } from "../utilidades/Logger.js";

export class PublicacionControlador {
    constructor({ ModeloPublicacion }) {
        this.modeloPublicacion = ModeloPublicacion;
    }

    CrearDocumento = async (req, res) => {
        try {
            const datosDocumento = {
                titulo: req.body.titulo,
                ruta: req.body.ruta,
                idUsuarioRegistrado: req.idUsuario
            };

            const ResultadoValidacion = ValidarInsercionDocumento(datosDocumento);

            if (!ResultadoValidacion.success) {
                return res.status(400).json({
                    error: true,
                    estado: 400,
                    mensaje: ResultadoValidacion.error.formErrors
                });
            }

            const ResultadoInsercion = await this.modeloPublicacion.InsertarDocumento(ResultadoValidacion.data);

            console.log("ResultadoInsercion:", ResultadoInsercion);

            return res.status(ResultadoInsercion.resultado).json({
                error: false,
                estado: ResultadoInsercion.resultado,
                mensaje: ResultadoInsercion.mensaje,
                id: ResultadoInsercion.id // o lo que sea que estés retornando
            });

        } catch (error) {
            console.error("Error en CrearDocumento:", error);
            return res.status(500).json({
                error: true,
                estado: 500,
                mensaje: "Ha ocurrido un error al crear el documento"
            });
        }
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
                const ResultadoInsercion = await this.modeloPublicacion.InsertarPublicacion(ResultadoValidacion.data)

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

    ObtenerPublicaciones = async (req, res) => {
        try {
            const resultado = await this.modeloPublicacion.ObtenerPublicaciones();
            manejarResultado(res, resultado);
        } catch (error) {
            logger({ mensaje: `Error en ObtenerPublicaciones: ${error}` });
            responderConError(res, 500, "Ha ocurrido un error al obtener las publicaciones");
        }
    }

    ObtenerPublicacionesPendientes = async (req, res) => {
        try {
            const resultadoRecuperacion = await this.modeloPublicacion.ObtenerPublicacionesPendientes();
            manejarResultado(res, resultadoRecuperacion)
        } catch (error){
            logger({ mensaje: `Error en ObtenerPublicacionesPendientes: ${error}` });
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

            const resultado = await this.modeloPublicacion.ObtenerPublicacionPorId(id);
            manejarResultado(res, resultado);
        } catch (error) {
            logger({ mensaje: `Error en ObtenerPublicacionPorId: ${error}` });
            responderConError(res, 500, "Ha ocurrido un error al obtener la publicación");
        }
    }

    ObtenerPublicacionesPropias = async (req, res) => {
        try {
            const idUsuario = req.idUsuario; 
            const resultado = await this.modeloPublicacion.ObtenerPublicacionesPropias(idUsuario);
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

            const resultado = await this.modeloPublicacion.ObtenerPublicacionesPorCategoria(id);
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

            const resultado = await this.modeloPublicacion.ObtenerPublicacionesPorRama(id);
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

            const resultado = await this.modeloPublicacion.ObtenerPublicacionesPorNivelEducativo(nivelEducativo);
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

            const resultado = await this.modeloPublicacion.ObtenerPublicacionesPorUsuario(id);
            manejarResultado(res, resultado);
        } catch (error) {
            logger({ mensaje: `Error en ObtenerPorUsuario: ${error}` });
            responderConError(res, 500, "Ha ocurrido un error al obtener las publicaciones del usuario");
        }
    }

    DarLike = async (req, res) => {
        try {
            const { id } = req.params;
            const idPublicacion = parseInt(id);
            const idUsuario = req.idUsuario;

            if (!validarId(idPublicacion, res, "la publicación")) {
                return;
            }

            const resultado = await this.modeloPublicacion.DarLike(idPublicacion, idUsuario);
            manejarResultado(res, resultado);
        } catch (error) {
            logger({ mensaje: `Error en DarLike: ${error}` });
            responderConError(res, 500, "Ha ocurrido un error al dar like a la publicación");
        }
    }

    QuitarLike = async (req, res) => {
        try {
            const { id } = req.params;
            const idPublicacion = parseInt(id);
            const idUsuario = req.idUsuario;

            if (!validarId(idPublicacion, res, "la publicación")) {
                return;
            }

            const resultado = await this.modeloPublicacion.QuitarLike(idPublicacion, idUsuario);
            manejarResultado(res, resultado);
        } catch (error) {
            logger({ mensaje: `Error en QuitarLike: ${error}` });
            responderConError(res, 500, "Ha ocurrido un error al quitar like de la publicación");
        }
    }

    VerificarLike = async (req, res) => {
        try {
            const { id } = req.params;
            const idPublicacion = parseInt(id);
            const idUsuario = req.idUsuario;

            if (!validarId(idPublicacion, res, "la publicación")) {
                return;
            }

            const resultado = await this.modeloPublicacion.VerificarLike(idPublicacion, idUsuario);
            manejarResultado(res, resultado);
        } catch (error) {
            logger({ mensaje: `Error en VerificarLike: ${error}` });
            responderConError(res, 500, "Ha ocurrido un error al verificar el like de la publicación");
        }
    }

    EliminarPublicacion = async (req, res) => {
        try {
            const { idPublicacion } = req.params;
            
            const datosEliminacion = {
                idPublicacion: parseInt(idPublicacion),
            };
            
            const ResultadoValidacion = ValidarEliminacionPublicacion(datosEliminacion);
            
            if (!ResultadoValidacion.success) {
                console.log("Error en validación:", ResultadoValidacion.error);
                return responderConError(res, 400, ResultadoValidacion.error.formErrors);
            }
            
            const ResultadoEliminacion = await this.modeloPublicacion.EliminarPublicacion(ResultadoValidacion.data.idPublicacion);

            manejarResultado(res, ResultadoEliminacion);
            
        } catch (error) {
            console.log("Error en controlador EliminarPublicacion:", error);
            logger({ mensaje: `Error en EliminarPublicacion: ${error}` });
            responderConError(res, 500, "Ha ocurrido un error al eliminar la publicación");
        }
    }

    RegistrarVisualizacion = async (req, res) => {
        try {
            const { id } = req.params;
            const idPublicacion = parseInt(id);

            if (!validarId(idPublicacion, res, "la publicación")) {
                return;
            }

            const resultado = await this.modeloPublicacion.RegistrarVisualizacion(idPublicacion);
            manejarResultado(res, resultado);
        } catch (error) {
            logger({ mensaje: `Error en RegistrarVisualizacion: ${error}` });
            responderConError(res, 500, "Ha ocurrido un error al registrar la visualización");
        }
    }

    RegistrarDescarga = async (req, res) => {
        try {
            const { id } = req.params;
            const idPublicacion = parseInt(id);

            if (!validarId(idPublicacion, res, "la publicación")) {
                return;
            }

            const resultado = await this.modeloPublicacion.RegistrarDescarga(idPublicacion);
            manejarResultado(res, resultado);
        } catch (error) {
            logger({ mensaje: `Error en RegistrarDescarga: ${error}` });
            responderConError(res, 500, "Ha ocurrido un error al registrar la descarga");
        }
    }

    AprobarPublicacion = async (req, res) => {
        try {
            const { id } = req.params;
            const idPublicacion = parseInt(id);

            if (!validarId(idPublicacion, res, "la publicación")) {
                return;
            }

            const resultado = await this.modeloPublicacion.AprobarPublicacion(idPublicacion);
            manejarResultado(res, resultado);
        } catch (error) {
            logger({ mensaje: `Error en AprobarPublicacion: ${error}` });
            responderConError(res, 500, "Ha ocurrido un error al aprobar la publicación");
        }
    }

    RechazarPublicacion = async (req, res) => {
        try {
            const { id } = req.params;
            const idPublicacion = parseInt(id);

            if (!validarId(idPublicacion, res, "la publicación")) {
                return;
            }

            const resultado = await this.modeloPublicacion.RechazarPublicacion(idPublicacion);
            manejarResultado(res, resultado);
        } catch (error) {
            logger({ mensaje: `Error en RechazarPublicacion: ${error}` });
            responderConError(res, 500, "Ha ocurrido un error al rechazar la publicación");
        }
    }
}