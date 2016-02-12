'use strict'
/* eslint no-magic-numbers:0 */

const express = require('express');
const utility = require('node-cal/lib/utility');
const router = express.Router();
const success = 200;


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

module.exports = router;
