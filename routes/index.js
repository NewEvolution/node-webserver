'use strict'

const express = require('express');
const router = express.Router();

const apiRoutes = require('./api');
const calRoutes = require('./cal');
const contactRoutes = require('./contact');
const miscRoutes = require('./misc');
const randomRoutes = require('./random');
const sendphotoRoutes = require('./sendphoto');

router.use('/api', apiRoutes);
router.use('/cal', calRoutes);
router.use('/contact', contactRoutes);
router.use('/random', randomRoutes);
router.use('/sendphoto', sendphotoRoutes);
router.use(miscRoutes);

module.exports = router;
