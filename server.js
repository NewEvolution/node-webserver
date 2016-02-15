'use strict';
/* eslint no-magic-numbers: 0, no-console: 0 */

const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const favicon = require('serve-favicon'); // eslint-disable-line no-unused-vars
const bodyParser = require('body-parser');
const routes = require('./routes/')
const PORT = process.env.PORT || 3000;
const app = express();

const MONGODB_AUTH = process.env.MONGODB_AUTH || '';
const MONGODB_HOST = process.env.MONGODB_HOST || 'localhost';
const MONGODB_PORT = process.env.MONGODB_PORT || 27017;

const MONGODB_URL = `mongodb://${MONGODB_AUTH}${MONGODB_HOST}:${MONGODB_PORT}/node-webserver`;

app.use(routes);

app.set('view engine', 'jade');

app.locals.title = 'A Calendar in Node.js';
app.locals.date = new Date();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true,
  sourceMap: true
}));

app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(MONGODB_URL);

mongoose.connection.on('open', (err) => {
  if (err) throw err;

  app.listen(PORT, () => {
    console.log(`Node.js server started. listening on port ${PORT}`);
  });
});

module.exports = app;
