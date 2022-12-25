const net = require("net");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this block to pass the first stage
const server = net.createServer((connection) => {
  // Handle connection
  console.log("Connection received from client.");

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
        const arr = rawArr.reduce((result, item) => {
          console.log("item", item);
          const re = /[\*\$\+\-]*/;
          if (re.test(item)) return result;
        }, []);
        console.log("arr", arr);
        return resp;
      };
      parseArray(data);
    }
  });

  connection.on("end", () => {
    console.log("client disconnected");
  });
  // connection.write("Hello, welcome to my Redis server.\r\n");
  // connection.pipe(connection);
});

server.listen(6379, "127.0.0.1");
