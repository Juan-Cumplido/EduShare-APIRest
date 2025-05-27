import sql from 'mssql';
import { RetornarTipoDeConexion } from './sql/connection/ConfiguracionConexion.js';
import { MensajeDeRetornoBaseDeDatosCatalogo } from '../utilidades/Constantes.js';

export class ModeloCatalogo {

    static async RecuperarCategorias(){
        let resultadoRecuperacion;
        const ConfiguracionConexion = RetornarTipoDeConexion();
        let conexion
        try{
            conexion = await sql.connect(ConfiguracionConexion);

            const Solicitud = conexion.request()
            const ResultadoSolicitud  = await Solicitud
                .output('resultado', sql.Int)
                .output('mensaje', sql.NVarChar(200))
                .execute('spi_RecuperarCategorias');

            resultadoRecuperacion = MensajeDeRetornoBaseDeDatosCatalogo({ 
                datos: ResultadoSolicitud.output,
                recordset: ResultadoSolicitud.recordset
            })

            return resultadoRecuperacion
        } catch(error){
            throw error;
        } finally {
            if (conexion){
                await sql.close()
            }
        }
    }

    static async RecuperarRamas(){
        let resultadoRecuperacion;
        const ConfiguracionConexion = RetornarTipoDeConexion();
        let conexion
        try{
            conexion = await sql.connect(ConfiguracionConexion)

            const Solicitud = conexion.request()
            const ResultadoSolicitud = await Solicitud
                .output('resultado', sql.Int)
                .output('mensaje', sql.NVarChar(200))
                .execute('spi_RecuperarRamas')

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

    static async RecuperarMaterias() {
        let resultadoRecuperacion
        const ConfiguracionConexion = RetornarTipoDeConexion()
        let conexion
        try {
            conexion = await sql.connect(ConfiguracionConexion)
            
            const Solicitud = conexion.request()
            const ResultadoSolicitud = await Solicitud
                .output('resultado', sql.Int)
                .output('mensaje', sql.NVarChar(200))
                .execute('spi_RecuperarMaterias')

            resultadoRecuperacion = MensajeDeRetornoBaseDeDatosCatalogo({ 
                datos: ResultadoSolicitud.output,
                recordset: ResultadoSolicitud.recordset
            })
        } catch (error) {
            throw error
        } finally {
            if (conexion) {
                await sql.close()
            }
        }
        return resultadoRecuperacion
    }

    static async RecuperarMateriasPorRama({ idRama }) {
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
                .execute('spi_RecuperarMateriasPorRama')

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

    static async RecuperarInstituciones({ nivelEducativo = null } = {}) {
    let resultadoRecuperacion;
    const ConfiguracionConexion = RetornarTipoDeConexion();
    let conexion;

    try {
        conexion = await sql.connect(ConfiguracionConexion);

        const Solicitud = conexion.request();
        
        if (nivelEducativo) {
            Solicitud.input('nivelEducativo', sql.NVarChar(20), nivelEducativo);
        }

        const ResultadoSolicitud = await Solicitud
            .output('resultado', sql.Int)
            .output('mensaje', sql.NVarChar(200))
            .execute('sps_RecuperarInstituciones');

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
}   
