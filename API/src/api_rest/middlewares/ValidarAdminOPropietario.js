import { logger } from '../utilidades/logger.js';
import { ModeloAcceso } from '../model/Acceso.js';

export const ValidarAdminOPropietario = (ModeloRecurso, campoId = 'id') => {
    return async (req, res, next) => {

        if (!req.idUsuario || typeof req.idUsuario !== 'number') {
            logger({ mensaje: 'Middleware de autenticación no ejecutado correctamente' });
            return res.status(401).json({ error: true, estado:401, mensaje: 'Autenticación inválida' });
        }

        try {
            const idUsuario = req.idUsuario;
            const idRecurso = req.params[campoId] || req.body[campoId];
            
            if (!idUsuario) {
                return res.status(401).json({
                    error: true,
                    estado: 401,
                    mensaje: 'Usuario no autenticado'
                });
            }

            if (!idRecurso) {
                return res.status(400).json({
                    error: true,
                    estado: 400,
                    mensaje: `ID del recurso (${campoId}) es requerido`
                });
            }

            try {

                const UsuarioEsAdmin = await ModeloAcceso.EsAdmin(idUsuario)
                const UsuarioEsDueño = await ModeloRecurso.EsDueño(idRecurso, idUsuario)

                if (UsuarioEsAdmin || UsuarioEsDueño) {
                    next();
                } else {
                    return res.status(403).json({
                        error: true,
                        estado: 403,
                        mensaje: 'No cuentas con los permisos para esta acción'
                    });
                }
            } catch (error) {
                logger({ mensaje: `Error verificando permisos del usuario: ${error}` });
                return res.status(500).json({
                    error: true,
                    estado: 500,
                    mensaje: 'Error al verificar permisos'
                });
            }

        } catch (error) {
            logger({ mensaje: `Error en validación flexible: ${error}` });
            res.status(500).json({
                error: true,
                estado: 500,
                mensaje: 'Error al verificar permisos'
            });
        }
    };
};