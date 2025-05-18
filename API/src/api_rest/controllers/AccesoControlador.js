import { ValidarEdicionParcialAcceso, ValidarEliminacionAcceso, ValidarInsercionAcceso, ValidarCredencialesAcceso } from "../schemas/Acceso.js";
import { ValidarCorreo } from "../schemas/Publicacion.js";
import { logger } from "../utilidades/logger.js";

export class AccesoControlador
{
    constructor({ModeloAcceso})
    {
        this.modeloAcceso = ModeloAcceso;
    }

    RegistrarAcceso = async (req, res) => {
        try {
            const ResultadoValidacion = ValidarInsercionAcceso(req.body);
            if (ResultadoValidacion.success) {
                const ResultadoInsercion = await this.modeloAcceso.InsertarNuevaCuenta({ 
                    datos: ResultadoValidacion.data 
                });
                
                let resultadoInsercion = parseInt(ResultadoInsercion.resultado);
                if (resultadoInsercion === 500) {
                    logger({ mensaje: ResultadoInsercion.mensaje });
                    res.status(resultadoInsercion).json({
                        error: true,
                        estado: ResultadoInsercion.resultado,
                        mensaje: 'Ha ocurrido un error en la base de datos al querer insertar los datos una nueva cuenta de acceso'
                    });
                } else {
                    res.status(resultadoInsercion).json({
                        error: resultadoInsercion !== 200,
                        estado: ResultadoInsercion.resultado,
                        mensaje: ResultadoInsercion.mensaje
                    });
                }
            } else {
                res.status(400).json({
                    error: true,
                    estado: 400,
                    mensaje: ResultadoValidacion.error.formErrors.fieldErrors
                });
            }
        } catch (error) {
            logger({ mensaje: error });
            res.status(500).json({
                error: true,
                estado: 500,
                mensaje: "Ha ocurrido un error al querer registrar el Acceso."
            });
        }
    }

    RecuperarContrasena = async(req, res) =>{
        try {

        } catch (error){
            const ResultadoValidacion = ValidarCorreo(req.body)
        }
    }


}