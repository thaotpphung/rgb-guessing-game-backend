const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const users = require("./routes/api/users");
const games = require("./routes/api/games");
const index = require("./routes/api/index");
const app = express();

require("dotenv").config();
// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

app.use(bodyParser.json());

// DB Config
const dbURL = require("./config/keys").mongoURI;

// connect to mongoose
mongoose.connect(dbURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
}).then(() => {
  console.log("Connected to DB!")
}).catch(err => {
  console.log(err.message);
});

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET , POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Passport middleware
app.use(passport.initialize());
// Passport config
require("./config/passport")(passport);
// Routes
app.use("/api/games", games);
app.use("/api/users", users);
app.use("/api", index);

const port = process.env.PORT || 5000; // process.env.port is Heroku's port if you choose to deploy the app there

const server = app.listen(port);
const io = require('./config/socket').init(server);

io.on('connection', socket => {
    console.log("Client connected!");
})
console.log("Connected to DB!");