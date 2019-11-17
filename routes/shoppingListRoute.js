var express = require('express');
var router = express.Router();
var shoppingList = require('../controllers/shoppingListNodeController');
var JWT=require('../middleware/jwt');

router.post('/add', JWT.checkToken, shoppingList.addItemToShoppingList);
router.post('/addMultiple', JWT.checkToken, shoppingList.addMultipleItemsToShoppingList);
router.post('/getAll', JWT.checkToken, shoppingList.getAllShoppingListItems);
router.post('/edit', JWT.checkToken, shoppingList.editShoppingListItem);
router.post('/remove', JWT.checkToken, shoppingList.removeShoppingListItem);
router.post('/removeAll', JWT.checkToken, shoppingList.removeAllShoppingListItems);

module.exports = router;
