'use strict'
/* eslint no-magic-numbers:0 */

const express = require('express');
const router = express.Router();
const success = 200;

function randomInt (max, min) {
  return (Math.floor(Math.random() * (max - min + 1)) + min).toString()
}

router.get('/random/:min/:max', (req, res) => {
  const min = parseInt(req.params.min);
  const max = parseInt(req.params.max);
  res.status(success).send(randomInt(max, min));
});

router.get('/random', (req, res) => {
  res.status(success).send(randomInt(100, 0));
});

module.exports = router;
