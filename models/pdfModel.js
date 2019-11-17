var mongoose = require("mongoose"),
  Schema = mongoose.Schema;
var fs = require("fs");

var PdfHistorySchema = new Schema({
  dateAdded: { type: Date, default: Date.now },
  addedBy: { type: Schema.Types.ObjectId, ref: "user" },
  name: String
});
var pdfHistory = mongoose.model("pdfHistory", PdfHistorySchema);

var PageSchema = new Schema({
  _circular: { type: Schema.Types.ObjectId, ref: "circular" },
  pageNr: Number,
  _assets: [{ type: Schema.Types.ObjectId, ref: "asset" }],
  _products: [{ type: Schema.Types.ObjectId, ref: "product" }],
  _pdf: { type: Schema.Types.ObjectId, ref: "pdfHistory" }
});
var page = mongoose.model("page", PageSchema);

var PageProductSchema = new Schema({
  _page: { type: Schema.Types.ObjectId, ref: "page" },
  categorized: Boolean,
  prefix: String,
  ingredient: String,
  deal: String,
  dept: String,
  details: String,
  keywords: [String],
  featured: String,
  x: Number,
  y: Number,
  width: Number,
  height: Number,
  id: Number,
  _thumbnail: { type: Schema.Types.ObjectId, ref: "asset" },
  dateAdded: { type: Date, default: Date.now },
  addedBy: { type: Schema.Types.ObjectId, ref: "user" },
  recipe: {
    recipeName: { type: String },
    recipeDescription: { type: String },
    mediaImg: { type: String },
    ingredients: { type: Array }
  }
});
var product = mongoose.model("product", PageProductSchema);

var AssetsSchema = new Schema({
  _page: { type: Schema.Types.ObjectId, ref: "page" }
});
var asset = mongoose.model("asset", AssetsSchema);

exports.renameSettingsToProducts = function() {
  page.update(
    {},
    { $set: { _products: [] } },
    { multi: true, upsert: false },
    (err, page) => {
      if (err) console.log({ err });
      console.log(page);
    }
  );
};

//page -- start
exports.addPageToCircular = function(circularId, pageData, pdfId) {
  var newItem = new page();
  newItem.set("_circular", circularId);
  newItem.set("pageNr", pageData.pageNr);
  newItem.set("_pdf", pdfId);

  return new Promise((resolve, reject) => {
    newItem.save(function(err, doc) {
      if (err) {
        reject({ err });
      } else {
        let base64String = pageData.url;
        // Remove header
        let base64Image = base64String.split(";base64,").pop();
        let urlPath = "./uploads/pages/" + doc._id + ".png";
        fs.writeFile(urlPath, base64Image, { encoding: "base64" }, function(
          err
        ) {
          if (err) {
            reject({ err });
          }
          resolve(doc);
        });
      }
    });
  });
};
//page -- end

//assets -- start
exports.addAssetToPage = function(pageId, imageData) {
  var newItem = new asset();
  newItem.set("_page", pageId);

  return new Promise((resolve, reject) => {
    newItem.save(function(err, doc) {
      if (err) {
        reject({ err });
      } else {
        let base64String = imageData.url;
        // Remove header
        let base64Image = base64String.split(";base64,").pop();
        let urlPath = "./uploads/assets/" + doc._id + ".png";
        fs.writeFile(urlPath, base64Image, { encoding: "base64" }, function(
          err
        ) {
          if (err) {
            reject({ err });
          }
          resolve(doc);
        });
      }
    });
  });
};

exports.addAssetsToPage = function(pageId, assetsArray) {
  let ids = [];
  assetsArray.map(item => {
    ids.push(item.id);
  });

  return new Promise((resolve, reject) => {
    page.findOneAndUpdate(
      { _id: pageId },
      {
        $push: { _assets: ids }
      },
      { new: true, upsert: false },
      (err, page) => {
        if (err) reject({ err });
        resolve(page);
      }
    );
  });
};

