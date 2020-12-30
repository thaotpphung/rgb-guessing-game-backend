const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const GameSchema = new Schema({
  username: {
    type: String,
  },
  score: {
    type: Number,
  },
  level: {
    type: String,
  },
  date: {
    type: Date,
  },
  isWinner: Boolean
});

module.exports = Game = mongoose.model("games", GameSchema);