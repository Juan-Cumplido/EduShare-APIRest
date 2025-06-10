import { ModeloAcceso } from '../model/ModeloAcceso.js';
import { logger } from '../utilidades/Logger.js';

export const ValidarAdminOPropietario = (modelo, campoId = 'id') => {
    return async (req, res, next) => {
        try {
            
            if (!req.idUsuario || typeof req.idUsuario !== 'number') {
                return res.status(401).json({
                    error: true,
                    estado: 401,
                    mensaje: 'Autenticación inválida'
                })
            }
            
            let idRecurso
            
            if (req.params && req.params[campoId] !== undefined) {
                idRecurso = req.params[campoId]
            } else if (req.body && req.body[campoId] !== undefined) {
                idRecurso = req.body[campoId]
            } else {
                return res.status(400).json({
                    error: true,
                    estado: 400,
                    mensaje: `ID del recurso (${campoId}) es requerido`
                })
            }

            if (idRecurso === null || idRecurso === undefined || idRecurso === '') {
                return res.status(400).json({
                    error: true,
                    estado: 400,
                    mensaje: `ID del recurso (${campoId}) es requerido`
                })
            }

            const idRecursoNumerico = parseInt(idRecurso, 10);
            
            if (isNaN(idRecursoNumerico) || idRecursoNumerico <= 0) {
                return res.status(400).json({
                    error: true,
                    estado: 400,
                    mensaje: 'ID del recurso debe ser un número válido'
                })
            }
            
            const esAdmin = await ModeloAcceso.EsAdmin(req.idUsuario);
            
            if (esAdmin) {
                return next()
            }

            if (!modelo || typeof modelo.EsDueño !== 'function') {
                throw new Error('Modelo no válido para validación de propiedad')
            }
            
            const esPropietario = await modelo.EsDueño(idRecursoNumerico, req.idUsuario);
            
            if (esPropietario) {
                return next()
            } 

            return res.status(403).json({
                error: true,
                estado: 403,
                mensaje: 'No cuentas con los permisos para esta acción'
            })

        } catch (error) {
            logger(`Error en ValidarAdminOPropietario: ${error.message}`)
            
            if (error.message.includes('Modelo no válido') || 
                error.message.includes('requerido') || 
                error.message.includes('número válido')) {
                return res.status(400).json({
                    error: true,
                    estado: 400,
                    mensaje: error.message
                })
            }
            
            return res.status(500).json({
                error: true,
                estado: 500,
                mensaje: 'Error interno del servidor al validar permisos'
            })
        }
    }
}