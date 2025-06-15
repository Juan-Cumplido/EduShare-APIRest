import express from 'express';
import { ComentarioControlador } from '../controllers/ComentarioControlador.js';
import { ValidarJwt } from '../middlewares/jwt.js';
import { ValidarAdminOPropietario } from '../middlewares/ValidarAdminOPropietario.js';

export const CrearRutaComentario = ({ ModeloComentario }) => {
    const router = express.Router();
    const ControladorComentario = new ComentarioControlador({ModeloComentario});
    
    router.post('/', ValidarJwt, ControladorComentario.CrearComentario);
    router.delete('/:idComentario', ValidarJwt, ValidarAdminOPropietario(ModeloComentario, 'idComentario'),
        ControladorComentario.EliminarComentario);
    router.get('/publicacion/:idPublicacion', ControladorComentario.RecuperarComentarios);
    
    return router;
}   