var express = require('express');
var router = express.Router();
var circular = require('../controllers/circularNodeController.js');
var JWT=require('../middleware/jwt');

//Circular Groups
router.post('/group/add',JWT.checkToken,circular.addCircularGroup);
router.post('/group/getAll',JWT.checkToken,circular.getCircularGroups);
router.post('/group/update',JWT.checkToken,circular.updateCircularGroup);
router.post('/group/getById',JWT.checkToken,circular.getCircularGroupById);
router.post('/group/delete',JWT.checkToken,circular.deleteCircularGroup);
router.post('/group/addOrUpdatePagesFromCirculars',JWT.checkToken,circular.addOrUpdatePagesFromCirculars)
router.post('/group/getCurrentCircularPages',circular.getCurrentPagesForGroup)


//Circulars
router.post('/add',JWT.checkToken,circular.addCircular);
router.post('/getAll',JWT.checkToken,circular.getCirculars);
router.post('/update',JWT.checkToken,circular.updateCircular);
router.post('/getById',JWT.checkToken,circular.getCircularById);
router.post('/delete',JWT.checkToken,circular.deleteCircular);
router.post('/getAssignedPages',JWT.checkToken,circular.getAssignedPages);


//pages
router.post('/page/getById',JWT.checkToken,circular.getPageById);
router.post('/page/addProductToPage',JWT.checkToken,circular.addProductToPage);
router.post('/page/cloneProductsToPage',JWT.checkToken,circular.cloneProducts);
router.post('/page/editProduct',JWT.checkToken,circular.editProduct);
router.post('/page/removeProduct',JWT.checkToken,circular.removeProduct)
router.post('/page/remove',JWT.checkToken,circular.removePage)
module.exports = router;