//assets -- end
exports.addToHistory = (pdfName, loggedUserId, file) => {
  var newItem = new pdfHistory();
  newItem.set("addedBy", loggedUserId);
  newItem.set("name", pdfName);

  return new Promise((resolve, reject) => {
    newItem.save(function(err, doc) {
      if (err) {
        reject({ err });
      } else {
        resolve({ doc, file });
      }
    });
  });
};

exports.addProduct = (settingData, loggedUserId) => {
  var newProduct = new product();
  newProduct.set("x", settingData.x);
  newProduct.set("y", settingData.y);
  newProduct.set("width", settingData.width);
  newProduct.set("height", settingData.height);
  newProduct.set("id", settingData.id);
  newProduct.set("_page", settingData.page);
  newProduct.set("categorized", settingData.categorized);
  newProduct.set("prefix", settingData.prefix);
  newProduct.set("ingredient", settingData.ingredient);
  newProduct.set("deal", settingData.deal);
  newProduct.set("dept", settingData.dept);
  newProduct.set("details", settingData.details);
  newProduct.set("_thumbnail", settingData._thumbnail);
  newProduct.set("addedBy", loggedUserId);

  return new Promise((resolve, reject) => {
    newProduct.save(function(err, doc) {
      if (err) {
        reject({ err });
      } else {
        resolve(doc);
      }
    });
  });
};

exports.addProductToPage = (pageId, settingId) => {
  return new Promise((resolve, reject) => {
    page.findOneAndUpdate(
      { _id: pageId },
      {
        $push: { _products: settingId }
      },
      { new: true, upsert: false },
      (err, page) => {
        if (err) reject({ err });
        resolve(page);
      }
    );
  });
};

exports.getPageById = id => {
  return new Promise((resolve, reject) => {
    page
      .findOne({ _id: id })
      .populate("_products")
      .populate("_pdf")
      .exec(function(err, pageInfo) {
        if (err) reject({ err });
        resolve(pageInfo);
      });
  });
};

exports.editProduct = settingData => {
  return new Promise((resolve, reject) => {
    product.findOneAndUpdate(
      { _id: settingData._id },
      settingData,
      { upsert: false },
      (err, doc) => {
        if (err) {
          reject({ err });
        } else {
          resolve(doc);
        }
      }
    );
  });
};

exports.deleteProduct = settingId => {
  return new Promise((resolve, reject) => {
    product.deleteOne({ _id: settingId }).exec(function(err) {
      if (err) {
        reject({ err });
      } else {
        resolve({ msg: "deleted successfully" });
      }
    });
  });
};

exports.deleteProductFromPage = (pageId, settingId) => {
  return new Promise((resolve, reject) => {
    page.findOneAndUpdate(
      { _id: pageId },
      {
        $pull: { _products: settingId }
      },
      { new: true, upsert: false },
      (err, page) => {
        if (err) reject({ err });
        resolve(page);
      }
    );
  });
};

exports.deletePage = pageId => {
  return new Promise((resolve, reject) => {
    page.deleteOne({ _id: pageId }).exec(function(err) {
      if (err) {
        reject({ err });
      } else {
        resolve({ msg: "deleted successfully" });
      }
    });
  });
};

exports.deleteAllProductsFromPage = settingsArray => {
  return new Promise((resolve, reject) => {
    product.deleteMany({ _id: { $in: settingsArray } }).exec(function(err) {
      if (err) {
        reject({ err });
      } else {
        resolve({ msg: "deleted successfully" });
      }
    });
  });
};

exports.deleteAllAssetsFromPage = assetsArray => {
  return new Promise((resolve, reject) => {
    asset.deleteMany({ _id: { $in: assetsArray } }).exec(function(err) {
      if (err) {
        reject({ err });
      } else {
        resolve({ msg: "deleted successfully" });
      }
    });
  });
};

exports.cloneProductsToPage = (pageId, products) => {
  return new Promise((resolve, reject) => {
    page.findOneAndUpdate(
      { _id: pageId },
      {
        $push: { _products: products }
      },
      { new: true, upsert: false },
      (err, page) => {
        if (err) reject({ err });
        resolve(page);
      }
    );
  });
};
