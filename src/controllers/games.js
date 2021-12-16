const Game = require('../models/games.js');
const Score = require('../models/scores.js');
const catchAsync = require('../utils/catchAsync');
const factory = require('./index');
const io = require('../utils/socket');

const MAX_SCORE_COUNT = 3;

exports.getGames = factory.getAll(Game);

exports.createGame = catchAsync(async (req, res) => {
  const { score, user, isWin } = req.body;
  const newGame = await Game.create({ ...req.body });

  if (isWin) {
    Score.find({})
      .sort('score')
      .all(async (scores) => {
        // save score
        const savedScore = await Score.create({ score, user });
        if (scores.length > MAX_SCORE_COUNT) {
          // replace the smallest score
          if (score > scores[0]) {
            await Score.findByIdAndDelete(scores[0]._id);
            scores[0] = savedScore;
            io.getIO().emit('scores', { scores });
          }
        }
      });
  }

  res.status(201).json({
    status: 'success',
    data: newGame,
    message: null,
  });
});
