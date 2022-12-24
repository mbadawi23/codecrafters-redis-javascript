const net = require("net");
// const resp = require("resp");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this block to pass the first stage
const server = net.createServer((connection) => {
  // Handle connection
  console.log("Hello from my CodeCrafters' redis!");

  console.log("connection", connection);
  connection.on("connection", (stream) => console.log(stream));
});

server.listen(6379, "127.0.0.1");
