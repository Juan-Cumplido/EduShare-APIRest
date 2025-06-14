import express from 'express';
import { NotificacionControlador } from '../controllers/NotificacionControlador.js';
import { ValidarJwt } from '../middlewares/jwt.js';

export const CrearRutaNotificacion = ({ ModeloNotificacion }) => {
    const router = express.Router();
    const ControladorNotificacion = new NotificacionControlador({ModeloNotificacion});

    //router.post('/', ValidarJwt, ControladorNotificacion.RegistrarNotificacion);
    //router.get('/', ControladorNotificacion.ObtenerNotificacionesPropias)

    return router;
}