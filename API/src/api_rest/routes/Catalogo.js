import express from 'express';
import { CatalogoControlador } from '../controllers/CatalogoControlador.js';

export const CrearRutaCatalogo = ({ ModeloCatalogo }) => {
    const router = express.Router();
    const ControladorCatalogo = new CatalogoControlador({ModeloCatalogo});

    router.get('/categorias', ControladorCatalogo.RecuperarCategorias);

    router.get('/ramas', ControladorCatalogo.RecuperarRamas);

    router.get('/materias', ControladorCatalogo.RecuperarMaterias)

    router.get('/instituciones', ControladorCatalogo.RecuperarInstituciones)
    
    return router;
}