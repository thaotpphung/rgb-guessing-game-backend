
const express = require("express");
const router = express.Router();
const Game = require("../../models/Game");

router.get("/highscores", async (req, res) => {
  let games = await Game.find();
  games.sort(function(a, b) {
    return b.score - a.score;
  });
  const modifiedGames = games.filter(game => game.isWinner);
  // console.log('high', modifiedGames);
  res.status(200).json({
    highscores: modifiedGames.slice(0, 3)
  })
});

module.exports = router;
