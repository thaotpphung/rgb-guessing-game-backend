const express = require("express");
const router = express.Router();
const Game = require("../../models/Game");
const io = require("../../config/socket");
// @route POST api/games/
// @desc add game record
// @access Public
router.post("/", (req, res) => {
  const game = new Game({
    username: req.body.username,
    score: req.body.score,
    level: req.body.level,
    date: req.body.date,
    isWinner: req.body.isWinner
  });
  // Hash password before saving in database
  game.save()
    .then( async (result) => {
      if (game.isWinner) {
        let games = await Game.find();
        games.sort(function(a, b) {
          return b.score - a.score;
        });
        const modifiedGames = games.filter(game => game.isWinner);
        console.log('GAME HERE');
        io.getIO().emit('games', { highscores: modifiedGames.slice(0, 3)});
        // emit send to all users
        // broadcast send to all except for this user
      }
      res.status(201).json({
        message: "Game created successfully",
        game: result,
      })
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "Something went wrong, please try again",
    });
  });
});

// @route GETT api/games/:id
// @desc get game record
// @access Public
router.get("/:username", (req, res) => {
  Game.find({ username: req.params.username }).then((result) => {
    res
      .status(200)
      .json({
        game: result,
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

module.exports = router;
