const express = require("express");
const app = express();
const PORT = 4000;
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
   cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
   },
});

io.on("connection", (socket) => {
   console.log(`⚡: ${socket.id} user just connected!`);

   socket.on("join_room", (data) => {
      socket.join(data);
      console.log(`User ID: ${socket.id} joined the room ${data}`);
   });

   socket.on("send_message", (data) => {
      socket.to(data.room).emit("receive_message", data);
   });
   socket.on("disconnect", () => {
      console.log(`🔥: ${socket.id} user disconnected`);
   });
});

server.listen(PORT, () => {
   console.log(`Server listening on ${PORT}`);
});
