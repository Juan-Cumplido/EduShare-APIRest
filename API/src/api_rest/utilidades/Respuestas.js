export const manejarResultado = (res, resultado) => {
    const codigoResultado = parseInt(resultado.resultado);
    
    if (codigoResultado === 200) {
        responderConExito(res, resultado.mensaje, resultado.datos);
    } else {
        responderConError(res, codigoResultado, resultado.mensaje);
    }
}

export const responderConExito = (res, mensaje, datos) => {
    res.status(200).json({
        error: false,
        estado: 200,
        mensaje,
        datos
    });
};

export const responderConError = (res, codigo, mensaje) => {
    res.status(codigo).json({
        error: true,
        estado: codigo,
        mensaje
    });
};