import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { CrearRutaAcceso } from './api_rest/routes/Acceso.js';


export const CrearServidorTest = ({ModeloAcceso}) => {
    const app = express();
    dotenv.config();
    app.use(json());
    app.use(cors());
    app.disable('x-powered-by');

    app.get('/',(req,res)=>{
        res.json({message: 'Bienvenido al servidor de pruebas de EduShare-API'});
    });

    app.use('/edushare/acceso', CrearRutaAcceso({ModeloAcceso}));


    const PUERTO = process.env.PUERTO_PRUEBAS;
    
    const server = app.listen(PUERTO, () => {
        console.log(`Servidor activo en la siguiente ruta http://localhost:${PUERTO}`);
    });
    return { app, server };
}
    