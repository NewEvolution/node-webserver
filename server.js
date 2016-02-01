"use strict";

const http = require("http");
const {PORT} = process.env;

http.createServer((req, res) => {
  console.log(req.method, req.url);
  res.writeHead(200, {
               "Content-type": "text/html"
  });
  debugger;
  res.end("&#23646;&#34278;");
}).listen(PORT, () => {
         console.log(`Node.js server started. lisetening on port ${PORT}`);
});
