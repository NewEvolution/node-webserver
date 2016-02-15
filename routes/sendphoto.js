'use strict'

const express = require('express');
const router = express.Router();
const upload = require('multer')({dest: 'tmp/uploads'});

const sendphoto = require('../controllers/sendphoto');

router.get('/', sendphoto.index)
      .post('/', upload.single('image'), sendphoto.new);

module.exports = router;
