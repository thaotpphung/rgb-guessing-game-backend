const express = require('express');

const router = express.Router({ mergeParams: true });
const gameController = require('../controllers/games.js');
const middlewares = require('../middlewares/auth');

router.get('', gameController.getAllgames);
router.get('/:id', gameController.getgame);
router.post('/', middlewares.auth, gameController.creategame);

module.exports = router;
