'use strict'

const express = require('express');
const router = express.Router();

const misc = require('../controllers/misc');

router.get('/hello', misc.hello)
      .get('/reddit', misc.reddit)
      .get('/secret', misc.secret)
      .get('/', misc.index);

module.exports = router;
