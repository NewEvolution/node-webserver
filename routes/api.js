'use strict'
/* eslint no-magic-numbers:0 */

const express = require('express');
const router = express.Router();

const api = require('../controllers/api');

router.get('/', api.index)
      .post('/', api.new)
      .get('/news', api.news)
      .get('/passthrough', api.passthrough);

module.exports = router;
