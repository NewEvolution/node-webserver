'use strict'
/* eslint no-magic-numbers:0 */

const express = require('express');
const utility = require('node-cal/lib/utility');
const router = express.Router();
const success = 200;


function printCal (res, calArr) {
  res.write('<pre><h2>');
  calArr.forEach(line => {
    res.write(`${line}\n`);
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
  const month = req.params.month - 1;
  const year = req.params.year;
  const monthArr = utility.buildMonth(month, year);
  printCal(res, monthArr);
});

router.get('/cal/:year', (req, res) => {
  successHeader(res, 'text/html');
  const year = req.params.year;
  const yearArr = utility.buildYear(year);
  printCal(res, yearArr);
});

router.get('/cal', (req, res) => {
  const date = new Date();
  const month = date.getMonth();
  const year = date.getFullYear();
  const monthArr = utility.buildMonth(month, year);
  printCal(res, monthArr);
});

module.exports = router;
