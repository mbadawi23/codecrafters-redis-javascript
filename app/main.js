const net = require("net");
const Resp = require("./lib/resp-parser");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this block to pass the first stage
const server = net.createServer((connection) => {
  // Handle connection
  console.log("Connection received from client.");

  const parser = new Resp();

  connection.on("data", (buffer) => {
    const data = buffer.toString();
    console.log("data", data);

    if (data === "+PING") {
      connection.write("+PONG\r\n");
    } else if (data[0] === "*") {
      console.log("Parsing array...");
      const parseArray = (resp) => {
        console.log("resp", resp);
        const rawArr = resp.split(/\r?\n/);
        console.log("rawArr", rawArr);
        const filtered = rawArr.filter(
          (item) => !/[\*\$\+\-]/.test(item) && !/^(?![\s\S])/.test(item)
        );
        console.log("filtered", filtered);
        return filtered;
      };
      const respArr = parseArray(data);
      respArr.forEach((item, i) => {
        if (item.toUpperCase() === "PING") {
          console.log("PONG");
          connection.write("+PONG\r\n");
        } else if (item.toUpperCase() === "ECHO") {
          console.log("ECHO", respArr[i + 1]);
          if (i + 1 < respArr.length)
            connection.write(`+${respArr[i + 1]}\r\n`);
          else connection.write("ERR wrong number of arguments for command");
        } else {
          console.log("Command Not Supported!!!");
          connection.write(`-ERR unknown command ${item}\r\n`);
        }
      });
    }
  });

  connection.on("end", () => {
    console.log("client disconnected");
  });
  // connection.write("Hello, welcome to my Redis server.\r\n");
  // connection.pipe(connection);
});

server.listen(6379, "127.0.0.1");
