const Score = require('../models/scores.js');
const factory = require('./index');

exports.getScores = factory.getAll(Score);

module.exports = router;
