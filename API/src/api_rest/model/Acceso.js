import sql from 'mssql';
import path from 'path';
import { promises as fs } from 'fs';
import { RetornarTipoDeConexion } from './sql/connection/ConfiguracionConexion.js';
import { MensajeDeRetornoBaseDeDatosAcceso, MensajeDeRetornoBaseDeDatosInfoAdicional } from '../utilidades/Constantes.js';

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

            let fotoPerfilBuffer;

            if (!fotoPerfil) {
                try {
                    const defaultImagePath = path.join(process.cwd(), 'resources', 'imagen-por-defecto.jpg');
                    fotoPerfilBuffer = await fs.readFile(defaultImagePath);
                } catch (error) {
                    fotoPerfilBuffer = null; 
                }
            } else {
                fotoPerfilBuffer = await fs.readFile(fotoPerfil);
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
                .input('fotoPerfil', sql.VarBinary(sql.MAX), fotoPerfilBuffer) // 🚀 binario
                .input('idInstitucion', sql.Int, idInstitucion)
                .output('resultado', sql.Int)
                .output('mensaje', sql.NVarChar(200))
                .execute('spi_InsertarCuentaConUsuarioRegistrado');

            resultadoInsercion = MensajeDeRetornoBaseDeDatosAcceso({ datos: ResultadoSolicitud.output });
        } catch (error) {
            throw error;
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
            throw error;
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
             throw error;
        } finally {
            if (conexion) {
                await sql.close();
            }
        }
        return resultadoCambio;
    }
    
    static async VerificarCredenciales({ datos }) {
        let resultadoVerificacion;
        const ConfiguracionConexion = RetornarTipoDeConexion();
        let conexion;
        try {
            conexion = await sql.connect(ConfiguracionConexion);
            const {
                identifier,
                contrasenia
            } = datos;
                
            const Solicitud = conexion.request();
            const ResultadoSolicitud = await Solicitud 
                .input('identifier', sql.NVarChar(256), identifier)
                .input('contrasenia', sql.NVarChar(300), contrasenia)
                .output('resultado', sql.Int)
                .output('mensaje', sql.NVarChar(200))
                .output('idUsuarioRegistrado', sql.Int)
                .output('nombre', sql.NVarChar(30))
                .output('fotoPerfil', sql.NVarChar(sql.MAX))
                .output('correo', sql.NVarChar(256))
                .output('nombreUsuario', sql.NVarChar(15))
                .output('primerApellido', sql.NVarChar(30))
                .output('segundoApellido', sql.NVarChar(30))
                .execute('spi_VerificarCredenciales');

            resultadoVerificacion = MensajeDeRetornoBaseDeDatosInfoAdicional({
                datos: {
                    resultado: ResultadoSolicitud.output.resultado,
                    mensaje: ResultadoSolicitud.output.mensaje,
                    datosAdicionales: {
                        idUsuarioRegistrado: ResultadoSolicitud.output.idUsuarioRegistrado || null,
                        nombre: ResultadoSolicitud.output.nombre || null, 
                        fotoPerfil: ResultadoSolicitud.output.fotoPerfil || null,
                        correo: ResultadoSolicitud.output.correo || null,
                        nombreUsuario: ResultadoSolicitud.output.nombreUsuario || null,
                        primerApellido: ResultadoSolicitud.output.primerApellido || null,
                        segundoApellido: ResultadoSolicitud.output.segundoApellido || null      
                    }
                }
            });
        } catch (error) {
             throw error;
        } finally {
            if (conexion) {
                await sql.close();
            }
        }
        return resultadoVerificacion;
    }

    static async EliminarCuenta({ datos }) {
        let resultadoEliminacion;
        const ConfiguracionConexion = RetornarTipoDeConexion();
        let conexion;
        try {
            conexion = await sql.connect(ConfiguracionConexion);
            const {
                correo,
                contrasenia
            } = datos;
            
            const Solicitud = conexion.request();
            const ResultadoSolicitud = await Solicitud 
                .input('correo', sql.NVarChar(256), correo)
                .input('contrasenia', sql.NVarChar(300), contrasenia)
                .output('resultado', sql.Int)
                .output('mensaje', sql.NVarChar(200))
                .execute('spi_EliminarCuenta');

            resultadoEliminacion = MensajeDeRetornoBaseDeDatosAcceso({ datos: ResultadoSolicitud.output });
        } catch (error) {
             throw error;
        } finally {
            if (conexion) {
                await sql.close();
            }
        }
        return resultadoEliminacion;
    }   

    static async BanearUsuario({datos}){
        let resultadoBaneo;
        const ConfiguracionConexion = RetornarTipoDeConexion();
        let conexion;
        try {
            conexion = await sql.connect(ConfiguracionConexion);

            const {
                idUsuarioRegistrado,
                idAdministrador
            } = datos;

            const Solicitud = conexion.request();

            const ResultadoSolicitud = await Solicitud 
                .input('idUsuario', sql.Int, idUsuarioRegistrado)
                .input('idAdministrador', sql.Int, idAdministrador)
                .output('resultado', sql.Int)
                .output('mensaje', sql.NVarChar(200))
                .execute('spi_BanearUsuario');
                
            resultadoBaneo = MensajeDeRetornoBaseDeDatosAcceso({ datos: ResultadoSolicitud.output });
        } catch (error){
             throw error;
        } finally {
            if (conexion) {
                await sql.close();
            }
        }
        return resultadoBaneo;
    }

    static async InsertarNuevaCuentaAdmin({ datos }) {
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
                tipoAcceso = 'Administrador',
                nombre,
                primerApellido,
                segundoApellido,
                fotoPerfil,    
                idInstitucion,
            } = datos;

            let fotoPerfilBase64
            
            if (!fotoPerfil) {
                try {
                    const defaultImagePath = path.join(process.cwd(), 'resources', 'imagen-por-defecto.jpg');
                    const fotoPerfilBuffer = await fs.readFile(defaultImagePath);
                    fotoPerfilBase64 = fotoPerfilBuffer.toString('base64')
                } catch (error) {
                    fotoPerfilBase64 = null; 
                }
            } else {
                fotoPerfilBase64 = fotoPerfil.toString('base64');;
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
                .input('fotoPerfil', sql.NVarChar(sql.MAX), fotoPerfilBase64)
                .input('idInstitucion', sql.Int, idInstitucion)

                .output('resultado', sql.Int)
                .output('mensaje', sql.NVarChar(200))
                .execute('spi_InsertarCuentaConUsuarioRegistrado');

            resultadoInsercion = MensajeDeRetornoBaseDeDatosAcceso({ datos: ResultadoSolicitud.output });
        } catch (error) {
             throw error;
        } finally {
            if (conexion) {
                await sql.close();
            }
        }
        return resultadoInsercion;
    }

    static async VerificarAdmin({ idUsuario }) {
        const ConfiguracionConexion = RetornarTipoDeConexion();
        let conexion;
        try {
            conexion = await sql.connect(ConfiguracionConexion);
            
            const Solicitud = conexion.request();
            const ResultadoSolicitud = await Solicitud 
                .input('idUsuario', sql.Int, idUsuario)
                .query('SELECT tipoAcceso FROM Acceso WHERE idAcceso = @idUsuario');
                
            return ResultadoSolicitud.recordset[0] || null;
        } catch (error) {
            throw error;
        } finally {
            if (conexion) {
                await sql.close();
            }
        }
    }

    static async EsAdmin(idUsuario){

        const ConfigurarConexion = RetornarTipoDeConexion()
        let conexion
        try {
            conexion = await sql.connect(ConfigurarConexion)

            const Solicitud = conexion.request();
            const ResultadoSolicitud = await Solicitud  
                .input('idUsuario', sql.Int, idUsuario) 
                .output('resultado', sql.Int)
                .output('mensaje', sql.NVarChar(200))
                .execute('sps_verificarUsuarioAdmin')
            
            const { resultado } = ResultadoSolicitud.output;

            if (resultado == 200){
                return true
            } else {
                return false
            }
        } catch (error){
                throw error;
        } finally {
            if (conexion) {
                await sql.close();
            }
        }
    }
}   
