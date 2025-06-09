import { logger } from "../utilidades/Logger.js";
import { manejarResultado, responderConExito, responderConError } from "../utilidades/Respuestas.js";
import { ValidarCreacionComentario } from "../schemas/Comentario.js";

export class ComentarioControlador {
    constructor({ ModeloComentario }) {
        this.modeloComentario = ModeloComentario;
    }

    CrearComentario = async (req, res) => {
        try {
            const { idUsuario } = req;
            const datosComentario = req.body;

            const ResultadoValidacion = ValidarCreacionComentario(datosComentario);

            if (!ResultadoValidacion.success) {
                return responderConError(res, 400, ResultadoValidacion.error.formErrors.fieldErrors);
            }

            const ResultadoCreacion = await this.modeloComentario.CrearComentario({
                idUsuario,
                datos: ResultadoValidacion.data
            });

            manejarResultado(res, ResultadoCreacion);
        } catch (error) {
            logger({ mensaje: `Error en CrearComentario: ${error}` });
            responderConError(res, 500, "Ha ocurrido un error al crear el comentario");
        }
    }

    EliminarComentario = async (req, res) => {
        try {
            const { idComentario } = req.params;
            
            const ResultadoEliminacion = await this.modeloComentario.EliminarComentario({
                idComentario: parseInt(idComentario)
            });

            manejarResultado(res, ResultadoEliminacion);
        } catch (error) {
            logger({ mensaje: `Error en EliminarComentario: ${error}` });
            responderConError(res, 500, "Ha ocurrido un error al eliminar el comentario");
        }
    }

    RecuperarComentarios = async (req, res) => {
        try {
            const { idPublicacion } = req.params;
            
            const ResultadoRecuperacion = await this.modeloComentario.RecuperarComentarios({
                idPublicacion: parseInt(idPublicacion)
            });

            if (ResultadoRecuperacion.resultado === 200) {
                responderConExito(res, ResultadoRecuperacion.mensaje, ResultadoRecuperacion.datos);
            } else {
                responderConError(res, ResultadoRecuperacion.resultado, ResultadoRecuperacion.mensaje);
            }
        } catch (error) {
            logger({ mensaje: `Error en RecuperarComentarios: ${error}` });
            responderConError(res, 500, "Ha ocurrido un error al recuperar los comentarios");
        }
    }
}