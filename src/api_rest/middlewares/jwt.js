import jwt from 'jsonwebtoken';
import {request,response} from 'express';
import { logger } from '../utilidades/logger.js';

export const ValidarJwt = (request,response, next) =>
{
    try
    {
        const HeaderAutenticacion = request.header('access_token');
        const Token = HeaderAutenticacion && HeaderAutenticacion.startsWith('Bearer ')
            ? HeaderAutenticacion.split(' ')[1]
            : null;
        if(Token)
        {
                const {correo, tipoDeUsuario} = jwt.verify(Token,process.env.SECRETO_JWT);
                request.correo = correo;
                request.tipoDeUsuario = tipoDeUsuario;
                next();
        }
        else
        {
            response.status(401).json(
            {
                error: true,
                estado: 401,
                mensaje: 'No hay un token dentro de la solicitud'
            })
        }
    }
    catch(error)
    {
        logger(error);
        response.status(401).json({
            error: true,
            estado: 401,
            mensaje: 'Token inválido'
        })
    }
}