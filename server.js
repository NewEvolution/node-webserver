"use strict";

const fs = require("fs");
const http = require("http");
const PORT = process.env.PORT || 3000;

http.createServer((req, res) => {
  console.log(req.method, req.url);
  switch(req.url) {
    case "/favicon.ico":
      res.writeHead(200, {'Content-Type': 'image/x-icon'} );
      const img = fs.readFileSync('./favicon.ico');
      res.end(img, 'binary');
      console.log('favicon requested');
      break;
    case "/hello":
      res.writeHead(200, {"Content-Type": "text/html"});
      const msg = "<h1>Hello world</h1>";
      msg.split("").forEach((letter, i) => {
        setTimeout(() => {
          res.write(letter);
        }, 100 * i);
      });
      setTimeout(() => {
        res.end("<h3>Goodbye world...</h3>");
      }, 2500);
      break;
    case "/random":
      res.end(Math.random().toString());
      break;
    default:
      res.writeHead(403);
      res.end("Access denied!");
      break;
  }
}).listen(PORT, () => {
         console.log(`Node.js server started. lisetening on port ${PORT}`);
});
