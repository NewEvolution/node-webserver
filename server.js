"use strict";

const fs = require("fs");
const app = require("express")();
const PORT = process.env.PORT || 3000;

app.get("/favicon.ico", (req, res) => {
  res.writeHead(200, {'Content-Type': 'image/x-icon'} );
  const img = fs.readFileSync('./favicon.ico');
  res.end(img, 'binary');
  console.log('favicon requested');
});

app.get("/hello", (req, res) => {
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
});

app.get("/random", (req, res) => {
  res.end(Math.random().toString());
});

app.get("*", (req, res) => {
  res.writeHead(403);
  res.end("Access denied!");
});

app.listen(PORT, () => {
  console.log(`Node.js server started. lisetening on port ${PORT}`);
});
