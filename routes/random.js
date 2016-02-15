'use strict'

const express = require('express');
const router = express.Router();

const random = require('../controllers/random');

router.get('/:min/:max', random.new)
      .get('/', random.index);

module.exports = router;
