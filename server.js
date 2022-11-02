/**
 * Establish the socket connection between client and server
 * After making connection it will handle the event
 * Emit the server side message to all the clients using broadcast or io.sockets
 *
 */
var express = require("express");
var socket = require("socket.io");
var users = {};
var app = express();
var server = app.listen(8000, function () {
  console.log("listening for requests on port 8000");
});

//To render all the files in the current directory
app.use(express.static(__dirname));

//socket setup and pass server
var io = socket(server);

//function is invoked while made a connection with browser
io.on("connection", (socket) => {
  console.log("made socket connection:", socket.id);

  //To handle the chat event
  socket.on("chat", function (data) {
    socket.broadcast.emit("chat", data);
  });

  //To handle the typing event
  socket.on("typing", function (data) {
    socket.broadcast.emit("typing", data);
  });

  //To handle the disconnect event
  socket.on("disconnect", function () {
    socket.broadcast.emit("left", users[socket.id]);
    delete users[socket.id];
  });

  //To handle the join event
  socket.on("joined", function (data) {
    users[socket.id] = data;
    socket.broadcast.emit("joined", data);
  });
});
