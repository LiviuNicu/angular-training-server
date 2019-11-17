var express = require('express');
var router = express.Router();
var category = require('../controllers/categoriesNodeController.js');
var JWT=require('../middleware/jwt');

router.post('/add',JWT.checkToken,category.addCategory);
router.post('/getAll',JWT.checkToken,category.getAllCategories);
router.post('/update',JWT.checkToken,category.updateCategory);
router.post('/delete',JWT.checkToken,category.deleteCategory);
module.exports = router;