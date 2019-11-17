var playerModel = require("./../models/playerModel");
var gameModel = require("./../models/gameModel");

exports.addToHistory = (req, res) => {
  let arr = [];
  req.body.map(item => {
    arr.push(playerModel.addPlayer(item));
    return item;
  });

  Promise.all(arr)
    .then(response => {
      gameModel
        .addToHistory(
          response.map(item => {
            return item._id;
          }),
          req.userData
        )
        .then(response => {
          res.status(200).json({ msg: "success" });
        })
        .catch(error => {
          res.status(500).json(error);
        });
    })
    .catch(error => {
      res.status(500).json(error);
    });
};

exports.getGameHistory = (req, res) => {
  gameModel
    .getHistory()
    .then(response => {
      res.status(200).json(response);
    })
    .catch(error => {
      res.status(500).json(error);
    });
};
