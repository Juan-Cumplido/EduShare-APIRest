import express from 'express';
import { PerfilControlador } from '../controllers/PerfilControlador.js';
import { ValidarJwt } from '../middlewares/jwt.js';

export const CrearRutaPerfil = ({ ModeloPerfil }) => {
    const router = express.Router();
    const ControladorPerfil = new PerfilControlador({ModeloPerfil});
    
    router.get('/me', ValidarJwt, ControladorPerfil.ObtenerPerfilPropio);
    router.put('/me', ValidarJwt, ControladorPerfil.ActualizarPerfil);
    router.put('/me/avatar', ValidarJwt, ControladorPerfil.ActualizarAvatar);

    router.get('/', ControladorPerfil.ObtenerPerfiles);
    router.get('/:idUsuario', ControladorPerfil.ObtenerPerfilPorId);

    return router;
}