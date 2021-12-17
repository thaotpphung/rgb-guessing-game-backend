const Game = require('../models/games.js');
const Score = require('../models/scores.js');
const User = require('../models/users.js');
const catchAsync = require('../utils/catchAsync');
const factory = require('./index');
const io = require('../utils/socket');
const MAX_SCORE_COUNT = 3;

exports.getGames = factory.getAll(Game);

const createScore = async (score, user) => {
  const { _id, value } = await Score.create({ value: score, user });
  const currentUser = await User.findById(user).select('name');
  return { _id, value, user: currentUser };
};

exports.createGame = catchAsync(async (req, res) => {
  const { score, user, result } = req.body;
  const newGame = await Game.create({ ...req.body });

  Score.find({})
    .populate({
      path: 'user',
      model: 'User',
      select: ['name'],
    })
    .sort('score')
    .exec(async (error, scores) => {
      // if less than max count, save the score and emit
      if (scores.length < MAX_SCORE_COUNT) {
        const newScore = await createScore(score, user);
        scores.push(newScore);
        io.getIO().emit('scores', { scores });
        return;
      }
      // check if this is a new high score
      if (score > scores[0].value) {
        const newScore = await createScore(score, user);
        // replace the smallest score
        await Score.findByIdAndDelete(scores[0]._id);
        // send to client
        scores[0] = newScore;
        io.getIO().emit('scores', { scores });
      }
    });

  res.status(201).json({
    status: 'success',
    data: newGame,
    message: null,
  });
});
