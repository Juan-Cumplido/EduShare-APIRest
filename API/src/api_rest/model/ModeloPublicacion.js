import sql from 'mssql';
import { logger } from "../utilidades/Logger.js";
import { RetornarTipoDeConexion } from './sql/connection/ConfiguracionConexion.js';
import { MensajeDeRetornoBaseDeDatos, MensajeRetornoBDId, MensajeDeRetornoBaseDeDatosAcceso, MensajeDeRetornoBaseDeDatosCatalogo } from '../utilidades/Constantes.js';

export class ModeloPublicacion {

    static async InsertarDocumento(datos) {
        let resultadoInsercion;
        const ConfiguracionConexion = RetornarTipoDeConexion();
        let conexion;
        
        try {
            conexion = await sql.connect(ConfiguracionConexion);
            const { titulo, ruta, idUsuarioRegistrado } = datos;

            const Solicitud = conexion.request();
            
            const ResultadoSolicitud = await Solicitud
                .input('titulo', sql.NVarChar(100), titulo)
                .input('ruta', sql.NVarChar(sql.MAX), ruta)
                .input('idUsuarioRegistrado', sql.Int, idUsuarioRegistrado)
                .output('resultado', sql.Int)
                .output('mensaje', sql.NVarChar(200))
                .output('idDocumento', sql.Int)
                .execute('spi_InsertarDocumento');

            resultadoInsercion = MensajeRetornoBDId({
                datos: {
                    resultado: ResultadoSolicitud.output.resultado,
                    mensaje: ResultadoSolicitud.output.mensaje,
                    id: ResultadoSolicitud.output.idDocumento
                }
            });
        } catch (error) {
            throw error;
        } finally {
            if (conexion) {
                await sql.close();
            }
        }
        return resultadoInsercion;
    }

