
//sender 
const net = require("net");

// tcp connection server
const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    console.log(data);
  });
});

server.listen(8000, "127.0.0.1", () => {
  console.log("opened server on", server.address());
});


// tcp connection sender
const socket = net.createConnection({ host: "127.0.0.1", port: 3099 }, () => {
  const buff = Buffer.alloc(8);
  buff[0] = 12;
  buff[1] = 34;

  socket.write(buff);
});