var mongoose = require("mongoose"),
  Schema = mongoose.Schema;

var CircularSchema = new Schema({
  name: { type: String, required: true },
  dateAdded: { type: Date, default: Date.now },
  addedBy: { type: Schema.Types.ObjectId, ref: "user" },
  activeDateAndTime: { type: Date, required: true },
  terminationDate: Date,
  title: String,
  _retailer: { type: Schema.Types.ObjectId, ref: "retailer" },
  _groups: [{ type: Schema.Types.ObjectId, ref: "circularGroup" }],
  _pages: [{ type: Schema.Types.ObjectId, ref: "page" }]
});
var circular = mongoose.model("circular", CircularSchema);

var CircularGroupSchema = new Schema({
  _retailer: { type: Schema.Types.ObjectId, ref: "retailer" },
  name: { type: String, required: true },
  name2: { type: String },
  dateAdded: { type: Date, default: Date.now },
  addedBy: { type: Schema.Types.ObjectId, ref: "user" }
});
var circularGroup = mongoose.model("circularGroup", CircularGroupSchema);

var CircularPageNumbersForGroups = new Schema({
  _circular: { type: Schema.Types.ObjectId, ref: "circular" },
  _group: { type: Schema.Types.ObjectId, ref: "circularGroup" },
  pages: [
    {
      order: Number,
      _page: { type: Schema.Types.ObjectId, ref: "page" }
    }
  ],
  dateAdded: { type: Date, default: Date.now }
});
var circularPagesForGroups = mongoose.model(
  "circularPagesForGroups",
  CircularPageNumbersForGroups
);

//Circular groups -- start
exports.addCircularGroup = function(circularGroupReq, loggedUser) {
  var newcircularGroup = new circularGroup();
  newcircularGroup.set("_retailer", circularGroupReq.retailer);
  newcircularGroup.set("name", circularGroupReq.name);
  newcircularGroup.set("name2", circularGroupReq.name2);
  newcircularGroup.set("addedBy", loggedUser);

  return new Promise((resolve, reject) => {
    newcircularGroup.save(function(err) {
      if (err) {
        reject({ err });
      } else {
        resolve({ success: "Circular Group Inserted Successfuly!" });
      }
    });
  });
};

exports.getAllCircularGroups = function() {
  return new Promise((resolve, reject) => {
    circularGroup
      .find()
      .populate("addedBy")
      .populate("_retailer")
      .exec(function(err, circulars) {
        if (err) {
          reject({ err });
        } else {
          resolve(circulars);
        }
      });
  });
};

exports.getAllCIrcularGroupsByRetailer = function(retailers) {
  return new Promise((resolve, reject) => {
    circularGroup
      .find({ _retailer: { $in: retailers } })
      .populate("addedBy")
      .populate("_retailer")
      .exec(function(err, circulars) {
        if (err) {
          reject({ err });
        } else {
          resolve(circulars);
        }
      });
  });
};

exports.getCircularGroupById = function(id) {
  return new Promise((resolve, reject) => {
    circularGroup.findOne({ _id: id }).exec(function(err, circular) {
      if (err) {
        reject({ err });
      } else {
        resolve(circular);
      }
    });
  });
};

