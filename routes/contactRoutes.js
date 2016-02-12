'use strict'
/* eslint no-magic-numbers:0 */

const express = require('express');
const router = express.Router();

const Contact = require('../models/contact');

// GET/POST /contact
router.get('/', (req, res) => {
  res.render('contact');
})
.post('/', (req, res) => {
  const obj = new Contact({
    name: req.body.name,
    email: req.body.email,
    message: req.body.message
  });

  obj.save((err, newObj) => {
    if(err) throw err;
    res.send(`<h1>Thanks for contacting us ${newObj.name}!</h1>`);
  });
});

module.exports = router;
