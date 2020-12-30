let io;
 
module.exports = {
  init: httpServer => {
      io = require("socket.io")(httpServer, {
         cors: {
             origin: "http://localhost:3001",
             methods: ["GET", "POST", "PUT", "DELETE"]
         }
     });
    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error("Socket.io not initialized!");
    }
    return io;
  },
};