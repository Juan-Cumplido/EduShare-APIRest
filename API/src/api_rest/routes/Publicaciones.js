import express from 'express';
import {PublicacionControlador} from '../controllers/PublicacionControlador.js';

export const CrearRutaPublicacion = ({ ModeloPublicacion }) => {
    const router = express.Router();
    const controladorPublicacion = new PublicacionControlador({ ModeloPublicacion });

 
    router.post('/', controladorPublicacion.CrearPublicacion);

    router.get('/', controladorPublicacion.ObtenerPublicaciones);

    router.get('/:id', controladorPublicacion.ObtenerPublicacionPorId);

    router.put('/:id', controladorPublicacion.ActualizarPublicacion);

    router.delete('/:id', controladorPublicacion.EliminarPublicacion);

    return router;
}