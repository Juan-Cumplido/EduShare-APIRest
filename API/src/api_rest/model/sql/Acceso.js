import sql from 'mssql';
import path from 'path';
import { promises as fs } from 'fs';
import { RetornarTipoDeConexion } from './connection/ConfiguracionConexion.js';
import { MensajeDeRetornoBaseDeDatosAcceso, MensajeDeRetornoBaseDeDatos } from '../../utilidades/Constantes.js';

export class ModeloAcceso {

    static async InsertarNuevaCuenta({ datos }) {
        let resultadoInsercion;
        const ConfiguracionConexion = RetornarTipoDeConexion();
        let conexion;
        try {
            conexion = await sql.connect(ConfiguracionConexion);
            const {
                correo,
                contrasenia,
                nombreUsuario, 
                estado = 'Activo',
                tipoAcceso = 'Registrado',
                nombre,
                primerApellido,
                segundoApellido,
                fotoPerfil,    
                idInstitucion,
            } = datos;

            let fotoPerfilBuffer
            if (!fotoPerfil) {
                try {
                    const defaultImagePath = path.join(process.cwd(), 'resources', 'imagen-por-defecto.jpg');
                    fotoPerfilBuffer = await fs.readFile(defaultImagePath);
                    console.log(defaultImagePath);
                } catch (error) {
                    console.log('Error al cargar imagen por defecto:', error);
                    fotoPerfilBuffer = null; 
                }
            } else {
                fotoPerfilBuffer = fotoPerfil;
            }

            const Solicitud = conexion.request();
            const ResultadoSolicitud = await Solicitud
                .input('correo', sql.NVarChar(256), correo)
                .input('contrasenia', sql.NVarChar(300), contrasenia)
                .input('nombreUsuario', sql.NVarChar(15), nombreUsuario)
                .input('estado', sql.NVarChar(10), estado)
                .input('tipoAcceso', sql.NVarChar(20), tipoAcceso)
                .input('nombre', sql.NVarChar(30), nombre)
                .input('primerApellido', sql.NVarChar(30), primerApellido)
                .input('segundoApellido', sql.NVarChar(30), segundoApellido)
                .input('fotoPerfil', sql.VarBinary(sql.MAX), fotoPerfilBuffer)
                .input('idInstitucion', sql.Int, idInstitucion)

                .output('resultado', sql.Int)
                .output('mensaje', sql.NVarChar(200))
                .execute('spi_InsertarCuentaConUsuarioRegistrado');

            resultadoInsercion = MensajeDeRetornoBaseDeDatosAcceso({ datos: ResultadoSolicitud.output });
        } catch (error) {
            console.log(`Error en InsertarNuevaCuenta: ${error.message}`)
            //logger({ mensaje: `Error en InsertarNuevaCuenta: ${error.message}` });
        } finally {
            if (conexion) {
                await sql.close();
            }
        }
        return resultadoInsercion;
    }

    static async RecuperarContrasena({ correo }) {
        let resultadoRecuperacion;
        const ConfiguracionConexion = RetornarTipoDeConexion();
        let conexion;
        try {
            conexion = await sql.connect(ConfiguracionConexion);
                
            const Solicitud = conexion.request();
            const ResultadoSolicitud = await Solicitud 
                .input('correo', sql.NVarChar(256), correo)
                .output('resultado', sql.Int)
                .output('mensaje', sql.NVarChar(200))
                .execute('spi_RecuperarContraseñaCorreo');

            resultadoRecuperacion = MensajeDeRetornoBaseDeDatosAcceso({ datos: ResultadoSolicitud.output });
        } catch (error) {
            console.log(`Error al intentar recuperar la contraseña con el correo: ${error.message}`);
            logger({ mensaje: `Error al intentar recuperar la contraseña con el correo: ${error.message}` });
        } finally {
            if (conexion) {
                await sql.close();
            }
        }
        return resultadoRecuperacion;
    }

    static async CambiarContrasena({ datos }) {
        let resultadoCambio;
        const ConfiguracionConexion = RetornarTipoDeConexion();
        let conexion;
        try {
            conexion = await sql.connect(ConfiguracionConexion);

            const {
                correo,
                nuevaContrasenia
            } = datos;
            
            const Solicitud = conexion.request();
            const ResultadoSolicitud = await Solicitud 
                .input('correo', sql.NVarChar(256), correo)
                .input('nuevaContrasenia', sql.NVarChar(300), nuevaContrasenia)
                .output('resultado', sql.Int)
                .output('mensaje', sql.NVarChar(200))
                .execute('spi_CambiarContrasena');

            resultadoCambio = MensajeDeRetornoBaseDeDatosAcceso({ datos: ResultadoSolicitud.output });
        } catch (error) {
            console.log(`Error al intentar cambiar la contraseña: ${error.message}`)
            logger({ mensaje: `Error al intentar cambiar la contraseña: ${error.message}` });
        } finally {
            if (conexion) {
                await sql.close();
            }
        }
        return resultadoCambio;
    }
}
