var userModel = require("../models/userModel");
var storeModel = require("../models/storeModel");
var retailerModel = require("../models/retailerModel");
const { parse } = require("json2csv");

const fields = ["email", "firstName", "lastName", "phone", "dateAdded"];
const opts = { fields };

exports.login = function(req, res) {
  userModel
    .login(req.body)
    .then(response => {
      res.status(200).json(response);
    })
    .catch(error => {
      res.status(500).json({ error: "error has occurred" });
    });
};

exports.register = function(req, res) {
  let reqBody = req.body;
  // let link = reqBody.link;
  // let storeId = link.split("/");
  // storeId = storeId[storeId.length - 1];
  // console.log("storeId", storeId);
  // storeModel.getStoreById(storeId).then(store => {
  //   req.body.retailer = [];
  //   req.body.retailer[0] = store._retailer;
  //   userModel
  //     .register(req.body)
  //     .then(response => {
  //       res.status(200).json(response);
  //     })
  //     .catch(err => {
  //       res.status(500).json(err);
  //     });
  // });

  let slug = reqBody.slug;
  retailerModel.getRetailerBySlug(slug).then(retailer => {
    req.body.retailer = [];
    req.body.retailer[0] = retailer._id;
    userModel
      .register(req.body)
      .then(response => {
        res.status(200).json(response);
      })
      .catch(err => {
        res.status(500).json(err);
      });
  });
};

exports.getAllUsers = function(req, res) {
  if (req.userData.admin) {
    userModel
      .getAllUsers()
      .then(response => {
        res.status(200).json(response);
      })
      .catch(err => {
        res.status(500).json(err);
      });
  } else {
    userModel
      .getAllUsersByRetailers(req.userData._retailers)
      .then(response => {
        res.status(200).json(response);
      })
      .catch(error => {
        res.status(500).json(error);
      });
  }
};

exports.exportUsers = function(req, res) {
  if (req.userData.admin) {
    userModel
      .getAllUsers()
      .then(response => {
        let role = req.body.type;
        if (role) {
          let users = response.filter(item => {
            return item.role == role;
          });
          const csv = parse(users, opts);
          res.attachment("users.csv");
          res.status(200).send(csv);
        }
      })
      .catch(err => {
        res.status(500).json(err);
      });
  } else {
    userModel
      .getAllUsersByRetailers(req.userData._retailers)
      .then(response => {
        let role = req.body.type;
        if (role) {
          let users = response.filter(item => {
            return item.role == role;
          });
          const csv = parse(users, opts);
          res.attachment("users.csv");
          res.status(200).send(csv);
        }
      })
      .catch(error => {
        res.status(500).json(error);
      });
  }
};

exports.getById = function(req, res) {
  userModel
    .getUserById(req.body._id)
    .then(response => {
      res.status(200).json(response);
    })
    .catch(err => {
      res.status(500).json(err);
    });
};

exports.updateUser = function(req, res) {
  userModel
    .updateUser(req.body)
    .then(response => {
      res.status(200).json(response);
    })
    .catch(err => {
      res.status(500).json(err);
    });
};

exports.deleteUser = function(req, res) {
  userModel
    .removeUser(req.body)
    .then(response => {
      res.status(200).json(response);
    })
    .catch(err => {
      res.status(500).json(err);
    });
};

exports.getLoggedUser = (req, res) => {
  userModel
    .getUserById(req.userData._id)
    .then(response => {
      res.status(200).json(response);
    })
    .catch(err => {
      res.status(500).json(err);
    });
};

exports.addCustomer = (req, res) => {
  userModel
    .addCustomer(req.body, req.userData._id)
    .then(response => {
      res.status(200).json(response);
    })
    .catch(err => {
      res.status(500).json(err);
    });
};

exports.makeAdmin = (req, res) => {
  userModel
    .makeAdmin(req.body)
    .then(response => {
      res.status(200).json(response);
    })
    .catch(err => {
      res.status(500).json(err);
    });
};