    static async InsertarPublicacion(datos) {
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
            throw error
        } finally {
            if (conexion) {
                await sql.close();
            }
        }
        return resultadoInsercion;
    }

    static async ObtenerPublicaciones() {
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

    static async ObtenerPublicacionPorId(idPublicacion) {
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
                .execute('sps_ObtenerPublicacionPorId');

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

    static async ObtenerPublicacionesPropias(idUsuario) {
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
                .execute('sps_ObtenerPublicacionesPropias');

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

    static async ObtenerPublicacionesPorCategoria(idCategoria) {
        let resultadoRecuperacion;
        const ConfiguracionConexion = RetornarTipoDeConexion();
        let conexion;
        
        try {
            conexion = await sql.connect(ConfiguracionConexion);
            const Solicitud = conexion.request();
            const ResultadoSolicitud = await Solicitud
                .input('idCategoria', sql.Int, idCategoria)
                .output('resultado', sql.Int)
                .output('mensaje', sql.NVarChar(200))
                .execute('sps_ObtenerPublicacionesPorCategoria');

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

    static async ObtenerPublicacionesPorRama(idRama) {
        let resultadoRecuperacion;
        const ConfiguracionConexion = RetornarTipoDeConexion();
        let conexion;
        
        try {
            conexion = await sql.connect(ConfiguracionConexion);
            const Solicitud = conexion.request();
            const ResultadoSolicitud = await Solicitud
                .input('idRama', sql.Int, idRama)
                .output('resultado', sql.Int)
                .output('mensaje', sql.NVarChar(200))
                .execute('sps_ObtenerPublicacionesPorRama');

            resultadoRecuperacion = MensajeDeRetornoBaseDeDatosCatalogo({ 
                datos: ResultadoSolicitud.output,
                recordset: ResultadoSolicitud.recordset
            })
        } catch (error) {
            logger({ mensaje: error.message });
            resultado = MensajeDeRetornoBaseDeDatos({
                datos: {
                    resultado: 500,
                    mensaje: 'Error interno del servidor'
                }
            });
        } finally {
            if (conexion) {
                await sql.close();
            }
        }
        return resultadoRecuperacion;
    }

    static async ObtenerPublicacionesPorNivelEducativo(nivelEducativo) {
        let resultadoRecuperacion;
        const ConfiguracionConexion = RetornarTipoDeConexion();
        let conexion;
        
        try {
            conexion = await sql.connect(ConfiguracionConexion);
            const Solicitud = conexion.request();
            const ResultadoSolicitud = await Solicitud
                .input('nivelEducativo', sql.NVarChar(20), nivelEducativo)
                .output('resultado', sql.Int)
                .output('mensaje', sql.NVarChar(200))
                .execute('sps_ObtenerPublicacionesPorNivelEducativo');

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

    static async ObtenerPublicacionesPorUsuario(idUsuario) {
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
                .execute('sps_ObtenerPublicacionesPorUsuario');

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

    static async DarLike(idPublicacion, idUsuario) {
        let resultado;
        const ConfiguracionConexion = RetornarTipoDeConexion();
        let conexion;
        
        try {
            conexion = await sql.connect(ConfiguracionConexion);
            const Solicitud = conexion.request();
            const ResultadoSolicitud = await Solicitud
                .input('idPublicacion', sql.Int, idPublicacion)
                .input('idUsuario', sql.Int, idUsuario)
                .output('resultado', sql.Int)
                .output('mensaje', sql.NVarChar(200))
                .execute('spi_DarLikePublicacion');

            resultado = MensajeDeRetornoBaseDeDatosAcceso({ 
                datos: ResultadoSolicitud.output 
            })
        } catch (error) {
            throw error;
        } finally {
            if (conexion) {
                await sql.close();
            }
        }
        return resultado;
    }

    static async QuitarLike(idPublicacion, idUsuario) {
        let resultado;
        const ConfiguracionConexion = RetornarTipoDeConexion();
        let conexion;
        
        try {
            conexion = await sql.connect(ConfiguracionConexion);
            const Solicitud = conexion.request();
            const ResultadoSolicitud = await Solicitud
                .input('idPublicacion', sql.Int, idPublicacion)
                .input('idUsuario', sql.Int, idUsuario)
                .output('resultado', sql.Int)
                .output('mensaje', sql.NVarChar(200))
                .execute('spd_QuitarLikePublicacion');

            resultado = MensajeDeRetornoBaseDeDatosAcceso({ 
                datos: ResultadoSolicitud.output 
            })
        } catch (error) {
            throw error;
        } finally {
            if (conexion) {
                await sql.close();
            }
        }
        return resultado;
    }

    static async VerificarLike(idPublicacion, idUsuario) {
        let resultado;
        const ConfiguracionConexion = RetornarTipoDeConexion();
        let conexion;
        
        try {
            conexion = await sql.connect(ConfiguracionConexion);
            const Solicitud = conexion.request();
            const ResultadoSolicitud = await Solicitud
                .input('idPublicacion', sql.Int, idPublicacion)
                .input('idUsuario', sql.Int, idUsuario)
                .output('resultado', sql.Int)
                .output('mensaje', sql.NVarChar(200))
                .execute('sps_VerificarLikeUsuario');

            resultado = MensajeDeRetornoBaseDeDatosAcceso({ 
                datos: ResultadoSolicitud.output 
            })
        } catch (error) {
            throw error;
        } finally {
            if (conexion) {
                await sql.close();
            }
        }
        return resultado;
    }

    static async RegistrarVisualizacion(idPublicacion) {
        let resultado;
        const ConfiguracionConexion = RetornarTipoDeConexion();
        let conexion;
        
        try {
            conexion = await sql.connect(ConfiguracionConexion);
            const Solicitud = conexion.request();
            const ResultadoSolicitud = await Solicitud
                .input('idPublicacion', sql.Int, idPublicacion)
                .output('resultado', sql.Int)
                .output('mensaje', sql.NVarChar(200))
                .execute('spu_RegistrarVisualizacion');

            resultado = MensajeDeRetornoBaseDeDatosAcceso({ 
                datos: ResultadoSolicitud.output 
            });
        } catch (error) {
            throw error;
        } finally {
            if (conexion) {
                await sql.close();
            }
        }
        return resultado;
    }

    static async RegistrarDescarga(idPublicacion) {
        let resultado;
        const ConfiguracionConexion = RetornarTipoDeConexion();
        let conexion;
        
        try {
            conexion = await sql.connect(ConfiguracionConexion);
            const Solicitud = conexion.request();
            const ResultadoSolicitud = await Solicitud
                .input('idPublicacion', sql.Int, idPublicacion)
                .output('resultado', sql.Int)
                .output('mensaje', sql.NVarChar(200))
                .execute('spu_RegistrarDescarga');

            resultado = MensajeDeRetornoBaseDeDatosAcceso({ 
                datos: ResultadoSolicitud.output 
            });
        } catch (error) {
            throw error;
        } finally {
            if (conexion) {
                await sql.close();
            }
        }
        return resultado;
    }

    static async AprobarPublicacion(idPublicacion) {
        let resultado;
        const ConfiguracionConexion = RetornarTipoDeConexion();
        let conexion;
        
        try {
            conexion = await sql.connect(ConfiguracionConexion);
            const Solicitud = conexion.request();
            const ResultadoSolicitud = await Solicitud
                .input('idPublicacion', sql.Int, idPublicacion)
                .output('resultado', sql.Int)
                .output('mensaje', sql.NVarChar(200))
                .execute('spu_AprobarPublicacion');

            resultado = MensajeDeRetornoBaseDeDatosAcceso({ 
                datos: ResultadoSolicitud.output 
            });
        } catch (error) {
            throw error;
        } finally {
            if (conexion) {
                await sql.close();
            }
        }
        return resultado;
    }

    static async RechazarPublicacion(idPublicacion) {
        let resultado;
        const ConfiguracionConexion = RetornarTipoDeConexion();
        let conexion;
        
        try {
            conexion = await sql.connect(ConfiguracionConexion);
            const Solicitud = conexion.request();
            const ResultadoSolicitud = await Solicitud
                .input('idPublicacion', sql.Int, idPublicacion)
                .output('resultado', sql.Int)
                .output('mensaje', sql.NVarChar(200))
                .execute('spu_RechazarPublicacion');

            resultado = MensajeDeRetornoBaseDeDatosAcceso({ 
                datos: ResultadoSolicitud.output 
            });
        } catch (error) {
            throw error;
        } finally {
            if (conexion) {
                await sql.close();
            }
        }
        return resultado;
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
}

