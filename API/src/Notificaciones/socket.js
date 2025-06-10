let ioInstance = null;

function initializeSocket(server) {
  const { Server } = require("socket.io");
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("Socket conectado:", socket.id);

    socket.on("join", (userId) => {
      socket.join(userId);
    });

    socket.on("disconnect", () => {
      console.log("Socket desconectado:", socket.id);
    });
  });

  ioInstance = io;
}

function emitNotification(userIds = [], payload) {
  if (!ioInstance) return;
  userIds.forEach((userId) => {
    ioInstance.to(userId).emit("ReceiveNotification", payload);
  });
}

module.exports = {
  initializeSocket,
  emitNotification
};
