import { logger } from "../utilidades/Logger.js";
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
                this.responderConExito(res, ResultadoRecuperacion.mensaje, ResultadoRecuperacion.datos[0]);
            } else {
                this.responderConError(res, ResultadoRecuperacion.resultado, ResultadoRecuperacion.mensaje);
            }
        } catch (error){
            logger({ mensaje: `Error en ObtenerPerfilPropio: ${error}` });
            this.responderConError(res, 500, "Ha ocurrido un error al recuperar el perfil");
        }
    }

    ActualizarPerfil = async (req, res) => {
        try {
            const {idUsuario} = req;
            const datosActualizacion = req.body;

            const ResultadoValidacion = ValidarActualizacionPerfil(datosActualizacion)

            if (!ResultadoValidacion.success) {
                return this.responderConError(res, 400, ResultadoValidacion.error.formErrors.fieldErrors)
            }

            const ResultadoActualizacion = await this.modeloPerfil.ActualizarPerfil({
                idUsuario,
                datos: ResultadoValidacion.data
            });

            this.manejarResultado(res, ResultadoActualizacion);
        } catch (error){
            logger({ mensaje: `Error en ActualizarPerfil: ${error}` });
            this.responderConError(res, 500, "Ha ocurrido un error al actualizar el perfil");
        }
    }

    ActualizarAvatar = async (req, res) => {
        try {
            const { idUsuario } = req;
            const { datos } = req.body;


            const ResultadoValidacion = ValidarActualizacionAvatar(datos)
            
            if (!ResultadoValidacion.success) {
                return this.responderConError(res, 400, ResultadoValidacion.error.formErrors.fieldErrors)
            }

            const ResultadoActualizacion = await this.modeloPerfil.ActualizarAvatar({
                idUsuario,
                datos: ResultadoValidacion.data
            });

            this.manejarResultado(res, ResultadoActualizacion);
        } catch (error) {
            logger({ mensaje: `Error en ActualizarAvatar: ${error}` });
            this.responderConError(res, 500, "Ha ocurrido un error al actualizar el avatar");
        }
    }

    ObtenerUsuarioPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const resultado = await this.modeloPerfil.ObtenerUsuarioPorId({ id });

        this.manejarResultado(res, resultado);
    } catch (error) {
        logger({ mensaje: `Error en ObtenerUsuarioPorId: ${error}` });
        this.responderConError(res, 500, "Error al recuperar usuario por ID");
    }
}


    manejarResultado = (res, resultado) => {
        const codigoResultado = parseInt(resultado.resultado);
        
        if (codigoResultado === 200) {
            this.responderConExito(res, resultado.mensaje, resultado.datos);
        } else {
            this.responderConError(res, codigoResultado, resultado.mensaje);
        }
    }

    responderConExito = (res, mensaje, datos) => {
        res.status(200).json({
            error: false,
            estado: 200,
            mensaje,
            datos
        });
    }

    responderConError = (res, codigo, mensaje) => {
        res.status(codigo).json({
            error: true,
            estado: codigo,
            mensaje
        });
    }
}