import express from 'express';
import {PublicacionControlador} from '../controllers/PublicacionControlador.js';
import { ValidarJwt } from '../middlewares/jwt.js';
import { ValidarAdminOPropietario } from '../middlewares/ValidarAdminOPropietario.js';
import { ValidarAdmin } from '../middlewares/ValidarAdmin.js';


export const CrearRutaPublicacion = ({ ModeloPublicacion }) => {
    const router = express.Router();
    const ControladorPublicacion = new PublicacionControlador({ ModeloPublicacion });

    router.post('/',ValidarJwt, ControladorPublicacion.CrearPublicacion)
    router.post('/documento', ValidarJwt, ControladorPublicacion.CrearDocumento)
    
    router.get('/', ControladorPublicacion.ObtenerPublicaciones);
    router.get('/me', ValidarJwt, ControladorPublicacion.ObtenerPublicacionesPropias)
    router.get('/:idPublicacion', ControladorPublicacion.ObtenerPublicacionPorId);

    router.get('/categoria/:categoriaId', ControladorPublicacion.ObtenerPorCategoria);
    router.get('/rama/:ramaId', ControladorPublicacion.ObtenerPorRama);
    router.get('/nivel/:nivelEducativo', ControladorPublicacion.ObtenerPorNivelEducativo);
    router.get('/usuario/:usuarioId', ControladorPublicacion.ObtenerPorUsuario);

    router.get('/:id/like', ValidarJwt, ControladorPublicacion.VerificarLike);
    router.post('/:id/like', ValidarJwt, ControladorPublicacion.DarLike);
    router.delete('/:id/like', ValidarJwt, ControladorPublicacion.QuitarLike);
    router.post('/:id/vista', ControladorPublicacion.RegistrarVisualizacion);
    router.post('/:id/descarga', ValidarJwt, ControladorPublicacion.RegistrarDescarga);

    router.patch('/:id/aprobar',ValidarJwt, ValidarAdmin, ControladorPublicacion.AprobarPublicacion);
    router.patch('/:id/rechazar',ValidarJwt, ValidarAdmin, ControladorPublicacion.RechazarPublicacion);

    //router.put('/:idPublicacion', ValidarJwt, ValidarAdminOPropietario(ModeloPublicacion, 'idPublicacion'), ControladorPublicacion.ActualizarPublicacion)   
    //router.delete('/:idPublicacion', ValidarJwt, ValidarAdminOPropietario(ModeloPublicacion, 'idPublicacion'), ControladorPublicacion.EliminarPublicacion);

    return router;
}