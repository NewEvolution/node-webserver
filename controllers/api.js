'use strict'
/* eslint no-magic-numbers:0 */

const _ = require('lodash');
const cheerio = require('cheerio');
const request = require('request');

const News = require('../models/news');
const Allcaps = require('../models/allcaps');

module.exports.index = (req, res) => {
  res.send({this: 'is an API'});
};

module.exports.new = (req, res) => {
  const obj = _.mapValues(req.body, val => val.toUpperCase());
  const caps = new Allcaps(obj);
  caps.save((err, _caps) => {
    if (err) throw err;
    res.send(_caps);
  });
};

module.exports.news = (req, res) => {
  News.findOne({}).sort({_id: -1}).exec((err, doc) => {
    if (doc) {
      const FIFTEEN_MINS = 15 * 60 * 1000;
      const diff = new Date() - doc._id.getTimestamp() - FIFTEEN_MINS;
      const newsIsFresh = diff < 0;
      if (newsIsFresh) {
        res.send(doc)
        return;
      }
    }
    const url = 'http://cnn.com';
    request.get(url, (err, response, body) => {
      if (err) throw err;
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
        if (theUrl.indexOf('http') !== 0) {
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
};

module.exports.passthrough = (req, res) => {
  const url = 'https://randomapi.com/api/?key=2IS9-4BF5-3W5L-7Z67&id=irta6tm';
  request.get(url, (err, response, body) => {
    if (err) throw err;
    res.send(JSON.parse(body));
  });
};
