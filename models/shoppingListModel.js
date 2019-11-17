var mongoose = require("mongoose"),
  Schema = mongoose.Schema;

var ShoppingListItemSchema = new Schema({
  ingredients: {
    type: String
  },
  quantity: {
    type: Number,
    required: true
  },
  deal: {
    type: String,
    required: false
  },
  dept: {
    type: String,
    required: false
  },
  isFavorite: {
    type: Boolean,
    required: true,
    default: false
  },
  note: {
    type: String,
    required: false,
    default: ""
  },
  id: {
    type: Schema.Types.ObjectId,
    ref: "product",
    required: false
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true
  }
});

var shoppingListItem = mongoose.model(
  "shoppingListItem",
  ShoppingListItemSchema
);

exports.addShoppingListItem = function(shoppingListItemObj, loggedUserId) {
  var newShoppingListItem = new shoppingListItem();

  newShoppingListItem.set("ingredients", shoppingListItemObj.ingredients);
  newShoppingListItem.set("quantity", shoppingListItemObj.quantity);
  newShoppingListItem.set("deal", shoppingListItemObj.deal);
  newShoppingListItem.set("dept", shoppingListItemObj.dept);
  newShoppingListItem.set("id", shoppingListItemObj.id);
  newShoppingListItem.set("userId", loggedUserId);

  return new Promise((resolve, reject) => {
    newShoppingListItem.save(function(err, item) {
      if (err) {
        reject({ err });
      } else {
        resolve(item);
      }
    });
  });
};

exports.removeShoppingListItem = function(shoppingListItemObj, loggedUserId) {
  return new Promise((resolve, reject) => {
    shoppingListItem.findOneAndRemove(
      { _id: shoppingListItemObj.id, userId: loggedUserId },
      function(err, item) {
        if (err) {
          reject({ err });
        } else {
          resolve(item);
        }
      }
    );
  });
};

exports.removeAllShoppingListItems = function(loggedUserId) {
  return new Promise((resolve, reject) => {
    shoppingListItem.deleteMany({ userId: loggedUserId }, function(err, items) {
      if (err) {
        reject({ err });
      } else {
        resolve(items);
      }
    });
  });
};

exports.getAllShoppingListItems = function(loggedUserId) {
  return new Promise((resolve, reject) => {
    shoppingListItem.find({ userId: loggedUserId }, function(err, items) {
      if (err) {
        reject({ err });
      } else {
        resolve(items);
      }
    });
  });
};

exports.editShoppingListItem = function(shoppingListItemObj, loggedUserId) {
  return new Promise((resolve, reject) => {
    shoppingListItem.findOneAndUpdate(
      {
        id: shoppingListItemObj.id,
        userId: loggedUserId
      },
      {
        quantity: shoppingListItemObj.quantity,
        isFavorite: shoppingListItemObj.isFavorite,
        note: shoppingListItemObj.note
      },
      function(err, item) {
        if (err) {
          reject({ err });
        } else {
          resolve(item);
        }
      }
    );
  });
};
