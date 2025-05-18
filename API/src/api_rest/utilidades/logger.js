import log4js from 'log4js';

log4js.configure(
{
    appenders: { archivo: { type: 'file', filename: 'logs/error.log' } },
    categories: { default: { appenders: ['archivo'], level: 'error' } }
})

const log = log4js.getLogger();

export function logger({mensaje})
{
    log.error(mensaje);
}