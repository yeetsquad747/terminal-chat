const chalk =  require("chalk");
const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const { io } = require("socket.io-client");
console.clear();

let server_url = "";
rl.question(
  chalk.whiteBright(
    "What is the url of the server(example: http://192.168.1.108:3000)? "
  ),
  (answer) => {
    server_url = answer;
    const socket = io(server_url);

    let id = "";
    let buffer = "";

    function chat() {
      rl.question(chalk.magenta("» "), (answer) => {
        buffer = `${chalk.cyan(id)} : ${chalk.green(answer)}`;
        if (!answer) {
          rl.question(chalk.redBright("No sending blank messages!"), () => {
            chat();
          });
        } else {
          socket.emit("message", buffer);
        }
        chat();
      });
    }

    socket.on("connect", () => {
      rl.pause();
      rl.question(
        chalk.whiteBright("😃 What's your name?\n "),
        (answer) => {
          socket.emit(
            "message",
            `👤  ${chalk.green(answer)} has joined the chat`
          );
          id = answer;
          chat();
        }
      );
      socket.on("msg", function (data) {
        if (buffer != data) {
          console.log("\n" + data);
          chat();
        }
      });
    });
  }
);
