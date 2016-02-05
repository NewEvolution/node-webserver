"use strict";

const fs = require("fs");
const _ = require("lodash");
const path = require("path");
const imgur = require("imgur");
const cheerio = require("cheerio");
const express = require("express");
const request = require("request");
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const utility = require("node-cal/lib/utility");
const upload = require("multer")({dest: "tmp/uploads"});
const PORT = process.env.PORT || 3000;
const app = express();

app.set("view engine", "jade");

app.locals.title = "A Calendar in Node.js";

app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true,
}));

app.use(express.static(path.join(__dirname, 'public')));

function successHeader(res, type) {
  const headObj = {};
  headObj["Content-Type"] = type;
  res.writeHead(200, headObj);
}

function printMonth(res, month, year) {
  const calArr = utility.buildMonth(month, year);
  res.write("<pre><h2>");
  calArr.forEach((week, i) => {
    if(i < 2) {
      res.write(`<strong>${week}</strong>\n`);
    } else {
      res.write(`${week}\n`);
    }
  });
  res.end("</h2></pre>");
}

function imgurSend(err, res, newPath) {
  if(err) {
    res.send(`<p>Something has gone wrong: <strong>${err.message}</strong></p>`);
    throw err;
  }
  imgur.uploadFile(newPath)
  .then(function (json) {
    res.send(`<img src="${json.data.link}" alt="Your image">`);
  }).catch(function (err) {
    res.send(`<p>Something has gone wrong: <strong>${err.message}</strong></p>`);
  });
}

app.get("/hello", (req, res) => {
  successHeader(res, "text/html");
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

app.get("/cal/:month/:year", (req, res) => {
  successHeader(res, "text/html");
  const month = req.params.month;
  const year = req.params.year;
  printMonth(res, month, year);
});

app.get("/cal/:year", (req, res) => {
  successHeader(res, "text/html");
  const year = req.params.year;
  const yearArray = utility.buildYear(year);
  res.end(yearArray.toString());
});

app.get("/cal", (req, res) => {
  const date = new Date();
  const month = date.getMonth();
  const year = date.getFullYear();
  printMonth(res, month, year);
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

app.get("/contact", (req, res) => {
  res.render("contact");
});

app.get("/sendphoto", (req, res) => {
  res.render("sendphoto");
});

app.post("/sendphoto", upload.single("image"), (req, res) => {
  const extension = path.extname(req.file.originalname);
  const tempPath = req.file.path;
  const newPath = tempPath + extension;
  fs.rename(tempPath, newPath, imgurSend(err, res, newPath));

  res.write("<h1>Thanks for your image!</h1>");
});

app.post("/contact", (req, res) => {
  const name = req.body.name;
  res.send(`<h1>Thanks for contacting us ${name}!</h1>`);
});

app.get("/", (req, res) => {
  res.render("index", {
    date: new Date()
  });
});

app.listen(PORT, () => {
  console.log(`Node.js server started. lisetening on port ${PORT}`);
});
