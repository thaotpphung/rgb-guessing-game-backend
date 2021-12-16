const express = require('express');

const router = express.Router();
const gameRouter = require('./games');

router.use('/:userId/games', gameRouter);

module.exports = router;
