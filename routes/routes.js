'use strict'
/* eslint no-magic-numbers:0 */

const express = require('express');
const router = express.Router();

const fs = require('fs');
const _ = require('lodash');
const path = require('path');
const imgur = require('imgur');
const cheerio = require('cheerio');
const request = require('request');
const favicon = require('serve-favicon'); // eslint-disable-line no-unused-vars
const utility = require('node-cal/lib/utility');
const upload = require('multer')({dest: 'tmp/uploads'});
const success = 200;

const News = require('../models/news');
const Contact = require('../models/contact');
const Allcaps = require('../models/allcaps');

function printMonth (res, month, year) {
  const calArr = utility.buildMonth(month, year);
  res.write('<pre><h2>');
  calArr.forEach((week, i) => {
    if(i < 2) {
      res.write(`<strong>${week}</strong>\n`);
    } else {
      res.write(`${week}\n`);
    }
  });
  res.end('</h2></pre>');
}

function successHeader (res, type) {
  const headObj = {};
  headObj['Content-Type'] = type;
  res.writeHead(success, headObj);
}

router.get('/api', (req, res) => {
  res.send({this: 'is an API'});
});

router.post('/api', (req, res) => {
  const obj = _.mapValues(req.body, val => val.toUpperCase());
  const caps = new Allcaps(obj);
  caps.save((err, _caps) => {
    if(err) throw err;
    res.send(_caps);
  });
});

router.get('/api/news', (req, res) => {
  News.findOne({}).sort({_id: -1}).exec((err, doc) => {
    if(doc) {
      const FIFTEEN_MINS = 15 * 60 * 1000;
      const diff = new Date() - doc._id.getTimestamp() - FIFTEEN_MINS;
      const newsIsFresh = diff < 0;
      if(newsIsFresh) {
        res.send(doc)
        return;
      }
    }
    const url = 'http://cnn.com';
    request.get(url, (err, response, body) => {
      if(err) throw err;
      const $ = cheerio.load(body);
      const news = [];
      const $bannerText = $('.banner-text')
      news.push({
        title: $bannerText.text(),
        url: `http://cnn.com${$bannerText.closest('a').attr('href')}`
      });
      const $headline = $('.cd__headline');
      _.range(1, 12).forEach(i => {
        const $headlineEl = $headline.eq(i)
        let theUrl = $headlineEl.find('a').attr('href');
        if(theUrl.indexOf('http') !== 0) {
          theUrl = `http://cnn.com${theUrl}`;
        }
        news.push({
          title: $headlineEl.text(),
          url: theUrl
        });
      });

      const obj = new News({ top: news });

      obj.save((err, _news) => {
        if (err) throw err;
        res.send(_news);
      });
    });
  });
});

router.get('/api/random', (req, res) => {
  const url = 'https://randomapi.com/api/?key=2IS9-4BF5-3W5L-7Z67&id=irta6tm';
  request.get(url, (err, response, body) => {
    if(err) throw err;
    res.send(JSON.parse(body));
  });
});

router.get('/cal/:month/:year', (req, res) => {
  successHeader(res, 'text/html');
  const month = req.params.month;
  const year = req.params.year;
  printMonth(res, month, year);
});

router.get('/cal/:year', (req, res) => {
  successHeader(res, 'text/html');
  const year = req.params.year;
  const yearArray = utility.buildYear(year);
  res.end(yearArray.toString());
});

router.get('/cal', (req, res) => {
  const date = new Date();
  const month = date.getMonth();
  const year = date.getFullYear();
  printMonth(res, month, year);
});

router.get('/contact', (req, res) => {
  res.render('contact');
});

router.post('/contact', (req, res) => {
  const obj = new Contact({
    name: req.body.name,
    email: req.body.email,
    message: req.body.message
  });

  obj.save((err, newObj) => {
    if(err) throw err;
    res.send(`<h1>Thanks for contacting us ${newObj.name}!</h1>`);
  });
});

router.get('/hello', (req, res) => {
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
});

router.get('/random/:min/:max', (req, res) => {
  const min = parseInt(req.params.min);
  const max = parseInt(req.params.max);
  res.status(success).send((Math.floor(Math.random() * (max - min + 1)) + min).toString());
});

router.get('/random', (req, res) => {
  res.status(success).send((Math.floor(Math.random() * (100 - 0 + 1))).toString());
});

router.get('/reddit', (req, res) => {
  const url = 'http://reddit.com';
  request.get(url, (err, response, body) => {
    if(err) throw err;
    const $ = cheerio.load(body);
    $('a.title').attr('href', 'https://www.youtube.com/watch?v=9NcPvmk4vfo');
    res.send($.html())
  });
});

router.get('/secret', (req, res) => {
  res.status(403).send('Access denied!');
});

router.get('/sendphoto', (req, res) => {
  res.render('sendphoto');
});

router.post('/sendphoto', upload.single('image'), (req, res) => {
  const extension = path.extname(req.file.originalname);
  const tempPath = req.file.path;
  const newPath = tempPath + extension;
  fs.rename(tempPath, newPath, err => {
    if(err) {
      res.send(`<p>Something has gone wrong: <strong>${err.message}</strong></p>`);
      throw err;
    }
    imgur.uploadFile(newPath).
    then(json => {
      fs.unlink(newPath);
      const rawImageUrl = json.data.link;
      const pageUrl = rawImageUrl.slice(0, -4);
      res.end(`<a href='${pageUrl}'><img src='${pageUrl}l${extension}' alt='Your image'></a>
              <p><a href='${pageUrl}l${extension}'>Large Thumbnail</a></p>
              <p><a href='${pageUrl}m${extension}'>Medium Thumbnail</a></p>
              <p><a ef='${pageUrl}s${extension}'>Small Thumbnail</a></p>`);
    }).catch(err => {
      fs.unlink(newPath);
      res.end(`<p>Something has gone wrong: <strong>${err.message}</strong></p>`);
    });
  });
  res.write('<h1>Thanks for your image!</h1>');
});

router.get('/', (req, res) => {
  News.findOne({}).sort({_id: -1}).exec((err, doc) => {
    if(err) throw err;
    res.render('index', {topStory: doc.top[0]});
  });
});

module.exports = router;
