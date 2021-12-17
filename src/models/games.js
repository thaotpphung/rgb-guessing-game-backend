const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GameSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  score: {
    type: Number,
  },
  level: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  result: {
    type: String,
  },
});

module.exports = Game = mongoose.model('Game', GameSchema);
