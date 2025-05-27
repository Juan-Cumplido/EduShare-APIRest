import sql from 'mssql';
import { RetornarTipoDeConexion } from './sql/connection/ConfiguracionConexion.js';
import { MensajeDeRetornoBaseDeDatos, MensajeDeRetornoBaseDeDatosConDatos } from '../utilidades/Constantes.js';

export class ModeloSeguimiento {

    static async SeguirUsuario({ idUsuarioSeguidor, idUsuarioSeguido }) {
        let resultadoOperacion;
        const ConfiguracionConexion = RetornarTipoDeConexion();
        let conexion;
        
        try {
            conexion = await sql.connect(ConfiguracionConexion);

            const Solicitud = conexion.request();
            const ResultadoSolicitud = await Solicitud
                .input('idUsuarioSeguidor', sql.Int, idUsuarioSeguidor)
                .input('idUsuarioSeguido', sql.Int, idUsuarioSeguido)
                .output('resultado', sql.Int)
                .output('mensaje', sql.NVarChar(200))
                .execute('spi_SeguirUsuario');

            resultadoOperacion = MensajeDeRetornoBaseDeDatos({
                datos: ResultadoSolicitud.output
            });

            return resultadoOperacion;
        } catch (error) {
            throw error;
        } finally {
            if (conexion) {
                await sql.close();
            }
        }
    }

    static async DejarDeSeguirUsuario({ idUsuarioSeguidor, idUsuarioSeguido }) {
        let resultadoOperacion;
        const ConfiguracionConexion = RetornarTipoDeConexion();
        let conexion;
        
        try {
            conexion = await sql.connect(ConfiguracionConexion);

            const Solicitud = conexion.request();
            const ResultadoSolicitud = await Solicitud
                .input('idUsuarioSeguidor', sql.Int, idUsuarioSeguidor)
                .input('idUsuarioSeguido', sql.Int, idUsuarioSeguido)
                .output('resultado', sql.Int)
                .output('mensaje', sql.NVarChar(200))
                .execute('spi_DejarDeSeguirUsuario');

            resultadoOperacion = MensajeDeRetornoBaseDeDatos({
                datos: ResultadoSolicitud.output
            });

            return resultadoOperacion;
        } catch (error) {
            throw error;
        } finally {
            if (conexion) {
                await sql.close();
            }
        }
    }

    static async VerificarSeguimiento({ idUsuarioSeguidor, idUsuarioSeguido }) {
        let resultadoVerificacion;
        const ConfiguracionConexion = RetornarTipoDeConexion();
        let conexion;
        
        try {
            conexion = await sql.connect(ConfiguracionConexion);

            const Solicitud = conexion.request();
            const ResultadoSolicitud = await Solicitud
                .input('idUsuarioSeguidor', sql.Int, idUsuarioSeguidor)
                .input('idUsuarioSeguido', sql.Int, idUsuarioSeguido)
                .output('resultado', sql.Int)
                .output('mensaje', sql.NVarChar(200))
                .execute('sps_VerificarSeguimiento');

            resultadoVerificacion = {
                estado: ResultadoSolicitud.output.resultado,
                mensaje: ResultadoSolicitud.output.mensaje,
                siguiendo: ResultadoSolicitud.recordset.length > 0 ? ResultadoSolicitud.recordset[0].siguiendo : 0
            };

            return resultadoVerificacion;
        } catch (error) {
            throw error;
        } finally {
            if (conexion) {
                await sql.close();
            }
        }
    }

    static async RecuperarSeguidores({ idUsuario }) {
        let resultadoOperacion;
        const ConfiguracionConexion = RetornarTipoDeConexion();
        let conexion;
        
        try {
            conexion = await sql.connect(ConfiguracionConexion);

            const Solicitud = conexion.request();
            const ResultadoSolicitud = await Solicitud
                .input('idUsuario', sql.Int, idUsuario)
                .output('resultado', sql.Int)
                .output('mensaje', sql.NVarChar(200))
                .execute('sps_RecuperarSeguidores');

            resultadoOperacion = {
                estado: ResultadoSolicitud.output.resultado,
                mensaje: ResultadoSolicitud.output.mensaje,
                datos: ResultadoSolicitud.recordset || []
            };

            return resultadoOperacion;
        } catch (error) {
            throw error;
        } finally {
            if (conexion) {
                await sql.close();
            }
        }
    }

    static async RecuperarSeguidos({ idUsuario }) {
        let resultadoOperacion;
        const ConfiguracionConexion = RetornarTipoDeConexion();
        let conexion;
        
        try {
            conexion = await sql.connect(ConfiguracionConexion);

            const Solicitud = conexion.request();
            const ResultadoSolicitud = await Solicitud
                .input('idUsuario', sql.Int, idUsuario)
                .output('resultado', sql.Int)
                .output('mensaje', sql.NVarChar(200))
                .execute('sps_RecuperarSeguidos');

            resultadoOperacion = {
                estado: ResultadoSolicitud.output.resultado,
                mensaje: ResultadoSolicitud.output.mensaje,
                datos: ResultadoSolicitud.recordset || []
            };

            return resultadoOperacion;
        } catch (error) {
            throw error;
        } finally {
            if (conexion) {
                await sql.close();
            }
        }
    }
}