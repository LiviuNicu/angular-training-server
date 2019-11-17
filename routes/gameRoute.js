var express = require("express");
var router = express.Router();
var store = require("../controllers/gameNodeController");
var JWT = require("../middleware/jwt");

router.post("/add", JWT.checkToken, store.addToHistory);
router.post("/getHistory", JWT.checkToken, store.getGameHistory);

module.exports = router;
