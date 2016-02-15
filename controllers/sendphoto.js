'use strict'

const fs = require('fs');
const path = require('path');
const imgur = require('imgur');

module.exports.index = (req, res) => {
  res.render('sendphoto')
};

module.exports.new = (req, res) => {
  const extension = path.extname(req.file.originalname);
  const tempPath = req.file.path;
  const newPath = tempPath + extension;
  fs.rename(tempPath, newPath, err => {
    if (err) {
      res.send(`<p>Something has gone wrong: <strong>${err.message}</strong></p>`);
      throw err;
    }
    imgur.uploadFile(newPath)
    .then(json => {
      fs.unlink(newPath);
      const rawImageUrl = json.data.link;
      const pageUrl = rawImageUrl.slice(0, -4); // eslint-disable-line no-magic-numbers
      res.end(`<a href='${pageUrl}'><img src='${pageUrl}l${extension}' alt='Your image'></a>
              <p><a href='${pageUrl}l${extension}'>Large Thumbnail</a></p>
              <p><a href='${pageUrl}m${extension}'>Medium Thumbnail</a></p>
              <p><a ef='${pageUrl}s${extension}'>Small Thumbnail</a></p>`);
    }).catch(err => {
      fs.unlink(newPath);
      res.end(`<p>Something has gone wrong: <strong>${err.message}</strong></p>`);
    });
  });
  res.write('<h1>Thanks for your image!</h1>');
};
