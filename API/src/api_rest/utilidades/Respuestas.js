export const manejarResultado = (res, resultado) => {
    const codigo = parseInt(resultado.resultado);
    
    const respuestasExitosas = {
        200: responderConExito,
        201: responderConExito201,
        204: responderConExito204
    };
    
    if (respuestasExitosas[codigo]) {
        respuestasExitosas[codigo](res, resultado.mensaje, resultado.datos);
    } 

    else {
        responderConError(res, codigo, resultado.mensaje);
    }
};

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

export const responderConExito201 = (res, mensaje, datos) => {
    res.status(201).json({
        error: false,
        estado: 201,
        mensaje,
        datos
    });
};

export const responderConExito204 = (res, mensaje, datos) => {
    res.status(204).json({
        error: false,
        estado: 204,
        mensaje,
        datos
    });
};


export const validarId = (id, res, entidad) => {
    if (isNaN(id) || id <= 0) {
        responderConError(res, 400, `El ID de ${entidad} debe ser un número válido`);
        return false;
    }
    return true;
};