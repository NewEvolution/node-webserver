'use strict'
/* eslint no-magic-numbers:0 */

const express = require('express');
const router = express.Router();

const contact = require('../controllers/contact');

router.get('/', contact.index)
      .post('/', contact.new);

module.exports = router;
