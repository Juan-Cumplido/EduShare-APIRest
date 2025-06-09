import sql from 'mssql';
import { RetornarTipoDeConexion } from './sql/connection/ConfiguracionConexion.js';
import { MensajeDeRetornoBaseDeDatosCatalogo, MensajeDeRetornoBaseDeDatosAcceso, MensajeRetornoBDId } from '../utilidades/Constantes.js';

export class ModeloComentario {

    static async CrearComentario({ idUsuario, datos }) {
        let resultadoCreacion;
        const ConfiguracionConexion = RetornarTipoDeConexion();
        let conexion;
        
        try {
            conexion = await sql.connect(ConfiguracionConexion);

            const { contenido, idPublicacion } = datos;

            const Solicitud = conexion.request();
            const ResultadoSolicitud = await Solicitud
                .input('contenido', sql.NVarChar(200), contenido)
                .input('idPublicacion', sql.Int, idPublicacion)
                .input('idUsuario', sql.Int, idUsuario)
                .output('resultado', sql.Int)
                .output('mensaje', sql.NVarChar(200))
                .execute('spi_CrearComentario');

            resultadoCreacion = MensajeDeRetornoBaseDeDatosCatalogo({
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
        return resultadoCreacion;
    }

    static async EliminarComentario({ idComentario }) {
        let resultadoEliminacion;
        const ConfiguracionConexion = RetornarTipoDeConexion();
        let conexion;
        
        try {
            conexion = await sql.connect(ConfiguracionConexion);

            const Solicitud = conexion.request();
            const ResultadoSolicitud = await Solicitud
                .input('idComentario', sql.Int, idComentario)
                .output('resultado', sql.Int)
                .output('mensaje', sql.NVarChar(200))
                .execute('spd_EliminarComentario');

            resultadoEliminacion = MensajeDeRetornoBaseDeDatosAcceso({
                datos: ResultadoSolicitud.output,
            });

        } catch (error) {
            throw error;
        } finally {
            if (conexion) {
                await sql.close();
            }
        }
        return resultadoEliminacion;
    }

    static async RecuperarComentarios({ idPublicacion }) {
        let resultadoRecuperacion;
        const ConfiguracionConexion = RetornarTipoDeConexion();
        let conexion;
        
        try {
            conexion = await sql.connect(ConfiguracionConexion);

            const Solicitud = conexion.request();
            const ResultadoSolicitud = await Solicitud
                .input('idPublicacion', sql.Int, idPublicacion)
                .output('resultado', sql.Int)
                .output('mensaje', sql.NVarChar(200))
                .execute('sps_RecuperarComentarios');

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

    static async EsDueño(idComentario, idUsuario) {
        let conexion;
        try {
            const ConfiguracionConexion = RetornarTipoDeConexion();
            conexion = await sql.connect(ConfiguracionConexion);
            
            const Solicitud = conexion.request();
            const ResultadoSolicitud = await Solicitud
                .input('idComentario', sql.Int, idComentario)
                .input('idUsuario', sql.Int, idUsuario)
                .output('resultado', sql.Int)
                .output('mensaje', sql.NVarChar(200))
                .execute('sps_VerificarPropietarioComentario');

            const { resultado } = ResultadoSolicitud.output;
                    
           if (resultado == 200){
                return true 
            } else {
                return false
            }
            
        } catch (error) {
            return false;
        } finally {
            if (conexion) {
                await conexion.close();
            }
        }
    }
}