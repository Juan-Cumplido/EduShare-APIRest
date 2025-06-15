import { logger } from "../utilidades/Logger.js";
import { manejarResultado, responderConExito, responderConError } from "../utilidades/Respuestas.js";
import { ValidarNotificacion } from "../schemas/Notificacion.js";

export class NotificacionControlador{
    constructor({ModeloNotificacion}){
        this.modeloNotificacion = ModeloNotificacion
    }

    RegistrarNotificacion = async (req, res) => {
        try {
            const usuarioOrigenId = req.idUsuario;
            
            const ResultadoValidacion = ValidarNotificacion(req.body);
            
            if (!ResultadoValidacion.success) {
                return responderConError(res, 400, ResultadoValidacion.error.formErrors.fieldErrors);
            }

            const ResultadoRegistro = await this.modeloNotificacion.RegistrarNotificacion({
                datos: { ...ResultadoValidacion.data, usuarioOrigenId: usuarioOrigenId }
            });

            manejarResultado(res, ResultadoRegistro);

        } catch (error) {
            logger({ mensaje: `Error en RegistrarNotificacion: ${error.message}` });
            responderConError(res, 500, "Ha ocurrido un error al crear la notificación");
        }
    }

    ObtenerNotificacionesPropias = async (req, res) => {
        try {
            const usuarioDestinoId = req.idUsuario;
            
            const ResultadoRecuperacion = await this.modeloNotificacion.ObtenerNotificacionesPropias({
                datos: { usuarioDestinoId: usuarioDestinoId }
            });

            manejarResultado(res, ResultadoRecuperacion);
            
        } catch (error) {
            logger({ mensaje: `Error en ObtenerNotificacionesPropias: ${error}` });
            responderConError(res, 500, "Ha ocurrido un error al obtener las notificaciones");
        }
    }
}