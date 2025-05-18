import express, { json } from 'express';
import { CrearRutaAcceso } from './api_rest/routes/Acceso.js';
import { CrearRutaPublicacion } from './api_rest/routes/Publicaciones.js';


import { DocumentoSwagger } from './api_rest/utilidades/swagger.js';
import swaggerUI from 'swagger-ui-express';
import dotenv from 'dotenv';
import cors from 'cors';



export const CrearServidor = ({ModeloAcceso, ModeloPublicaciones}) => 
{
    const app = express();
    dotenv.config();
    app.use(json());
    app.use(cors());
    app.disable('x-powered-by');

    /**
     * @swagger
     * tags:
     *  name: Welcome
     *  description: Ruta de bienvenida a la API
     */
    app.get('/edushare',(req,res)=>{
        res.json({message: 'Bienvenido al servidor de EduShare-API'});
    })

    app.use('/edushare/acceso', CrearRutaAcceso({ModeloAcceso}));

    app.use('/edushare/publicaciones', CrearRutaPublicacion({ModeloPublicaciones}));
    
    app.use('/edushare/doc',swaggerUI.serve, swaggerUI.setup(DocumentoSwagger));

    const PUERTO = process.env.PUERTO;

    app.listen(PUERTO,()=>{
        console.log(`Servidor activo en la siguiente ruta http://localhost:${PUERTO}`);
    })
}