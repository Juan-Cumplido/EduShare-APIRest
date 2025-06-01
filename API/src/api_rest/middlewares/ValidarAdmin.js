import { ModeloAcceso } from '../model/Acceso.js';
import { logger } from '../utilidades/logger.js';


export const ValidarAdmin = async (req, res, next) => {
    try {
        const idUsuario = req.idUsuario;
        
        if (!idUsuario) {
            return res.status(401).json({
                error: true,
                estado: 401,
                mensaje: 'Usuario no autenticado'
            });
        }

        const adminInfo = await ModeloAcceso.VerificarAdmin({ idUsuario });
        
        if (!adminInfo || adminInfo.tipoAcceso !== 'Administrador') {
            return res.status(403).json({
                error: true,
                estado: 403,
                mensaje: 'No tiene permisos de administrador para realizar esta acción'
            });
        }

        next();
    } catch (error) {
        logger({ mensaje: `Error en validación de administrador: ${error}` });
        res.status(500).json({
            error: true,
            estado: 500,
            mensaje: 'Error al verificar permisos de administrador'
        });
    }
};
