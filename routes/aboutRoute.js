const express = require('express');
const router = express.Router();
const aboutModel = require('../models/aboutModel.js')

router.get('/', function (req, res) {
  res.render("about",{date: aboutModel.showDate()});
});

module.exports = router;