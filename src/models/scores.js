const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ScoreSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  value: {
    type: Number,
  },
});

const Score = mongoose.model('Score', ScoreSchema);

module.exports = Score;
