var express = require('express');
var router = express.Router();
var store = require('../controllers/storeNodeController.js');
var JWT=require('../middleware/jwt');

router.post('/add',JWT.checkToken,store.addStore);
router.post('/getAll',JWT.checkToken,store.getAllStores);
router.post('/update',JWT.checkToken,store.updateStore);
router.post('/getById',store.getStoreById);
router.post('/delete',JWT.checkToken,store.removeStore);
router.post('/getStoresByRetailer',store.getStoresByRetailer);

module.exports = router;
