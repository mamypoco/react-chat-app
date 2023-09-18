const express = require("express");
const app = express();
const PORT = 4000;
const http = require("http"); //socket.io use http
const cors = require("cors");
const { Server } = require("socket.io");
app.use(cors());

const server = http.createServer(app); //create http server with express

const io = new Server(server, {
  //creating new instance as Server is a class
  cors: {
    origin: "http://localhost:3000", //access frontend URL
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  //io listen for connection event from socket.
  console.log(`⚡: ${socket.id} user just connected!`);

  socket.on("join_room", (data) => {
    //listen join_room event
    socket.join(data);
    console.log(`User ID: ${socket.id} joined the room ${data}`);
  });

  socket.on("send_message", (data) => {
    //listen send_message event
    socket.to(data.room).emit("receive_message", data); //to the room, emit receive_message that was received from frontend
  });
  socket.on("disconnect", () => {
    console.log(`🔥: ${socket.id} user disconnected`);
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
