import { ModeloAcceso } from "../model/Acceso.js";
import { logger } from "../utilidades/logger.js";

export const ValidarAdminOPropietario = (modelo, campoId = 'id') => {
    return async (req, res, next) => {
        console.log('[Middleware] Inicio de ValidarAdminOPropietario');
        try {
            
            if (!req.idUsuario || typeof req.idUsuario !== 'number') {
                console.log('[Middleware] Error: Autenticación inválida');
                return res.status(401).json({
                    error: true,
                    estado: 401,
                    mensaje: 'Autenticación inválida'
                })
            }

            console.log('[Middleware] Obteniendo ID del recurso...');
            
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
                console.log('[Middleware] Error: ID del recurso es null, undefined o vacío')
                return res.status(400).json({
                    error: true,
                    estado: 400,
                    mensaje: `ID del recurso (${campoId}) es requerido`
                })
            }

            const idRecursoNumerico = parseInt(idRecurso, 10);
            console.log(`[Middleware] ID recurso convertido a número: ${idRecursoNumerico}`)
            
            if (isNaN(idRecursoNumerico) || idRecursoNumerico <= 0) {
                console.log('[Middleware] Error: ID no es un número válido');
                return res.status(400).json({
                    error: true,
                    estado: 400,
                    mensaje: 'ID del recurso debe ser un número válido'
                })
            }
            
            const esAdmin = await ModeloAcceso.EsAdmin(req.idUsuario);
            
            if (esAdmin) {
                console.log('[Middleware] Usuario es admin, acceso permitido')
                return next()
            }

            if (!modelo || typeof modelo.EsDueño !== 'function') {
                console.log('[Middleware] Error: Modelo no válido o método EsDueño no disponible')
                throw new Error('Modelo no válido para validación de propiedad')
            }
            
            const esPropietario = await modelo.EsDueño(idRecursoNumerico, req.idUsuario);
            console.log(`[Middleware] EsDueño result: ${esPropietario}`);
            
            if (esPropietario) {
                console.log('[Middleware] Usuario es propietario, acceso permitido');
                return next()
            }

            return res.status(403).json({
                error: true,
                estado: 403,
                mensaje: 'No cuentas con los permisos para esta acción'
            })

        } catch (error) {
            console.error('[Middleware] Error capturado:', error)
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