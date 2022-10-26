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
  this.banck_name = data.banck_name;
  this.bank_address = data.bank_address;
  this.bank_ac_holder_name = data.bank_ac_holder_name;
  this.account_number = data.account_number;
  this.IFSC_code = data.IFSC_code;
  this.bank_account_holder_address = data.bank_account_holder_address;
  this.swift_bic_code = data.swift_bic_code;
  this.paypal_email_address = data.paypal_email_address;
  this.created_at = new Date();
  this.updated_at = new Date();
};

User.findById = function getUserById(userId, result) {
  return new Promise(async (resolve) => {

    db_read.query(
      "Select * from users where id = ?",
      userId,
      function (err, res) {
        if (err) {
          console.log("error: ", err);
          resolve(result(err, null));
        } else {
          resolve(result(null, res[0]));
        }
      }
    );
  });

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
    banck_name: input.banck_name,
    bank_address: input.bank_address,
    bank_ac_holder_name: input.bank_ac_holder_name,
    account_number: input.account_number,
    IFSC_code: input.IFSC_code,
    bank_account_holder_address: input.bank_account_holder_address,
    swift_bic_code: input.swift_bic_code,
    paypal_email_address: input.paypal_email_address,
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
        data.banck_name = input.banck_name ? input.banck_name : response[0].banck_name
        data.bank_address = input.bank_address ? input.bank_address : response[0].bank_address
        data.bank_ac_holder_name = input.bank_ac_holder_name ? input.bank_ac_holder_name : response[0].bank_ac_holder_name
        data.account_number = input.account_number ? input.account_number : response[0].account_number
        data.IFSC_code = input.IFSC_code ? input.IFSC_code : response[0].IFSC_code
        data.bank_account_holder_address = input.bank_account_holder_address ? input.bank_account_holder_address : response[0].bank_account_holder_address
        data.swift_bic_code = input.swift_bic_code ? input.swift_bic_code : response[0].swift_bic_code
        data.paypal_email_address = input.paypal_email_address ? input.paypal_email_address : response[0].paypal_email_address
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
