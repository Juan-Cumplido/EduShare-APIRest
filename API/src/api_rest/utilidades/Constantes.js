export function MensajeDeRetornoBaseDeDatos({datos})
{
    const { estado, mensaje } = datos;
    return { estado, mensaje };
}

export function MensajeDeRetornoBaseDeDatosAcceso({datos})
{
    const { resultado, mensaje } = datos;
    return {resultado, mensaje};
}

export function MensajeDeRetornoBaseDeDatosInfoAdicional({datos})
{
    const { resultado, mensaje, datosAdicionales } = datos;
    return {resultado, mensaje, datosAdicionales};
}

export function MensajeRetornoBDId({datos}){
    return {
        resultado: datos.resultado,
        mensaje: datos.mensaje,
        id: datos.id
    }
}
export function MensajeDeRetornoBaseDeDatosCatalogo({ datos, recordset }) {
    return {
        resultado: datos.resultado,
        mensaje: datos.mensaje,
        datos: recordset || []
    };
}

