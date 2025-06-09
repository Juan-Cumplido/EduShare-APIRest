import sql from 'mssql';
import { logger } from "../utilidades/Logger.js";
import { RetornarTipoDeConexion } from './sql/connection/ConfiguracionConexion.js';
import { MensajeDeRetornoBaseDeDatos, MensajeRetornoBDId, MensajeDeRetornoBaseDeDatosAcceso, MensajeDeRetornoBaseDeDatosCatalogo } from '../utilidades/Constantes.js';

export class ModeloPublicacion {

    static async insertarPublicacion(datos) {
        let resultadoInsercion;
        const ConfiguracionConexion = RetornarTipoDeConexion();
        let conexion;
        try {
            conexion = await sql.connect(ConfiguracionConexion);
            const {
                idCategoria,
                resuContenido,
                estado,
                nivelEducativo,
                idUsuarioRegistrado,
                idMateriaYRama,
                idDocumento
            } = datos;

            const Solicitud = conexion.request();
            const ResultadoSolicitud = await Solicitud
                .input('idCategoria', sql.Int, idCategoria)
                .input('resuContenido', sql.NVarChar(200), resuContenido)
                .input('estado', sql.NVarChar(20), estado)
                .input('nivelEducativo', sql.NVarChar(20), nivelEducativo)
                .input('idUsuarioRegistrado', sql.Int, idUsuarioRegistrado)
                .input('idMateriaYRama', sql.Int, idMateriaYRama)
                .input('idDocumento', sql.Int, idDocumento)
                .output('resultado', sql.Int)
                .output('mensaje', sql.NVarChar(200))
                .output('idPublicacion', sql.Int)
                .execute('spi_InsertarPublicacion');

                resultadoInsercion = MensajeRetornoBDId({
                    datos: {
                        resultado: ResultadoSolicitud.output.resultado,
                        mensaje: ResultadoSolicitud.output.mensaje,
                        id: ResultadoSolicitud.output.idPublicacion
                    }
                });
        } catch (error) {
            logger({ mensaje: error.message });
        } finally {
            if (conexion) {
                await sql.close();
            }
        }
        return resultadoInsercion;
    }

    static async obtenerPublicaciones() {
        let resultadoRecuperacion;
        const ConfiguracionConexion = RetornarTipoDeConexion();
        let conexion;
        
        try {
            conexion = await sql.connect(ConfiguracionConexion);
            const Solicitud = conexion.request();
            const ResultadoSolicitud = await Solicitud
                .output('resultado', sql.Int)
                .output('mensaje', sql.NVarChar(200))
                .execute('sps_ObtenerPublicaciones');

            resultadoRecuperacion = MensajeDeRetornoBaseDeDatosCatalogo({ 
                datos: ResultadoSolicitud.output,
                recordset: ResultadoSolicitud.recordset
            })
        } catch (error) {
            throw error
        } finally {
            if (conexion) {
                await sql.close();
            }
        }
        return resultadoRecuperacion;
    }

    static async EsDueño(idPublicacion, idUsuario) {
        
        let conexion;
        try {
            const ConfiguracionConexion = RetornarTipoDeConexion();
            conexion = await sql.connect(ConfiguracionConexion);
            
            const Solicitud = conexion.request();
            const ResultadoSolicitud = await Solicitud
                .input('idPublicacion', sql.Int, idPublicacion)
                .input('idUsuario', sql.Int, idUsuario)
                .output('resultado', sql.Int)
                .output('mensaje', sql.NVarChar(200))
                .execute('sps_verificarUsuarioAdminoPropietario');

            
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

    static async incrementarVisualizacion(idPublicacion) {
        let resultadoIncrementar;
        const ConfiguracionConexion = RetornarTipoDeConexion();
        let conexion;
        try {
            conexion = await sql.connect(ConfiguracionConexion);
            
            const Solicitud = conexion.request();
            const ResultadoSolicitud = await Solicitud
                .input('idPublicacion', sql.Int, idPublicacion)
                .output('resultado', sql.Int)
                .output('mensaje', sql.NVarChar(200))
                .execute('spu_IncrementarVisualizacion');

            resultadoIncrementar = MensajeDeRetornoBaseDeDatosAcceso({ 
                datos: ResultadoSolicitud.output 
            });
        } catch (error) {
            throw error;
        } finally {
            if (conexion) {
                await sql.close();
            }
        }
        return resultadoIncrementar;
    }

    static async incrementarDescarga(idPublicacion) {
        let resultadoIncrementar;
        const ConfiguracionConexion = RetornarTipoDeConexion();
        let conexion;
        try {
            conexion = await sql.connect(ConfiguracionConexion);
            
            const Solicitud = conexion.request();
            const ResultadoSolicitud = await Solicitud
                .input('idPublicacion', sql.Int, idPublicacion)
                .output('resultado', sql.Int)
                .output('mensaje', sql.NVarChar(200))
                .execute('spu_IncrementarDescarga');

            resultadoIncrementar = MensajeDeRetornoBaseDeDatosAcceso({ 
                datos: ResultadoSolicitud.output 
            });
        } catch (error) {
            throw error;
        } finally {
            if (conexion) {
                await sql.close();
            }
        }
        return resultadoIncrementar;
    }

    static async incrementarLike(idPublicacion) {
        let resultadoIncrementar;
        const ConfiguracionConexion = RetornarTipoDeConexion();
        let conexion;
        try {
            conexion = await sql.connect(ConfiguracionConexion);
            
            const Solicitud = conexion.request();
            const ResultadoSolicitud = await Solicitud
                .input('idPublicacion', sql.Int, idPublicacion)
                .output('resultado', sql.Int)
                .output('mensaje', sql.NVarChar(200))
                .execute('spu_IncrementarLike');

            resultadoIncrementar = MensajeDeRetornoBaseDeDatosAcceso({ 
                datos: ResultadoSolicitud.output 
            });
        } catch (error) {
            throw error;
        } finally {
        if (conexion) {
                await sql.close();
            }
        }
        return resultadoIncrementar;
    }
}

