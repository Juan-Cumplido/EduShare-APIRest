export const SoloLetras = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ' -]+$/;
export const SoloLetrasNumerosCaracteres = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ0-9\s!&*()_+=\[\]{};:'",.¿?`\\-]*$/;
export const SoloDecimalesPositivos = /^\d{1,2}\.\d{1}$/;
export const SoloLetrasYNumeros = /^[a-zA-Z0-9]+$/;
export const SoloRutas = /^(\/?[a-zA-Z0-9_-]+\/)*[a-zA-Z0-9_-]+\.[a-zA-Z0-9]+$/;
export const SoloCorreos = /^[a-zA-Z0-9._%+-]{1,128}@[a-zA-Z0-9.-]{1,128}\.[a-zA-Z]{2,}$/;

