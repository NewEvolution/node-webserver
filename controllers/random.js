'use strict'
/* eslint no-magic-numbers:0 */

const success = 200;

function randomInt (max, min) {
  return (Math.floor(Math.random() * (max - min + 1)) + min).toString()
}

module.exports.index = (req, res) => {
  res.status(success).send(randomInt(100, 0));
};

module.exports.new = (req, res) => {
  const min = parseInt(req.params.min);
  const max = parseInt(req.params.max);
  res.status(success).send(randomInt(max, min));
};
