'use strict'

const express = require('express');
const router = express.Router();

const apiRoutes = require('./apiRoutes');
const calRoutes = require('./calRoutes');
const contactRoutes = require('./contactRoutes');
const miscRoutes = require('./miscRoutes');
const randomRoutes = require('./randomRoutes');
const sendphotoRoutes = require('./sendphotoRoutes');

router.use('/api', apiRoutes);
router.use('/cal', calRoutes);
router.use('/contact', contactRoutes);
router.use('/random', randomRoutes);
router.use('/sendphoto', sendphotoRoutes);
router.use(miscRoutes);

module.exports = router;
