import { logger } from "../utilidades/Logger.js";
import { manejarResultado, responderConExito, responderConError } from "../utilidades/Respuestas.js";
import { ValidarActualizacionAvatar, ValidarActualizacionPerfil } from "../schemas/Perfil.js";

export class PerfilControlador{
    constructor({ModeloPerfil}){
        this.modeloPerfil = ModeloPerfil
    }

    ObtenerPerfilPropio = async (req, res) => {
        try{
            const {idUsuario} = req;

            const ResultadoRecuperacion = await this.modeloPerfil.ObtenerPerfilPropio({
                idUsuario
            });

            if (ResultadoRecuperacion.resultado === 200) {
                responderConExito(res, ResultadoRecuperacion.mensaje, ResultadoRecuperacion.datos[0]);
            } else {
                responderConError(res, ResultadoRecuperacion.resultado, ResultadoRecuperacion.mensaje);
            }
        } catch (error){
            logger({ mensaje: `Error en ObtenerPerfilPropio: ${error}` });
            responderConError(res, 500, "Ha ocurrido un error al recuperar el perfil");
        }
    }

    ActualizarPerfil = async (req, res) => {
        try {
            const {idUsuario} = req;
            const datosActualizacion = req.body;

            const ResultadoValidacion = ValidarActualizacionPerfil(datosActualizacion)

            if (!ResultadoValidacion.success) {
                return responderConError(res, 400, ResultadoValidacion.error.formErrors.fieldErrors)
            }

            const ResultadoActualizacion = await this.modeloPerfil.ActualizarPerfil({
                idUsuario,
                datos: ResultadoValidacion.data
            });

            manejarResultado(res, ResultadoActualizacion);
        } catch (error){
            logger({ mensaje: `Error en ActualizarPerfil: ${error}` });
            responderConError(res, 500, "Ha ocurrido un error al actualizar el perfil");
        }
    }

    ActualizarAvatar = async (req, res) => {
        try {
            const { idUsuario } = req;
            const { datos } = req.body;


            const ResultadoValidacion = ValidarActualizacionAvatar(datos)
            
            if (!ResultadoValidacion.success) {
                return responderConError(res, 400, ResultadoValidacion.error.formErrors.fieldErrors)
            }

            const ResultadoActualizacion = await this.modeloPerfil.ActualizarAvatar({
                idUsuario,
                datos: ResultadoValidacion.data
            });

            manejarResultado(res, ResultadoActualizacion);
        } catch (error) {
            logger({ mensaje: `Error en ActualizarAvatar: ${error}` });
            responderConError(res, 500, "Ha ocurrido un error al actualizar el avatar");
        }
    }

    ObtenerPerfilPorId = async (req, res) => {
        try {
            const { idUsuario } = req.params;
            
            const resultado = await this.modeloPerfil.ObtenerPerfilPorId({ idUsuario })

            if (resultado.resultado === 200) {
                responderConExito(res, resultado.mensaje, resultado.datos[0])
            } else {
                responderConError(res, resultado.resultado, resultado.mensaje)
            }
        } catch (error) {
            logger({ mensaje: `Error en ObtenerPerfilPorId: ${error}` });
            responderConError(res, 500, "Error al recuperar usuario por ID");
        }
    }

    ObtenerPerfiles = async (req, res) => {
        try {

            const ResultadoRecuperacion = await this.modeloPerfil.ObtenerPerfiles()

            manejarResultado(res, ResultadoRecuperacion);
        } catch (error) {
            logger({ mensaje: `Error en ObtenerPerfiles: ${error}` });
            responderConError(res, 500, "No se han podido recuperar los perfiles");
        }
    }
}