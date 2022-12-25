const net = require("net");

class Resp {
  constructor() {
    this.EMPTY_STRING = "$0\r\n\r\n";
    this.NULL_STRING = "$-1\r\n";
    this.NULL_ARRAY = "*-1\r\n";
    this.OK = "+OK\r\n";
    this.PONG = "+PONG\r\n";
  }

  encode(data) {
    if (data instanceof Array) {
      let encoded = `*${data.length}\r\n`;
      data.forEach((item) => (encoded = encoded.concat(this.encode(data))));
      return encoded;
    } else {
      switch (typeof data) {
        case "string":
          return `\$${data.length}\r\n${data}\r\n`;
        case "number":
          return `:${data.toString()}\r\n`;
        case "boolean":
          return `\$${data.toString().length}\r\n${data.toString()}\r\n`;
        case "bigint":
        default:
          return this.NULL_STRING;
      }
    }
  }

  parse(data) {
    if (data.length === 0) return undefined;

    switch (data[0]) {
      case "*":
        return this.#parseArray(data);
      case "$":
        return this.#parseString(data);
      case ":":
        return this.#parseNumber(data);
      default:
        break;
    }
  }

  #parseArray(data) {
    const rawArr = data.split(/\r?\n/);
    const filtered = rawArr.filter(
      (item) => !/[\*\$\+\-]/.test(item) && !/^(?![\s\S])/.test(item)
    );
    return filtered;
  }

  #parseString(data) {
    return data
      ? data.substring(data.indexOf("\r\n") + 2).replace("\r\n", "")
      : "";
  }

  #parseNumber(data) {
    return Number(data.slice(1).replace("\r\n", ""));
  }

  // TODO: to avoid recursion in encode()
  // #encodeSimpleTypes(data) {  }
}

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this block to pass the first stage
const server = net.createServer((connection) => {
  // Handle connection
  console.log("Connection received from client.");

  const parser = new Resp();
  console.log("parser.OK", parser.OK);

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
