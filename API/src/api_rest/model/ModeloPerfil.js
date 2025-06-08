import sql from 'mssql';
import { RetornarTipoDeConexion } from './sql/connection/ConfiguracionConexion.js';
import { MensajeDeRetornoBaseDeDatosCatalogo, MensajeDeRetornoBaseDeDatosAcceso } from '../utilidades/Constantes.js';

export class ModeloPerfil {

    static async ObtenerPerfilPropio({ idUsuario }) {
        let resultadoRecuperacion;
        const ConfiguracionConexion = RetornarTipoDeConexion();
        let conexion;
        
        try {
            conexion = await sql.connect(ConfiguracionConexion);

            const Solicitud = conexion.request();
            const ResultadoSolicitud = await Solicitud
                .input('idUsuario', sql.Int, idUsuario)
                .output('resultado', sql.Int)
                .output('mensaje', sql.NVarChar(200))
                .execute('sps_ObtenerPerfilPropio');

            resultadoRecuperacion = MensajeDeRetornoBaseDeDatosCatalogo({
                datos: ResultadoSolicitud.output,
                recordset: ResultadoSolicitud.recordset
            });

        } catch (error) {
            throw error;
        } finally {
            if (conexion) {
                await sql.close();
            }
        }
        return resultadoRecuperacion;
    }

    static async ObtenerPerfilPorId({ idUsuario }) {
        let resultadoRecuperacion;
        const ConfiguracionConexion = RetornarTipoDeConexion();
        let conexion;
        
        try {
            conexion = await sql.connect(ConfiguracionConexion);

            const Solicitud = conexion.request();
            const ResultadoSolicitud = await Solicitud
                .input('idUsuario', sql.Int, parseInt(idUsuario))
                .output('resultado', sql.Int)
                .output('mensaje', sql.NVarChar(200))
                .execute('sps_ObtenerPerfilPorId');

            resultadoRecuperacion = MensajeDeRetornoBaseDeDatosCatalogo({
                datos: ResultadoSolicitud.output,
                recordset: ResultadoSolicitud.recordset
            });

        } catch (error) {
            throw error;
        } finally {
            if (conexion) {
                await sql.close();
            }
        }
        return resultadoRecuperacion;
    }

    static async ActualizarPerfil({ idUsuario, datos }) {
        let resultadoActualizacion;
        const ConfiguracionConexion = RetornarTipoDeConexion();
        let conexion;
        
        try {
            conexion = await sql.connect(ConfiguracionConexion);

            const {
                nombre,
                correo,
                primerApellido,
                segundoApellido,
                nombreUsuario,
                idInstitucion
            } = datos;


            const Solicitud = conexion.request();
            const ResultadoSolicitud = await Solicitud
                .input('idUsuario', sql.Int, idUsuario)
                .input('correo', sql.NVarChar(256), correo)
                .input('nombre', sql.NVarChar(30), nombre)
                .input('primerApellido', sql.NVarChar(30), primerApellido)
                .input('segundoApellido', sql.NVarChar(30), segundoApellido || null)
                .input('nombreUsuario', sql.NVarChar(15), nombreUsuario)
                .input('idInstitucion', sql.Int, idInstitucion)
                .output('resultado', sql.Int)
                .output('mensaje', sql.NVarChar(200))
                .execute('spu_ActualizarPerfil');

            resultadoActualizacion = MensajeDeRetornoBaseDeDatosCatalogo({
                datos: ResultadoSolicitud.output,
                recordset: ResultadoSolicitud.recordset
            });
        } catch (error) {
            throw error;
        } finally {
            if (conexion) {
                await sql.close();
            }
        }
        return resultadoActualizacion;
    }

    static async ActualizarAvatar({ idUsuario, datos }) {
        let resultadoActualizacion;
        const ConfiguracionConexion = RetornarTipoDeConexion();
        let conexion;
        
        try {
            conexion = await sql.connect(ConfiguracionConexion);

            const {
                fotoPerfil
            } = datos;

            const Solicitud = conexion.request();
            const ResultadoSolicitud = await Solicitud
                .input('idUsuario', sql.Int, idUsuario)
                .input('fotoPerfil', sql.NVarChar(sql.MAX), fotoPerfil)
                .output('resultado', sql.Int)
                .output('mensaje', sql.NVarChar(200))
                .execute('spu_ActualizarAvatar');

            resultadoActualizacion = MensajeDeRetornoBaseDeDatosAcceso({ datos: ResultadoSolicitud.output });
        } catch (error) {
            throw error;
        } finally {
            if (conexion) {
                await sql.close();
            }
        }
        return resultadoActualizacion;
    }

    static async ObtenerPerfiles(){
        let resultadoRecuperacion;
        const ConfiguracionConexion = RetornarTipoDeConexion();
        let conexion
        try{
            conexion = await sql.connect(ConfiguracionConexion)

            const Solicitud = conexion.request()
            const ResultadoSolicitud = await Solicitud
                .output('resultado', sql.Int)
                .output('mensaje', sql.NVarChar(200))
                .execute('sps_RecuperarPerfiles')

            resultadoRecuperacion = MensajeDeRetornoBaseDeDatosCatalogo({
                datos: ResultadoSolicitud.output,
                recordset: ResultadoSolicitud.recordset
            })

        } catch (error){
            throw error;
        } finally {
            if (conexion){
                await sql.close()
            }
        }
        return resultadoRecuperacion
    }


}   
