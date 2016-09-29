'use strict'
/* eslint no-magic-numbers:0 */

function randomInt (min, max) {
  return (Math.floor(Math.random() * (max - min + 1)) + min).toString()
}

function randomColor () {
  const hexchars = '0123456789abcdef';
  const color = ['#'];
  while (color.length < 7) {
    color[color.length] = hexchars[randomInt(0, 15)];
  }
  return color.join('');
}

module.exports.index = (req, res) => {
  res.render('number', {number: randomInt(0, 100)});
};

module.exports.new = (req, res) => {
  const min = parseInt(req.params.min);
  const max = parseInt(req.params.max);
  res.render('number', {number: randomInt(min, max)});
};

module.exports.color = (req, res) => {
  res.render('color', {color: randomColor()});
}
