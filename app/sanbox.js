console.log("Hello world");

const resp = "*3\r\n$4\r\nPING\r\n$4\r\nECHO\r\n$3\r\nhey\r\n";
console.log("resp", resp);

const rawArr = resp.split(/\r?\n/);
console.log("rawArr", rawArr);

const filtered = rawArr.filter(
  (item) => !/[\*\$\+\-]/.test(item) && !/^(?![\s\S])/.test(item)
);
console.log("filtered", filtered);

const reduced = filtered.reduce((prev, curr) => {
  if (curr === "PING") return prev.concat("PONG");
  else if (prev === "ECHO") return curr;
});
console.log("reduced", reduced);

console.log("forEach");
filtered.forEach((el, i) => {
  if (el === "PING") {
    console.log("PONG");
  } else if (el === "ECHO") {
    console.log("ECHO", filtered[i + 1]);
  }
});
