const Game = require('../models/games.js');
const Score = require('../models/scores.js');
const catchAsync = require('../utils/catchAsync');
const factory = require('./index');
const io = require('../utils/socket');

exports.getAllGames = factory.getAll(Game);

exports.createGame = catchAsync(async (req, res) => {
  const { score, user, isWin } = req.body;
  const newGame = await Game.create({ ...req.body });

  if (isWin) {
    Score.find({})
      .sort('score')
      .all((scores) => {
        if (score > scores[0]) {
          await Score.findByIdAndDelete(scores[0]._id);
          await Score.create({ score, user });
          scores[0] = newGame.score;
          io.getIO().emit('scores', { scores });
        }
      });
  }

  res.status(201).json({
    status: 'success',
    data: newGame,
    message: null,
  });
});

module.exports = router;
