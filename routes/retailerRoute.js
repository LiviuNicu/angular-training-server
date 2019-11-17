var express = require('express');
var router = express.Router();
var retailer = require('../controllers/retailerNodeController.js');
var JWT=require('../middleware/jwt');

router.post('/add',JWT.checkToken,retailer.addRetailer);
router.post('/getAll',JWT.checkToken,retailer.getAllRetailers);
router.post('/update',JWT.checkToken,retailer.updateRetailer);
router.post('/getById',JWT.checkToken,retailer.getRetailerById);
router.post('/delete',JWT.checkToken,retailer.removeRetailer);



module.exports = router;