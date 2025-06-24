import express, { json, urlencoded } from 'express';
import { CrearRutaAcceso } from './api_rest/routes/Acceso.js';
import { CrearRutaPublicacion } from './api_rest/routes/Publicaciones.js';
import { CrearRutaCatalogo } from './api_rest/routes/Catalogo.js';
import { CrearRutaSeguimiento } from './api_rest/routes/Seguimiento.js';
import { CrearRutaPerfil } from './api_rest/routes/Perfil.js';
import { CrearRutaComentario } from './api_rest/routes/Comentario.js';
import { CrearRutaNotificacion } from './api_rest/routes/Notificacion.js';
import { DocumentoSwagger } from './api_rest/utilidades/swagger.js';
import swaggerUI from 'swagger-ui-express';
import dotenv from 'dotenv';
import cors from 'cors';


export const CrearServidor = ({ModeloAcceso, ModeloPublicacion, ModeloCatalogo, ModeloSeguimiento, ModeloPerfil, ModeloComentario, ModeloNotificacion}) => {
    const app = express();
    dotenv.config();
    app.use(json({limit:'100mb'}));
    app.use(urlencoded({limit:'100mb', extended:true}))
    app.use(cors());
    app.disable('x-powered-by');

    app.use('/edushare/acceso', CrearRutaAcceso({ModeloAcceso}));
    app.use('/edushare/publicaciones', CrearRutaPublicacion({ModeloPublicacion}));
    app.use('/edushare/catalogo', CrearRutaCatalogo({ModeloCatalogo}))
    app.use('/edushare/seguimiento', CrearRutaSeguimiento({ModeloSeguimiento}))
    app.use('/edushare/perfil', CrearRutaPerfil({ModeloPerfil}))
    app.use('/edushare/comentario', CrearRutaComentario ({ModeloComentario}))
    app.use('/edushare/notificacion', CrearRutaNotificacion ({ModeloNotificacion}));
    app.use('/edushare/doc',swaggerUI.serve, swaggerUI.setup(DocumentoSwagger));

    const PUERTO = process.env.PUERTO;

    app.listen(PUERTO,()=>{
        console.log(`Servidor activo en la siguiente ruta http://"localhost":${PUERTO}`);
    })

}