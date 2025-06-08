import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { CrearRutaAcceso } from './api_rest/routes/Acceso.js';
import { CrearRutaCatalogo } from './api_rest/routes/Catalogo.js';
import { CrearRutaSeguimiento } from './api_rest/routes/Seguimiento.js';
import { CrearRutaPublicacion } from './api_rest/routes/Publicaciones.js';
import { CrearRutaPerfil } from './api_rest/routes/Perfil.js';
import { ValidarJwt } from './api_rest/middlewares/jwt.js';
import { ValidarAdmin } from './api_rest/middlewares/ValidarAdmin.js';
import { ValidarAdminOPropietario } from './api_rest/middlewares/ValidarAdminOPropietario.js';

export const CrearServidorTest = ({ModeloAcceso, ModeloCatalogo, ModeloSeguimiento, ModeloPublicacion, ModeloPerfil}) => {
    const app = express();
    dotenv.config();
    app.use(json());
    app.use(cors());
    app.disable('x-powered-by');

    app.use('/edushare/acceso', CrearRutaAcceso({ModeloAcceso}));
    app.use('/edushare/catalogo', CrearRutaCatalogo({ModeloCatalogo}))
    app.use('/edushare/seguimiento', CrearRutaSeguimiento({ModeloSeguimiento}))
    app.use('/edushare/publicacion', CrearRutaPublicacion({ModeloPublicacion}));
    app.use('/edushare/perfil', CrearRutaPerfil({ModeloPerfil}))

    app.get('/test/admin', ValidarJwt, ValidarAdmin, (req, res) => {
        res.status(200).json({
            success: true,
            mensaje: 'Acceso autorizado como administrador'
        });
    });

    app.get('/test/admin-propietario/:id', 
        ValidarJwt, 
        ValidarAdminOPropietario(ModeloPublicacion), 
        (req, res) => {
            res.status(200).json({
                success: true,
                mensaje: 'Acceso autorizado como administrador o propietario',
                idRecurso: req.params.id,
                idUsuario: req.idUsuario
            });
        }
    );

    // Ruta para probar con body en lugar de params
    app.put('/test/admin-propietario-body', 
        ValidarJwt, 
        ValidarAdminOPropietario(ModeloPublicacion), 
        (req, res) => {
            res.status(200).json({
                success: true,
                mensaje: 'Acceso autorizado como administrador o propietario (body)',
                idRecurso: req.body.id,
                idUsuario: req.idUsuario
            });
        }
    );

    // Ruta sin parámetro ID para probar error 400
    app.get('/test/admin-propietario-sin-id', 
        ValidarJwt, 
        ValidarAdminOPropietario(ModeloPublicacion), 
        (req, res) => {
            res.status(200).json({
                success: true,
                mensaje: 'Esta ruta no debería ejecutarse'
            });
        }
    );

    // Ruta con campo personalizado
    app.get('/test/admin-propietario-custom/:idPublicacion', 
        ValidarJwt, 
        ValidarAdminOPropietario(ModeloPublicacion, 'idPublicacion'), 
        (req, res) => {
            res.status(200).json({
                success: true,
                mensaje: 'Acceso autorizado con campo personalizado',
                idRecurso: req.params.idPublicacion,
                idUsuario: req.idUsuario
            });
        }
    );

    // Ruta sin parámetro para campo personalizado
    app.get('/test/admin-propietario-custom-sin-id', 
        ValidarJwt, 
        ValidarAdminOPropietario(ModeloPublicacion, 'idPublicacion'), 
        (req, res) => {
            res.status(200).json({
                success: true,
                mensaje: 'Esta ruta no debería ejecutarse'
            });
        }
    );    
    
    const PUERTO = process.env.PUERTO_PRUEBAS;
    
    const server = app.listen(PUERTO, () => {
        console.log(`Servidor activo en la siguiente ruta http://localhost:${PUERTO}`);
    });
    return { app, server };
}
    