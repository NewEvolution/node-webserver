'use strict'

const express = require('express');
const router = express.Router();

const cal = require('../controllers/cal');

router.get('/:month/:year', cal.month)
      .get('/:year', cal.year)
      .get('/', cal.index);

module.exports = router;
