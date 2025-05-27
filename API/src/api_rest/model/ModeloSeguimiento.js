import sql from 'mssql';
import { RetornarTipoDeConexion } from './sql/connection/ConfiguracionConexion.js';
import { MensajeDeRetornoBaseDeDatosAcceso,  MensajeDeRetornoBaseDeDatosCatalogo  } from '../utilidades/Constantes.js';

export class ModeloSeguimiento {
 static async SeguirUsuario({ datos }) {
        let resultadoSeguimiento;
        const ConfiguracionConexion = RetornarTipoDeConexion();
        let conexion;
        try {
            conexion = await sql.connect(ConfiguracionConexion);
            const {
                idUsuarioSeguidor,
                idUsuarioSeguido
            } = datos;

            const Solicitud = conexion.request();
            const ResultadoSolicitud = await Solicitud
                .input('idUsuarioSeguidor', sql.Int, idUsuarioSeguidor)
                .input('idUsuarioSeguido', sql.Int, idUsuarioSeguido)
                .output('resultado', sql.Int)
                .output('mensaje', sql.NVarChar(200))
                .execute('spi_SeguirUsuario');

            resultadoSeguimiento = MensajeDeRetornoBaseDeDatosAcceso({ datos: ResultadoSolicitud.output });
        } catch (error) {
            throw error;
        } finally {
            if (conexion) {
                await sql.close();
            }
        }
        return resultadoSeguimiento;
    }

    static async DejarDeSeguirUsuario({ datos }) {
        let resultadoDejarSeguir;
        const ConfiguracionConexion = RetornarTipoDeConexion();
        let conexion;
        try {
            conexion = await sql.connect(ConfiguracionConexion);
            const {
                idUsuarioSeguidor,
                idUsuarioSeguido
            } = datos;

            const Solicitud = conexion.request();
            const ResultadoSolicitud = await Solicitud
                .input('idUsuarioSeguidor', sql.Int, idUsuarioSeguidor)
                .input('idUsuarioSeguido', sql.Int, idUsuarioSeguido)
                .output('resultado', sql.Int)
                .output('mensaje', sql.NVarChar(200))
                .execute('spi_DejarDeSeguirUsuario');

            resultadoDejarSeguir = MensajeDeRetornoBaseDeDatosAcceso({ datos: ResultadoSolicitud.output });
        } catch (error) {
            throw error;
        } finally {
            if (conexion) {
                await sql.close();
            }
        }
        return resultadoDejarSeguir;
    }

    static async ObtenerSeguidores({ datos }) {
        let resultadoSeguidores;
        const ConfiguracionConexion = RetornarTipoDeConexion();
        let conexion;
        try {
            conexion = await sql.connect(ConfiguracionConexion);
            const { idUsuario } = datos;

            const Solicitud = conexion.request();
            const ResultadoSolicitud = await Solicitud
                .input('idUsuario', sql.Int, idUsuario)
                .output('resultado', sql.Int)
                .output('mensaje', sql.NVarChar(200))
                .execute('spi_ObtenerSeguidores');

            resultadoSeguidores = MensajeDeRetornoBaseDeDatosCatalogo({ 
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
        return resultadoSeguidores;
    }

    static async ObtenerSeguidos({ datos }) {
        let resultadoSeguidos;
        const ConfiguracionConexion = RetornarTipoDeConexion();
        let conexion;
        try {
            conexion = await sql.connect(ConfiguracionConexion);
            const { idUsuario } = datos;

            const Solicitud = conexion.request();
            const ResultadoSolicitud = await Solicitud
                .input('idUsuario', sql.Int, idUsuario)
                .output('resultado', sql.Int)
                .output('mensaje', sql.NVarChar(200))
                .execute('spi_ObtenerSeguidos');

            resultadoSeguidos = MensajeDeRetornoBaseDeDatosCatalogo({ 
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
        return resultadoSeguidos;
    }

    static async VerificarSeguimiento({ datos }) {
        let resultadoVerificacion;
        const ConfiguracionConexion = RetornarTipoDeConexion();
        let conexion;
        try {
            conexion = await sql.connect(ConfiguracionConexion);
            const {
                idUsuarioSeguidor,
                idUsuarioSeguido
            } = datos;

            const Solicitud = conexion.request();
            const ResultadoSolicitud = await Solicitud
                .input('idUsuarioSeguidor', sql.Int, idUsuarioSeguidor)
                .input('idUsuarioSeguido', sql.Int, idUsuarioSeguido)
                .output('resultado', sql.Int)
                .output('mensaje', sql.NVarChar(200))
                .execute('spi_VerificarSeguimiento');

            resultadoVerificacion = MensajeDeRetornoBaseDeDatosAcceso({ datos: ResultadoSolicitud.output });
        } catch (error) {
            throw error;
        } finally {
            if (conexion) {
                await sql.close();
            }
        }
        return resultadoVerificacion;
    }
}