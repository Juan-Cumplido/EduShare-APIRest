import sql from 'mssql';
import { RetornarTipoDeConexion } from './sql/connection/ConfiguracionConexion.js';
import { MensajeDeRetornoBaseDeDatosAcceso, MensajeDeRetornoBaseDeDatosCatalogo } from '../utilidades/Constantes.js';

export class ModeloNotificacion {
    static async RegistrarNotificacion({ datos }) {
        let resultadoRegistro;
        const ConfiguracionConexion = RetornarTipoDeConexion();
        let conexion;
        
        try {
            conexion = await sql.connect(ConfiguracionConexion);
            const { usuarioDestinoId, titulo, mensajeNotificacion, usuarioOrigenId, tipo } = datos;
            
            const Solicitud = conexion.request();
            const ResultadoSolicitud = await Solicitud
                .input('usuarioDestinoId', sql.Int, usuarioDestinoId)
                .input('titulo', sql.NVarChar(255), titulo)
                .input('mensajeNotificacion', sql.NVarChar(sql.MAX), mensajeNotificacion)
                .input('usuarioOrigenId', sql.Int, usuarioOrigenId)
                .input('tipo', sql.NVarChar(50), tipo)
                .output('resultado', sql.Int)
                .output('mensaje', sql.NVarChar(200))
                .execute('sps_RegistrarNotificacion');

            resultadoRegistro = MensajeDeRetornoBaseDeDatosAcceso({ datos: ResultadoSolicitud.output });

        } catch (error) {
            throw error;
        } finally {
            if (conexion) {
                await sql.close();
            }
        }
        return resultadoRegistro;
    }

    static async ObtenerNotificacionesPropias({ datos }) {
        let resultadoRecuperacion;
        const ConfiguracionConexion = RetornarTipoDeConexion();
        let conexion;
        
        try {
            conexion = await sql.connect(ConfiguracionConexion);
            
            const {usuarioDestinoId} = datos

            const Solicitud = conexion.request();
            const ResultadoSolicitud = await Solicitud
                .input('usuarioDestinoId', sql.Int, usuarioDestinoId)
                .output('resultado', sql.Int)
                .output('mensaje', sql.NVarChar(200))
                .execute('sps_ObtenerNotificacionesPropias');

            resultadoRecuperacion = MensajeDeRetornoBaseDeDatosCatalogo({
                datos: ResultadoSolicitud.output,
                recordset: ResultadoSolicitud.recordset
            });

        } catch (error) {
            throw error
        } finally {
            if (conexion) {
                await sql.close();
            }
        }
        return resultadoRecuperacion;
    }
}   