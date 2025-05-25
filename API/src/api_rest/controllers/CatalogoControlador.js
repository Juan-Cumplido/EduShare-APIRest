import { ValidarRecuperacionCatalogo } from "../schemas/Catalogo.js";
import { logger } from "../utilidades/logger.js";

export class CatalogoControlador{
    constructor({ModeloCatalogo}){
        this.modeloCatalogo = ModeloCatalogo
    }

    RecuperarCategorias = async (req, res) => {
        try {
            const ResultadoRecuperacion = await this.modeloCatalogo.RecuperarCategorias()
            
            let codigoResultado = parseInt(ResultadoRecuperacion.resultado);
            
            if (codigoResultado === 200) {
                res.status(200).json({
                    error: false,
                    estado: 200,
                    mensaje: ResultadoRecuperacion.mensaje,
                    datos: ResultadoRecuperacion.datos
                });
            } else {
                res.status(codigoResultado).json({
                    error: true,
                    estado: codigoResultado,
                    mensaje: ResultadoRecuperacion.mensaje
                });
            }
        } catch (error) {
            logger({ mensaje: `Error en RecuperarCategorías: ${error}` });
            res.status(500).json({
                error: true,
                estado: 500,
                mensaje: "Ha ocurrido un error al recuperar las categorías"
            });
        }
    }

    RecuperarRamas = async (req, res) => {
        try {
            const ResultadoRecuperacion = await this.modeloCatalogo.RecuperarRamas()

            let codigoResultado = parseInt(ResultadoRecuperacion.resultado)

            if (codigoResultado == 200){
                res.status(200).json({
                    error: false,
                    estado: 200,
                    mensaje: ResultadoRecuperacion.mensaje,
                    datos: ResultadoRecuperacion.datos
                })
            } else {
                res.status(codigoResultado).json({
                    error: true,
                    estado: codigoResultado,
                    mensaje: ResultadoRecuperacion.mensaje
                })
            }
        } catch (error){
            logger({mensaje: `Error en RecuperarRamas ${error}`})
            res.status(500).json({
                error: true,
                estado: 500,
                mensaje: "Ha ocurrido un error al recuperar las ramas"
            })
        }
    }

    RecuperarMaterias = async (req, res) => {
        try {
            const { idRama } = req.query;
            
            if (idRama) {
                await this.recuperarMateriasPorRama(res, idRama)
            } else {
                await this.recuperarTodasLasMaterias(res)
            }
        } catch (error) {
            logger({ mensaje: `Error en RecuperacionMaterias ${error}` })
            this.responderConError(res, 500, "Ha ocurrido un error al recuperar las materias");
        }
    }

    RecuperarInstituciones = async (req, res) => {
        try {
            const { nivel } = req.query; 
            
            if (nivel && !['Preparatoria', 'Universidad'].includes(nivel)) {
                return res.status(400).json({
                    resultado: 400,
                    mensaje: 'Nivel educativo no válido. Use "Preparatoria" o "Universidad"'
                });
            }

            const resultado = await this.modeloCatalogo.RecuperarInstituciones({ 
                nivelEducativo: nivel 
            });

            return res.status(resultado.resultado).json(resultado);
            
        } catch (error) {
            console.error('Error al recuperar instituciones:', error);
            return res.status(500).json({
                resultado: 500,
                mensaje: 'Error interno del servidor'
            });
        }
    }

    recuperarMateriasPorRama = async (res, idRama) => {
        const ResultadoValidacion = ValidarRecuperacionCatalogo({ idRama: parseInt(idRama) });

        if (!ResultadoValidacion.success) {
            return this.responderConError(res, 400, ResultadoValidacion.error.formErrors.fieldErrors)
        }

        const ResultadoRecuperacion = await this.modeloCatalogo.RecuperarMateriasPorRama({
            idRama: ResultadoValidacion.data.idRama
        });

        this.manejarResultadoRecuperacion(res, ResultadoRecuperacion);
    }

    recuperarTodasLasMaterias = async (res) => {
        const ResultadoRecuperacion = await this.modeloCatalogo.RecuperarMaterias();
        this.manejarResultadoRecuperacion(res, ResultadoRecuperacion);
    }

    manejarResultadoRecuperacion = (res, resultado) => {
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