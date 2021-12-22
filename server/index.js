const express = require("express")
const chalk = require("chalk")
let app = express();

let http = require("http").Server(app);
let io = require("socket.io")(http);

io.on("connection", function (socket) {
  io.emit("msg", chalk.greenBright("New connection to server received"));
  socket.on("message", function (data) {
    io.emit("msg", data);
    console.log(data);
  });
});

http.listen(3000, function () {
  console.log("listening on 3000");
});
