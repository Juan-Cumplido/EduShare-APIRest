import sql from 'mssql';
import { logger } from "../utilidades/logger.js";
import { RetornarTipoDeConexion } from './sql/connection/ConfiguracionConexion.js';
import { MensajeDeRetornoBaseDeDatos, MensajeRetornoBDId, MensajeDeRetornoBaseDeDatosAcceso } from '../utilidades/Constantes.js';

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

                console.log('Resultados del SP:', { 
                    resultado: ResultadoSolicitud.output.resultado,
                    mensaje: ResultadoSolicitud.output.mensaje,
                    idPublicacion: ResultadoSolicitud.output.idPublicacion
                });

                resultadoInsercion = MensajeRetornoBDId({
                    datos: {
                        resultado: ResultadoSolicitud.output.resultado,
                        mensaje: ResultadoSolicitud.output.mensaje,
                        id: ResultadoSolicitud.output.idPublicacion
                    }
                });
        } catch (error) {
            logger({        
                mensaje: ResultadoSolicitud.output.resultado});
        } finally {
            if (conexion) {
                await sql.close();
            }
        }
        return resultadoInsercion;
    }

    static async obtenerPublicaciones(filtros = {}, opciones = { limite: 10, pagina: 1 }) {
        let resultado;
        const ConfiguracionConexion = RetornarTipoDeConexion();
        let conexion;
        try {
            conexion = await sql.connect(ConfiguracionConexion);
            
            const { categoria, nivelEducativo, idRama, idMateria } = filtros;
            const { limite, pagina } = opciones;
            
            const Solicitud = conexion.request();
            Solicitud
                .input('limite', sql.Int, limite)
                .input('pagina', sql.Int, pagina);
            
            if (categoria) Solicitud.input('categoria', sql.NVarChar(25), categoria);
            if (nivelEducativo) Solicitud.input('nivelEducativo', sql.NVarChar(20), nivelEducativo);
            if (idRama) Solicitud.input('idRama', sql.Int, idRama);
            if (idMateria) Solicitud.input('idMateria', sql.Int, idMateria);
            
            const ResultadoSolicitud = await Solicitud.execute('sps_ObtenerPublicaciones');
            
            resultado = {
                datos: ResultadoSolicitud.recordset,
                total: ResultadoSolicitud.recordset.length > 0 
                    ? ResultadoSolicitud.recordset[0].totalRegistros 
                    : 0
            };
            
        } catch (error) {
            throw error;
        } finally {
            if (conexion) {
                await sql.close();
            }
        }
        return resultado;
    }

    static async actualizarPublicacion(idPublicacion, datos) {
        let resultadoActualizacion;
        const ConfiguracionConexion = RetornarTipoDeConexion();
        let conexion;
        try {
            conexion = await sql.connect(ConfiguracionConexion);
            
            const {
                categoria,
                resuContenido,
                estado,
                nivelEducativo,
                idRama,
                idMateria
            } = datos;

            const Solicitud = conexion.request();
            const ResultadoSolicitud = await Solicitud
                .input('idPublicacion', sql.Int, idPublicacion)
                .input('categoria', sql.NVarChar(25), categoria)
                .input('resuContenido', sql.NVarChar(200), resuContenido)
                .input('estado', sql.NVarChar(20), estado)
                .input('nivelEducativo', sql.NVarChar(20), nivelEducativo)
                .input('idRama', sql.Int, idRama)
                .input('idMateria', sql.Int, idMateria)
                .output('resultado', sql.Int)
                .output('mensaje', sql.NVarChar(200))
                .execute('spu_ActualizarPublicacion');

            resultadoActualizacion = MensajeDeRetornoBaseDeDatos({ 
                datos: ResultadoSolicitud.output 
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

    static async eliminarPublicacion(idPublicacion) {
        let resultadoEliminacion;
        const ConfiguracionConexion = RetornarTipoDeConexion();
        let conexion;
        try {
            conexion = await sql.connect(ConfiguracionConexion);
            
            const Solicitud = conexion.request();
            const ResultadoSolicitud = await Solicitud
                .input('idPublicacion', sql.Int, idPublicacion)
                .output('resultado', sql.Int)
                .output('mensaje', sql.NVarChar(200))
                .execute('spd_EliminarPublicacion');

            resultadoEliminacion = MensajeDeRetornoBaseDeDatos({ 
                datos: ResultadoSolicitud.output 
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

            resultadoIncrementar = MensajeDeRetornoBaseDeDatos({ 
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

            resultadoIncrementar = MensajeDeRetornoBaseDeDatos({ 
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

            resultadoIncrementar = MensajeDeRetornoBaseDeDatos({ 
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

    static async EsDueño(idPublicacion, idUsuario) {
        console.log('[Modelo] EsDueño - Inicio');
        console.log(`[Modelo] Parámetros: idPublicacion=${idPublicacion}, idUsuario=${idUsuario}`);
        
        let conexion;
        try {
            const ConfiguracionConexion = RetornarTipoDeConexion();
            console.log('[Modelo] Conectando a la base de datos...');
            conexion = await sql.connect(ConfiguracionConexion);
            
            const Solicitud = conexion.request();
            console.log('[Modelo] Ejecutando procedimiento almacenado...');
            const ResultadoSolicitud = await Solicitud
                .input('idPublicacion', sql.Int, idPublicacion)
                .input('idUsuario', sql.Int, idUsuario)
                .output('resultado', sql.Int)
                .output('mensaje', sql.NVarChar(200))
                .execute('sps_verificarUsuarioAdminoPropietario');

            console.log('[Modelo] Resultado del procedimiento:', ResultadoSolicitud.output);
            
            const { resultado } = ResultadoSolicitud.output;
                    
            if (resultado == 200){
                return true 
            } else {
                return false
            }
            
        } catch (error) {
            console.error('[Modelo] Error en EsDueño:', error);
            return false;
        } finally {
            if (conexion) {
                console.log('[Modelo] Cerrando conexión...');
                await conexion.close();
            }
        }
    }
}