exports.updateCircularGroup = function(circularGroupReq) {
  return new Promise((resolve, reject) => {
    circularGroup.findOneAndUpdate(
      { _id: circularGroupReq._id },
      circularGroupReq,
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

exports.removeCircularGroup = function(id) {
  return new Promise((resolve, reject) => {
    circularGroup.deleteOne({ _id: id }).exec(function(err) {
      if (err) {
        reject({ err });
      } else {
        resolve({ msg: "deleted successfully" });
      }
    });
  });
};
//Circular groups -- end

//Circulars -- start
exports.addCircular = function(circularReq, loggedUser) {
  var newCircular = new circular();
  newCircular.set("name", circularReq.name);
  newCircular.set("addedBy", loggedUser._id);
  newCircular.set("terminationDate", circularReq.terminationDate);
  newCircular.set("title", circularReq.title);
  newCircular.set("activeDateAndTime", circularReq.activeDateAndTime);
  newCircular.set("_retailer", circularReq._retailer);

  return new Promise((resolve, reject) => {
    newCircular.save(function(err, doc) {
      if (err) {
        reject({ err });
      } else {
        resolve(doc);
      }
    });
  });
};

exports.getAllCirculars = function() {
  return new Promise((resolve, reject) => {
    circular
      .find()
      .sort("-dateAdded")
      .populate("_retailer")
      .exec(function(err, circulars) {
        if (err) {
          reject({ err });
        } else {
          resolve(circulars);
        }
      });
  });
};

exports.getAllCircularByRetailer = function(retailers) {
  return new Promise((resolve, reject) => {
    circular
      .find({ _retailer: { $in: retailers } })
      .sort("-dateAdded")
      .populate("_retailer")
      .exec(function(err, circulars) {
        if (err) {
          reject({ err });
        } else {
          resolve(circulars);
        }
      });
  });
};

exports.getCircularById = function(id) {
  return new Promise((resolve, reject) => {
    circular
      .findOne({ _id: id })
      .populate({ path: "_pages", populate: { path: "_products" } })
      .populate({ path: "_pages", populate: { path: "_pdf" } })
      .exec(function(err, circular) {
        if (err) {
          reject({ err });
        } else {
          resolve(circular);
        }
      });
  });
};

exports.updateCircular = function(circularReq) {
  return new Promise((resolve, reject) => {
    circular.findOneAndUpdate(
      { _id: circularReq._id },
      circularReq,
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

exports.removeCircular = function(id) {
  return new Promise((resolve, reject) => {
    circular.deleteOne({ _id: id }).exec(function(err) {
      if (err) {
        reject({ err });
      } else {
        resolve({ msg: "deleted successfully" });
      }
    });
  });
};

exports.addPagesToCircular = function(id, pages) {
  let ids = [];
  pages.map(item => {
    ids.push(item.id);
  });

  return new Promise((resolve, reject) => {
    circular.findOneAndUpdate(
      { _id: id },
      {
        $push: { _pages: ids }
      },
      { new: true, upsert: false },
      (err, page) => {
        if (err) reject({ err });
        resolve(page);
      }
    );
  });
};

exports.addPageToCircular = function(circularId, pageId) {
  return new Promise((resolve, reject) => {
    circular.findOneAndUpdate(
      { _id: circularId },
      {
        $push: { _pages: pageId }
      },
      { new: true, upsert: false },
      (err, page) => {
        if (err) reject({ err });
        resolve(page);
      }
    );
  });
};

exports.addOrUpdatePagesFromCirculars = function(circularId, groupId, pages) {
  return new Promise((resolve, reject) => {
    circularPagesForGroups.findOneAndUpdate(
      { _group: groupId, _circular: circularId },
      {
        $set: { pages: pages }
      },
      { new: true, upsert: true },
      (err, page) => {
        if (err) reject({ err });
        resolve(page);
      }
    );
  });
};

exports.getAssignedPages = function(circularId) {
  return new Promise((resolve, reject) => {
    circularPagesForGroups
      .find({ _circular: circularId })
      .exec(function(err, circulars) {
        if (err) {
          reject({ err });
        } else {
          resolve(circulars);
        }
      });
  });
};

exports.deletePageFromCircular = (circulaId, pageId) => {
  return new Promise((resolve, reject) => {
    circular.findOneAndUpdate(
      { _id: circulaId },
      {
        $pull: { _pages: pageId }
      },
      { new: true, upsert: false },
      (err, page) => {
        if (err) reject({ err });
        resolve(page);
      }
    );
  });
};

exports.deleteAllAssignedByPage = pageId => {
  return new Promise((resolve, reject) => {
    circularPagesForGroups.updateMany(
      { pages: { $elemMatch: { _page: pageId } } },
      {
        $pull: { pages: { _page: pageId } }
      },
      { upsert: false },
      (err, doc) => {
        if (err) reject({ err });
        resolve(doc);
      }
    );
  });
};

exports.getCurrentPagesForGroup = groupId => {
  return new Promise((resolve, reject) => {
    circularPagesForGroups
      .findOne({ _group: groupId })
      .sort({ $natural: -1 })
      .populate({ path: "pages._page", populate: { path: "_products" } })
      .populate("_circular")
      .exec(function(err, doc) {
        if (err) {
          reject({ err });
        } else {
          resolve(doc);
        }
      });
  });
};

exports.getCurrentPageNumbersForGroup = groupId => {
  return new Promise((resolve, reject) => {
    circularPagesForGroups
      .findOne({ _group: groupId })
      .sort({ $natural: -1 })
      .exec(function(err, doc) {
        if (err) {
          reject({ err });
        } else {
          resolve(doc);
        }
      });
  });
};
