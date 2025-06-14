import { logger } from "../utilidades/Logger.js";
import { manejarResultado, responderConExito, responderConError } from "../utilidades/Respuestas.js";
import { ValidarActualizacionAvatar, ValidarActualizacionPerfil } from "../schemas/Perfil.js";

export class NotificacionControlador{
    constructor({ModeloNotificacion}){
        this.modeloPerfil = ModeloNotificacion
    }


}