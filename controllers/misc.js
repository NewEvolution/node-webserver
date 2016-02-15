'use strict'
/* eslint no-magic-numbers:0 */

const cheerio = require('cheerio');
const request = require('request');
const success = 200;

const News = require('../models/news');

function successHeader (res, type) {
  const headObj = {};
  headObj['Content-Type'] = type;
  res.writeHead(success, headObj);
}

module.exports.hello = (req, res) => {
  successHeader(res, 'text/html');
  const name = req.query.name;
  const msg = `<h1>Hello ${name}</h1>`;
  msg.split('').forEach((letter, i) => {
    setTimeout(() => {
      res.write(letter);
    }, 100 * i);
  });
  setTimeout(() => {
    res.end(`<h3>Goodbye ${name}...</h3>`);
  }, 1500 + 100 * name.length);
};

module.exports.reddit = (req, res) => {
  const url = 'http://reddit.com';
  request.get(url, (err, response, body) => {
    if (err) throw err;
    const $ = cheerio.load(body);
    $('a.title').attr('href', 'https://www.youtube.com/watch?v=9NcPvmk4vfo');
    res.send($.html())
  });
};

module.exports.secret = (req, res) => {
  res.status(403).send('Access denied!');
};

module.exports.index = (req, res) => {
  News.findOne({}).sort({_id: -1}).exec((err, doc) => {
    if (err) throw err;
    doc = doc || {top: ['']};
    res.render('index', {topStory: doc.top[0]});
  });
};
