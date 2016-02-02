"use strict";

const fs = require("fs");
const app = require("express")();
const PORT = process.env.PORT || 3000;

app.get("/favicon.ico", (req, res) => {
  res.writeHead(200, {"Content-Type": "image/x-icon"} );
  const img = fs.readFileSync("./favicon.ico");
  res.end(img, "binary");
  console.log("favicon requested");
});

app.get("/hello", (req, res) => {
  res.writeHead(200, {"Content-Type": "text/html"});
  const name = req.query.name;
  const msg = `<h1>Hello ${name}</h1>`;
  msg.split("").forEach((letter, i) => {
    setTimeout(() => {
      res.write(letter);
    }, 100 * i);
  });
  setTimeout(() => {
    res.end(`<h3>Goodbye ${name}...</h3>`);
  }, 1500 + 100 * name.length);
});

app.get("/random/:min/:max", (req, res) => {
  const min = parseInt(req.params.min);
  const max = parseInt(req.params.max);
  res.status(200).send((Math.floor(Math.random() * (max - min + 1)) + min).toString());
});

app.get("/random", (req, res) => {
  res.status(200).send((Math.floor(Math.random() * (100 - 0 + 1))).toString());
});

app.get("/secret", (req, res) => {
  res.status(403).send("Access denied!");
});

app.listen(PORT, () => {
  console.log(`Node.js server started. lisetening on port ${PORT}`);
});
