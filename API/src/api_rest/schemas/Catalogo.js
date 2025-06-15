import zod from 'zod';

const CatalogoEsquema = zod.object({
    idRama: zod.number({ invalid_type_error: 'El id de rama no es válido', required_error: 'El id de rama es un campo requerido' 
    }).int().positive()
})

export function ValidarRecuperacionCatalogo(entrada){
    return CatalogoEsquema.safeParse(entrada)
}