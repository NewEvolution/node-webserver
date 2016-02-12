'use strict'
/* eslint no-magic-numbers:0 */

const express = require('express');
const router = express.Router();

const fs = require('fs');
const path = require('path');
const imgur = require('imgur');
const upload = require('multer')({dest: 'tmp/uploads'});

// GET/POST /sendphoto
router.get('/', (req, res) => {
  res.render('sendphoto');
})

.post('/', upload.single('image'), (req, res) => {
  const extension = path.extname(req.file.originalname);
  const tempPath = req.file.path;
  const newPath = tempPath + extension;
  fs.rename(tempPath, newPath, err => {
    if(err) {
      res.send(`<p>Something has gone wrong: <strong>${err.message}</strong></p>`);
      throw err;
    }
    imgur.uploadFile(newPath)
    .then(json => {
      fs.unlink(newPath);
      const rawImageUrl = json.data.link;
      const pageUrl = rawImageUrl.slice(0, -4);
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
});

module.exports = router;
