var mongoose = require("mongoose"),
  Schema = mongoose.Schema;

var PlayerModel = new Schema({
  name: String,
  score: Number,
  winner: Boolean,
  isServing: Boolean
});
var player = mongoose.model("player", PlayerModel);

exports.addPlayer = function(data) {
  var newPlayer = new player();
  newPlayer.set("name", data.name);
  newPlayer.set("score", data.score);
  newPlayer.set("winner", data.winner);
  newPlayer.set("isServing", data.isServing);

  return new Promise((resolve, reject) => {
    newPlayer.save(function(err, doc) {
      if (err) {
        reject({ err });
      } else {
        resolve(doc);
      }
    });
  });
};

exports.getAllPlayers = function(playerNameQuery) {
  return new Promise((resolve, reject) => {
    player
      .find({ name: { $regex: playerNameQuery, $options: "i" } })
      .exec(function(err, doc) {
        if (err) {
          reject({ err });
        } else {
          resolve(doc);
        }
      });
  });
};
