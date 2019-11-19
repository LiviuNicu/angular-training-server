var mongoose = require("mongoose"),
  Schema = mongoose.Schema;
var crypto = require("crypto");
var JWT = require("./../middleware/jwt");

var UserSchema = new Schema({
  email: { type: String, unique: true, required: true },
  hashed_password: { type: String, required: true },
  name: { type: String, required: true }
});
var user = mongoose.model("user", UserSchema);

function hashPW(pwd) {
  return crypto
    .createHash("sha256")
    .update(pwd)
    .digest("base64")
    .toString();
}

exports.register = function(userReq) {
  var newUser = new user();

  newUser.set("email", userReq.email);
  newUser.set("hashed_password", hashPW(userReq.passwords.password));
  newUser.set("name", userReq.name);

  return new Promise((resolve, reject) => {
    newUser.save(function(err, doc) {
      if (err) {
        reject({ err });
      } else {
        resolve({ success: "User Inserted Successfuly!", doc });
      }
    });
  });
};

exports.addCustomer = function(userReq, loggedUserId) {
  var newUser = new user();

  newUser.set("email", userReq.email);
  newUser.set("hashed_password", hashPW(userReq.passwords.password));
  newUser.set("name", userReq.name);

  return new Promise((resolve, reject) => {
    newUser.save(function(err) {
      if (err) {
        reject({ err });
      } else {
        resolve({ success: "User Inserted Successfuly!" });
      }
    });
  });
};

exports.login = function(userReq) {
  return new Promise((resolve, reject) => {
    user.findOne({ email: userReq.email }).exec(function(err, user) {
      if (err) {
        reject(err);
      }
      if (!user) {
        reject({ msg: "Auth failed" });
      } else if (user.hashed_password === hashPW(userReq.password.toString())) {
        var token = JWT.getToken({
          email: user.email,
          _id: user._id,
          username: user.username,
          admin: user.admin,
          _retailers: user._retailers
        });
        resolve({
          msg: "auth successfull",
          token: token,
          user: {
            name: user.name,
            email: user.email
          }
        });
      } else {
        reject({ msg: "Auth failed" });
      }
    });
  });
};

exports.getAllUsers = function() {
  return new Promise((resolve, reject) => {
    user
      .find()
      .populate("_retailers")
      .populate("_addedBy")
      .exec(function(err, users) {
        if (err) {
          reject({ err });
        } else {
          resolve(users);
        }
      });
  });
};
exports.getAllUsersByRetailers = function(retailers) {
  return new Promise((resolve, reject) => {
    user
      .find({ _retailers: { $in: retailers }, admin: false })
      .populate("_retailers")
      .populate("_addedBy")
      .exec(function(err, users) {
        if (err) {
          reject({ err });
        } else {
          resolve(users);
        }
      });
  });
};

exports.getUserById = function(id) {
  return new Promise((resolve, reject) => {
    user.findOne({ _id: id }).exec(function(err, user) {
      if (err) {
        reject({ err });
      } else {
        resolve(user);
      }
    });
  });
};

exports.updateUser = function(userReq) {
  return new Promise((resolve, reject) => {
    user.findOneAndUpdate(
      { _id: userReq._id },
      userReq,
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

exports.makeAdmin = function(userReq) {
  return new Promise((resolve, reject) => {
    user.findOneAndUpdate(
      { _id: userReq._id },
      { $set: { admin: true } },
      { upsert: false, new: true },
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

exports.removeUser = function(id) {
  return new Promise((resolve, reject) => {
    user.deleteOne({ _id: id }).exec(function(err) {
      if (err) {
        reject({ err });
      } else {
        resolve({ msg: "deleted successfully" });
      }
    });
  });
};
