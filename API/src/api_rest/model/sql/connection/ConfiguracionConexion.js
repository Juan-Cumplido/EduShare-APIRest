import dotenv from 'dotenv';
dotenv.config();

const conexionUsuarioRegistrado = {
    user: process.env.DB_USUARIOREGISTRADO,
    password: process.env.DB_CONTRASENIAUSUARIOREGISTRADO,
    server: process.env.DB_SERVIDOR,
    database: process.env.DB_BASEDEDATOS,
    port: parseInt(process.env.DB_PUERTO),
    options: {
        encrypt: process.env.DB_ENCRIPTADO === 'true',
        trustServerCertificate: process.env.DB_CONFIAR_SERVIDOR === 'true'
    }
}

export function RetornarTipoDeConexion()
{
    let conexion;
    conexion = conexionUsuarioRegistrado;
    return conexion;
}