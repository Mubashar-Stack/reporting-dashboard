"user strict";

const { db_read, db_write } = require("../config/db");

// User object constructor
const User = (data) => {
  this.id = data.id;
  this.username = data.username;
  this.email = data.email;
  this.password = data.password;
  this.card_name = data.card_name;
  this.card_number = data.card_number;
  this.cvc = data.cvc;
  this.expiry_date = data.expiry_date;
  this.created_at = new Date();
  this.updated_at = new Date();
};

User.findById = function getUserById(userId, result) {
  db_read.query(
    "Select * from users where id = ?",
    userId,
    function (err, res) {
      if (err) {
        console.log("error: ", err);
        result(err, null);
      } else {
        result(null, res[0]);
      }
    }
  );
};

User.getUsers = function getAllUsers(result) {
  db_read.query("Select * from users", function (err, res) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      result(null, res);
    }
  });
};

User.addUser = function addUser(input, result) {
  let currentDate = new Date();

  let data = {
    type: "user",
    first_name: input.firstName,
    last_name: input.lastName,
    photo: input.photo,
    email: input.email,
    enabled: 1,
    password: input.password,
    card_name: input.card_name,
    card_number: input.card_number,
    cvc: input.cvc,
    expiry_date: input.expiry_date,
    create_at: currentDate,
    updated_at: currentDate,
  };
  console.log(data);
  db_read.query(
    "SELECT id, email, password FROM users where email = ?",
    [input.email],
    (err, response, fields) => {
      if (!err && response.length != 1) {
        console.log(response);
        db_write.query("INSERT INTO users SET ? ", [data], function (err, res) {
          if (err) {
            console.log("error: ", err);
            result(err, null);
          } else {
            result(null, res);
          }
        });
      } else {
        result({ error: "Insertion Failed!", message: "User Already Exits" });
      }
    }
  );
};

User.updateUser = function updateUser(input, result) {
  let currentDate = new Date();

  let data = {
    first_name: input.firstName,
    last_name: input.lastName,
    photo: input.photo,
    email: input.email,
    password: input.password,
    updated_at: currentDate,
  };
  console.log(data);
  db_read.query(
    "SELECT id, email, password FROM users where email = ?",
    [input.email],
    (err, response, fields) => {
      if (!err && response.length === 1) {
        console.log(response);
        data.card_name = input.card_name ? input.card_name : response[0].card_name
        data.card_number = input.card_number ? input.card_number : response[0].card_number
        data.cvc = input.cvc ? input.cvc : response[0].cvc
        data.expiry_date = input.expiry_date ? input.expiry_date : response[0].expiry_date
        db_write.query(
          "UPDATE users SET ? WHERE id=?",
          [data, input.userId],
          function (err, res) {
            if (err) {
              console.log("error: ", err);
              result(err, null);
            } else {
              result(null, res);
            }
          }
        );
      } else {
        result({ error: "Insertion Failed!", message: "User Not Found Exits" });
      }
    }
  );
};

User.deleteUser = function deleteUser(id, result) {
  db_read.query(
    "SELECT id, email, password FROM users where id = ?",
    [id],
    (err, response, fields) => {
      if (!err && response.length === 1) {
        db_write.query(
          "DELETE FROM users WHERE id=?",
          [id],
          function (err, res) {
            if (err) {
              console.log("error: ", err);
              result(err, null);
            } else {
              result(null, res);
            }
          }
        );
      } else {
        result({ error: "Insertion Failed!", message: "User Not Found Exits" });
      }
    }
  );
};

module.exports = User;
