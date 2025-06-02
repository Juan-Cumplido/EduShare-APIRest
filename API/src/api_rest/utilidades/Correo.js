import fs from 'fs';
import nodemailer from 'nodemailer';

export const EnviarCorreoDeVerificacion = async(plantilla,correo,codigo) =>{

    const HTML = CargarPlantilla(plantilla, {CODIGO: codigo});
    const Transportador = nodemailer.createTransport({
        service: 'gmail',
        auth:{
            user: process.env.CORREO,
            pass: process.env.CONTRASENIA_APLICACION
        }
    })
    const OpcionesDeCorreo = {
        from: '"Recuperación de contraseña EduShare" '+process.env.CORREO,
        to: correo,
        subject:'Código de verificación EduShare',
        html: HTML
    }
    try
    {
        await Transportador.sendMail(OpcionesDeCorreo);
    }
    catch(error)
    {
        throw error;
    }
}

const CargarPlantilla = (rutaArchivo, reemplazos) => {
    let plantilla = fs.readFileSync(rutaArchivo, 'utf8');
    for (const CODIGO in reemplazos) {
        const Regex = new RegExp(`{{${CODIGO}}}`, 'g');
        plantilla = plantilla.replace(Regex, reemplazos[CODIGO]);
    }
    return plantilla;
};

