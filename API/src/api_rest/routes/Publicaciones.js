import express from 'express';
import {PublicacionControlador} from '../controllers/PublicacionControlador.js';
import { ValidarJwt } from '../middlewares/jwt.js';
import { ValidarAdminOPropietario } from '../middlewares/ValidarAdminOPropietario.js';


export const CrearRutaPublicacion = ({ ModeloPublicacion }) => {
    const router = express.Router();
    const ControladorPublicacion = new PublicacionControlador({ ModeloPublicacion });

    router.post('/',ValidarJwt, ControladorPublicacion.CrearPublicacion)
    //router.put('/:idPublicacion', ValidarJwt, ValidarAdminOPropietario(ModeloPublicacion, 'idPublicacion'), ControladorPublicacion.ActualizarPublicacion)   
    //router.delete('/:idPublicacion', ValidarJwt, ValidarAdminOPropietario(ModeloPublicacion, 'idPublicacion'), ControladorPublicacion.EliminarPublicacion);

    //router.get('/', ControladorPublicacion.ObtenerPublicaciones);
    //router.get('/:idPublicacion', ControladorPublicacion.ObtenerPublicacionPorId);

    return router;
}