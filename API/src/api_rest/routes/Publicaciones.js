import express from 'express';
import {PublicacionControlador} from '../controllers/PublicacionControlador.js';
import { ValidarJwt } from '../middlewares/jwt.js';
import { ValidarAdminOPropietario } from '../middlewares/ValidarAdminOPropietario.js';


export const CrearRutaPublicacion = ({ ModeloPublicacion }) => {
    const router = express.Router();
    const ControladorPublicacion = new PublicacionControlador({ ModeloPublicacion });

    router.post('/',ValidarJwt, ControladorPublicacion.CrearPublicacion);
    router.put('/:id', ControladorPublicacion.ActualizarPublicacion);
    router.delete('/:id', ValidarJwt, ValidarAdminOPropietario(ModeloPublicacion, 'id'), ControladorPublicacion.EliminarPublicacion);

    router.get('/', ControladorPublicacion.ObtenerPublicaciones);
    router.get('/:id', ControladorPublicacion.ObtenerPublicacionPorId);

    return router;
}