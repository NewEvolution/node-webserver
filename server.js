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
app.locals.date = new Date();

app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true,
  sourceMap: true
}));

app.use(express.static(path.join(__dirname, 'public')));


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

function successHeader(res, type) {
  const headObj = {};
  headObj["Content-Type"] = type;
  res.writeHead(200, headObj);
}

app.get("/api", (req, res) => {
  res.send({this: "is an API"});
});

app.post("/api", (req, res) => {
  const obj = _.mapValues(req.body, val => val.toUpperCase());
  res.send(obj);
});

app.get("/api/news", (req, res) => {
  const url = "http://cnn.com";
  request.get(url, (err, response, body) => {
    if(err) throw err;
    const $ = cheerio.load(body);
    const news = [];
    const $bannerText = $(".banner-text")
    news.push({
      title: $bannerText.text(),
      url: `http://cnn.com${$bannerText.closest("a").attr("href")}`
    });
    const $headline = $(".cd__headline");
    _.range(1, 12).forEach(i => {
      const $headlineEl = $headline.eq(i)
      let theUrl = $headlineEl.find("a").attr("href");
      if(theUrl.indexOf("http") != 0) {
        theUrl = `http://cnn.com${theUrl}`;
      }
      news.push({
        title: $headlineEl.text(),
        url: theUrl
      });
    });
    res.send(news)
  });
});

app.get("/api/random", (req, res) => {
  const url = "https://randomapi.com/api/?key=2IS9-4BF5-3W5L-7Z67&id=irta6tm";
  request.get(url, (err, response, body) => {
    if(err) throw err;
    res.send(JSON.parse(body));
  });
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

app.get("/contact", (req, res) => {
  res.render("contact");
});

app.post("/contact", (req, res) => {
  const name = req.body.name;
  res.send(`<h1>Thanks for contacting us ${name}!</h1>`);
});

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

app.get("/random/:min/:max", (req, res) => {
  const min = parseInt(req.params.min);
  const max = parseInt(req.params.max);
  res.status(200).send((Math.floor(Math.random() * (max - min + 1)) + min).toString());
});

app.get("/random", (req, res) => {
  res.status(200).send((Math.floor(Math.random() * (100 - 0 + 1))).toString());
});

app.get("/reddit", (req, res) => {
 const url = "http://reddit.com";
  request.get(url, (err, response, body) => {
    if(err) throw err;
    const $ = cheerio.load(body);
    $("a.title").attr("href", "https://www.youtube.com/watch?v=9NcPvmk4vfo");
    res.send(d.html())
  });
});

app.get("/secret", (req, res) => {
  res.status(403).send("Access denied!");
});

app.get("/sendphoto", (req, res) => {
  res.render("sendphoto");
});

app.post("/sendphoto", upload.single("image"), (req, res) => {
  const extension = path.extname(req.file.originalname);
  const tempPath = req.file.path;
  const newPath = tempPath + extension;
  fs.rename(tempPath, newPath, err => {
    if(err) {
      res.send(`<p>Something has gone wrong: <strong>${err.message}</strong></p>`);
      throw err;
    }
    console.log("renamed to", newPath);
    imgur.uploadFile(newPath)
    .then(function (json) {
      fs.unlink(newPath);
      const rawImageUrl = json.data.link;
      const pageUrl = rawImageUrl.slice(0, -4);
      res.end(`<a href="${pageUrl}"><img src="${pageUrl}l${extension}" alt="Your image"></a>
              <p><a href="${pageUrl}l${extension}">Large Thumbnail</a></p>
              <p><a href="${pageUrl}m${extension}">Medium Thumbnail</a></p>
              <p><a ef="${pageUrl}s${extension}">Small Thumbnail</a></p>`);
    }).catch(function (err) {
      fs.unlink(newPath);
      res.end(`<p>Something has gone wrong: <strong>${err.message}</strong></p>`);
    });
  });
  res.write("<h1>Thanks for your image!</h1>");
});

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(PORT, () => {
  console.log(`Node.js server started. lisetening on port ${PORT}`);
});
