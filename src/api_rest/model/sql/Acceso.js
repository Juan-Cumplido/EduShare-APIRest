import sql from 'mssql';
import { RetornarTipoDeConexion } from './connection/ConfiguracionConexion.js';
import { MensajeDeRetornoBaseDeDatosAcceso, MensajeDeRetornoBaseDeDatos } from '../../utilidades/Constantes.js';

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
                idInstitucion = 1  // Valor predeterminado para pruebas
            } = datos;

            let fotoPerfilBuffer
            if (!fotoPerfil) {
                try {
                    const defaultImagePath = path.join(process.cwd(), 'resources', 'imagen-por-defecto.jpg');
                    //Eliminar esto después
                    console.log('Ruta de la imagen por defecto:', defaultImagePath)
                    fotoPerfilBuffer = await fs.readFile(defaultImagePath);
                } catch (error) {
                    console.error('Error al cargar imagen por defecto:', error);
                    fotoPerfilBuffer = null; // Si falla, se envía NULL a la BD
                }
            } else {
                fotoPerfilBuffer = fotoPerfil;
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
                .input('fotoPerfil', sql.VarBinary(sql.MAX), fotoPerfilBuffer)
                .input('idInstitucion', sql.Int, idInstitucion)

                .output('resultado', sql.Int)
                .output('mensaje', sql.NVarChar(200))
                .execute('spi_InsertarCuentaConUsuarioRegistrado');

            resultadoInsercion = MensajeDeRetornoBaseDeDatosAcceso({ datos: ResultadoSolicitud.output });
        } catch (error) {
            console.log(`Error en InsertarNuevaCuenta: ${error.message}`)
            //logger({ mensaje: `Error en InsertarNuevaCuenta: ${error.message}` });
        } finally {
            if (conexion) {
                await sql.close();
            }
        }
        return resultadoInsercion;
    }

    

}
