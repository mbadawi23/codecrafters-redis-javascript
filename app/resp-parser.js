module.export = class Resp {
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
};
