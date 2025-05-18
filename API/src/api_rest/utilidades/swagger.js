import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

const NombreArchivo = fileURLToPath(import.meta.url);
const Directorio = dirname(NombreArchivo);
dotenv.config();

const Documento = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'EduShare API Rest',
            version: '1.0.0',
            description: 'API de EduShare, ducumentos educativos y más',
        },
        servers: [
            {
                url: 'http://localhost:'+process.env.PUERTO+'/eduShare'
            },
        ],
    },
    components: {
        securitySchemes: {
            bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
            } 
        }
    },
    apis: [path.resolve(Directorio, '../routes/*.js')],
};

export const DocumentoSwagger = swaggerJsdoc(Documento);