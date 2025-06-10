const { emitNotification } = require("../socket");

/**
 * Envía una notificación genérica a uno o varios usuarios
 * @param {{ to: string[], title: string, message: string, from?: string, type?: string, data?: object }} notification
 */
function sendNotification({ to, title, message, from = null, type = 'info', data = {} }) {
  const payload = {
    title,
    message,
    from,
    type,
    data,
    timestamp: new Date().toISOString()
  };

  emitNotification(to, payload);
}

module.exports = { sendNotification };
