import express from 'express';
import { SeguimientoControlador } from '../controllers/SeguimientoControlador';
import { ValidarJwt } from '../middlewares/jwt.js';

export const CrearRutaSeguimiento = ({ SeguimientoControlador }) => {
    const router = express.Router();
    const ControladorSeguimiento = new SeguimientoControlador({ModeloSeguimiento});

    router.post('/seguir', ValidarJwt, ControladorSeguimiento.SeguirUsuario);

    router.delete('/dejar-de-seguir', ValidarJwt, ControladorSeguimiento.DejarDeSeguirUsuario);

    router.get('/verificar/:idUsuarioSeguido', ValidarJwt, ControladorSeguimiento.VerificarSeguimiento);

    router.get('/seguidores/:idUsuario', ControladorSeguimiento.ObtenerSeguidores);

    router.get('/seguidos/:idUsuario', ControladorSeguimiento.ObtenerSeguidos);
;
    return router;
}