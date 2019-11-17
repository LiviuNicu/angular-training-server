var express = require("express");
var router = express.Router();
var user = require("../controllers/userNodeController.js");
var JWT = require("../middleware/jwt");
var cors = require("cors");
/* GET users listing. */
router.get("/", function(req, res, next) {
  res.send("respond with a resource");
});

router.post("/register", user.register);
router.post("/login", user.login);
router.post("/getLoggedUser", JWT.checkToken, user.getLoggedUser);

router.post("/delete", JWT.checkToken, user.deleteUser);
router.post("/update", JWT.checkToken, user.updateUser);
router.post("/getById", JWT.checkToken, user.getById);
router.post("/all", JWT.checkToken, user.getAllUsers);
router.post("/addCustomer", JWT.checkToken, user.addCustomer);
router.post("/exportUsers", JWT.checkToken, user.exportUsers);

//router.post("/admin", user.makeAdmin);

module.exports = router;
