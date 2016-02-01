"use strict";

const http = require("http");
const port = 3000;

http.createServer((req, res) => {
  console.log(req.method, req.url);

  res.end("Done");
}).listen(port, () => {
         console.log("Node.js server started. lisetening on port", port);
});
