const net = require("net");
// const resp = require("resp");
// const Parser = require("redis-parser");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this block to pass the first stage
const server = net.createServer((connection) => {
  // Handle connection
  console.log("Connection received from client.");

  connection.on("data", (data) => {
    // console.log('resp.stringify("PONG")', resp.stringify("PONG"));
    // connection.write(resp.stringify("PONG"));
    connection.write("+PONG\r\n");
  });

  connection.on("end", () => {
    console.log("client disconnected");
  });
  // connection.write("Hello, welcome to my Redis server.\r\n");
  // connection.pipe(connection);
});

server.listen(6379, "127.0.0.1");
