import express from 'express';
import { SeguimientoControlador } from '../controllers/SeguimientoControlador.js';
import { ValidarJwt } from '../middlewares/jwt.js';

export const CrearRutaSeguimiento = ({ ModeloSeguimiento }) => {
    const router = express.Router();
    const ControladorSeguimiento = new SeguimientoControlador({ModeloSeguimiento});

    router.use(ValidarJwt);

    router.post('/seguir', ControladorSeguimiento.SeguirUsuario);

    router.delete('/dejar-seguir', ControladorSeguimiento.DejarDeSeguirUsuario);

    router.get('/seguidores', ControladorSeguimiento.ObtenerSeguidores);

    router.get('/seguidos', ControladorSeguimiento.ObtenerSeguidos);

    router.get('/verificar/:idUsuario', ControladorSeguimiento.VerificarSeguimiento);

    return router;
}