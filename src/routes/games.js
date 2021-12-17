const express = require('express');

const router = express.Router({ mergeParams: true });
const gameController = require('../controllers/games.js');
const middlewares = require('../middlewares/auth');

router.get('', gameController.getGames);
router.post('/', middlewares.auth, gameController.createGame);

module.exports = router;
