import express from 'express';
import { AccesoControlador } from '../controllers/AccesoControlador.js';
import { ValidarJwt } from '../middlewares/jwt.js';

export const CrearRutaAcceso = ({ ModeloAcceso }) => {
    const router = express.Router();
    const ControladorAcceso = new AccesoControlador({ModeloAcceso});

    router.post('/registro', ControladorAcceso.RegistrarAcceso);

    router.post('/registroAdmin', ControladorAcceso.RegistrarAccesoAdmin);

    router.post('/recuperarContrasena', ControladorAcceso.RecuperarContrasena);

    router.post('/verificarCodigoYCambiarContrasena', ControladorAcceso.VerificarCodigoYCambiarContrasena);

    router.post('/login', ControladorAcceso.VerificarCredenciales);

    router.post('/eliminar', ControladorAcceso.EliminarCuenta);

    router.post('/banearUsuario', ValidarJwt, ControladorAcceso.BanearUsuario)

    return router;
}