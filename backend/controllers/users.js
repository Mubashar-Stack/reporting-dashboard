const ModalUser = require("../models/user");
const Hash = require("crypto-js/pbkdf2");
const config = require("../config/app");

/**
 * Returns User Detail if found in db
 * @param req
 * @param res
 * @returns {*}
 */
function getUserById(req, res) {
  try {
    const userId = req.params.id;

    ModalUser.findById(userId, (err, response) => {
      if (!err && response) {
        return res.json({
          message: "success",
          data: response,
        });
      }
      return res.status(401).send({
        error: "Not Found",
        message: "No user found.",
      });
    });
  } catch (e) {}
}

/**
 * Returns User List if found in db
 * @param req
 * @param res
 * @returns {*}
 */
function getAllUsers(req, res) {
  try {
    const userId = req.params.id;

    ModalUser.getUsers((err, response) => {
      if (!err && response) {
        return res.json({
          message: "success",
          data: response,
        });
      }
      return res.status(401).send({
        error: "Not Found",
        message: "No user found.",
      });
    });
  } catch (e) {}
}

/**
 * @param req
 * @param res
 * @returns {*}
 */

function addUser(req, res) {
  try {
    if (!req.files) {
      res.send({
        status: false,
        message: "No file uploaded",
      });
    } else {
      //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
      let avatar = req.files.avatar;
      //Use the mv() method to place the file in the upload directory (i.e. "uploads")
      avatar.mv(
        "./uploads/" + Math.floor(new Date() / 1000) + "_" + avatar.name
      );

      const data = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        photo: Math.floor(new Date() / 1000) + "_" + avatar.name,
        email: req.body.email,
        password: Hash(req.body.password, config.appSecret).toString(),
        card_name: req.body.card_name,
        card_number: req.body.card_number,
        cvc: req.body.cvc,
        expiry_date: req.body.expiry_date,
      };

      ModalUser.addUser(data, (err, response) => {
        if (!err && response) {
          return res.json({
            message: "User Added successfully!",
            status: true,
          });
        }
        return res.status(401).send(err);
      });
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
}

/**
 * @param req
 * @param res
 * @returns {*}
 */

function updateUser(req, res) {
  try {
    const userId = req.params.id;
    if (!req.files && req.body.isFileChange !== 'false') {
      res.send({
        status: false,
        message: "No file uploaded",
      });
    } else {

      let avatar
      if (req.files) {
        //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
        avatar = req.files.avatar;
        //Use the mv() method to place the file in the upload directory (i.e. "uploads")
        avatar.mv(
          "./uploads/" + Math.floor(new Date() / 1000) + "_" + avatar.name
        );
      }
      const data = {
        userId:userId,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        card_name: req.body.card_name,
        card_number: req.body.card_number,
        cvc: req.body.cvc,
        expiry_date: req.body.expiry_date,
      };

      if (req.files) {
        data.photo = Math.floor(new Date() / 1000) + "_" + avatar?.name;
      }
      if (req.body.password) {
        data.password = Hash(req.body.password, config.appSecret).toString();
      }

      if (!req.files) {
        data.photo = req.body.previousPhoto;
      }
      if (!req.body.password) {
        data.password = req.body.previousPassword;
      }

      ModalUser.updateUser(data, (err, response) => {
        if (!err && response) {
          return res.json({
            message: "User Updated successfully!",
            status: true,
          });
        }
        return res.status(401).send(err);
      });
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
}

function deleteUser(req, res) {
    try {
      const userId = req.params.id;
  
        ModalUser.deleteUser(userId, (err, response) => {
          if (!err && response) {
            return res.json({
              message: "User Deleted successfully!",
              status: true,
            });
          }
          return res.status(401).send(err);
        });
     
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

module.exports = { getAllUsers, getUserById, addUser, updateUser,deleteUser };
