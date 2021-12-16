const express = require('express');

const router = express.Router({ mergeParams: true });
const scoreController = require('../controllers/scores.js');

router.get('/', scoreController.getAllscores);

module.exports = router;
