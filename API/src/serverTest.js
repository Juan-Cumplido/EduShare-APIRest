import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { CrearRutaAcceso } from './api_rest/routes/Acceso.js';
import { CrearRutaCatalogo } from './api_rest/routes/Catalogo.js';
import { CrearRutaSeguimiento } from './api_rest/routes/Seguimiento.js';
import { ValidarJwt } from './api_rest/middlewares/jwt.js';
import { ValidarAdmin } from './api_rest/middlewares/ValidarAdmin.js';

export const CrearServidorTest = ({ModeloAcceso, ModeloCatalogo, ModeloSeguimiento}) => {
    const app = express();
    dotenv.config();
    app.use(json());
    app.use(cors());
    app.disable('x-powered-by');

    app.use('/edushare/acceso', CrearRutaAcceso({ModeloAcceso}));
    app.use('/edushare/catalogo', CrearRutaCatalogo({ModeloCatalogo}))
    app.use('/edushare/seguimiento', CrearRutaSeguimiento({ModeloSeguimiento}))

    app.get('/test/admin', ValidarJwt, ValidarAdmin, (req, res) => {
        res.status(200).json({
            success: true,
            mensaje: 'Acceso autorizado como administrador'
        });
    });
    
    const PUERTO = process.env.PUERTO_PRUEBAS;
    
    const server = app.listen(PUERTO, () => {
        console.log(`Servidor activo en la siguiente ruta http://localhost:${PUERTO}`);
    });
    return { app, server };
}
    