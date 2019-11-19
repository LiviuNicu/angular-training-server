var express = require("express");
var router = express.Router();
var store = require("../controllers/gameNodeController");
var JWT = require("../middleware/jwt");

router.post("/add", JWT.checkToken, store.addToHistory);
router.get("/getHistory", JWT.checkToken, store.getGameHistory);
router.post("/players/search", JWT.checkToken, store.searchPlayers);

module.exports = router;
