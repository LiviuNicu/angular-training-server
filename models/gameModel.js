var mongoose = require("mongoose"),
  Schema = mongoose.Schema;

var GameHistory = new Schema({
  players: [{ type: Schema.Types.ObjectId, ref: "player" }],
  addedBy: { type: Schema.Types.ObjectId, ref: "user" },
  dateAdded: { type: Date, default: Date.now }
});
var history = mongoose.model("history", GameHistory);

exports.addToHistory = function(data, loggedUser) {
  var newHistory = new history();
  newHistory.set("addedBy", loggedUser);
  newHistory.set("players", data);

  return new Promise((resolve, reject) => {
    newHistory.save(function(err) {
      if (err) {
        reject({ err });
      } else {
        resolve({ success: "Score added to history" });
      }
    });
  });
};

exports.getHistory = function() {
  return new Promise((resolve, reject) => {
    history
      .find()
      .populate("addedBy")
      .populate("players")
      .exec(function(err, doc) {
        if (err) {
          reject({ err });
        } else {
          resolve(doc);
        }
      });
  });
};
