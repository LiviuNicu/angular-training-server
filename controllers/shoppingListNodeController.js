var shoppingListModel = require('./../models/shoppingListModel');

exports.addItemToShoppingList = (req, res) => {
  shoppingListModel.addShoppingListItem(req.body, req.userData._id)
    .then((response)=>{
      res.status(200).json(response)
    })
    .catch((error)=>{
      res.status(500).json(error);
    })
};


exports.addMultipleItemsToShoppingList = (req, res) => {
  var itemsArr = [];

  req.body.map((item) => {
    itemsArr.push(shoppingListModel.addShoppingListItem(item, req.userData._id))
  });

  Promise.all(itemsArr)
    .then((response)=>{
      res.status(200).json(response)
    })
    .catch((error)=>{
      res.status(500).json(error);
    })
};

exports.removeShoppingListItem = (req, res) => {
  shoppingListModel.removeShoppingListItem(req.body, req.userData._id)
    .then((response)=>{
      res.status(200).json(response)
    })
    .catch((error)=>{
      res.status(500).json(error);
    })
};

exports.removeAllShoppingListItems = (req, res) => {
  shoppingListModel.removeAllShoppingListItems(req.userData._id)
    .then((response) => {
      res.status(200).json(response)
    })
    .catch((error) => {
      res.status(500).json(error);
    })
};

exports.getAllShoppingListItems = (req, res) => {
  shoppingListModel.getAllShoppingListItems(req.userData._id)
    .then((response) => {
      res.status(200).json(response)
    })
    .catch((error) => {
      res.status(500).json(error);
    })
};

exports.editShoppingListItem = (req, res) => {
  shoppingListModel.editShoppingListItem(req.body, req.userData._id)
    .then((response) => {
      res.status(200).json(response)
    })
    .catch((error) => {
      res.status(500).json(error);
    })
};
