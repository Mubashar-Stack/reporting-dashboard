"user strict";

const { db_read, db_write } = require("../config/db");

// UserDomain object constructor
const UserDomain = (data) => {
  this.id = data.id;
  this.user_id = data.user_id;
  this.domain_id = data.domain_id;
  this.created_at = new Date();
  this.updated_at = new Date();
};

UserDomain.findById = function getUserDomainById(userDomainId, result) {
  db_read.query(
    "SELECT a.*, b.first_name,b.last_name,b.photo,c.domainname FROM users_domains AS a JOIN users AS b ON a.user_id = b.id JOIN domains AS c ON a.domain_id = c.id  WHERE a.id = ?", userDomainId,
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

UserDomain.getUserDomainsById = function getUserDomainByUserId(user_id, result) {
  db_read.query(
    "Select * from users_domains where user_id = ?", user_id,
    function (err, res) {
      if (err) {
        console.log("error: ", err);
        result(err, null);
      } else {
        result(null, res);
      }
    }
  );
};

UserDomain.getUserDomains = function getAllUserDomains(result) {
  db_read.query("SELECT a.*, b.first_name,b.last_name,b.photo,c.domainname FROM users_domains AS a JOIN users AS b ON a.user_id = b.id JOIN domains AS c ON a.domain_id = c.id", function (err, res) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      result(null, res);
    }
  });
};

UserDomain.addUserDomain = function addUserDomain(input, result) {
  let currentDate = new Date();

  let data = {
    user_id: input.user_id,
    domain_id: input.domain_id,
    created_at: currentDate,
    updated_at: currentDate,
  };
  console.log(data);
  db_read.query(
    "SELECT id, user_id, domain_id FROM users_domains where user_id = ? and domain_id = ?",
    [input.user_id, input.domain_id],
    (err, response, fields) => {
      if (!err && response.length != 1) {
        console.log(response);
        db_write.query("INSERT INTO users_domains SET ? ", [data], function (err, res) {
          if (err) {
            console.log("error: ", err);
            result(err, null);
          } else {
            result(null, res);
          }
        });
      } else {
        result({ error: "Insertion Failed!", message: "UserDmain Already Exits" });
      }
    }
  );
};

UserDomain.updateUserDomain = function updateUserDomain(input, result) {
  let currentDate = new Date();

  let data = {
    updated_at: currentDate,
  };
  console.log(data, input.userDomainId);
  db_read.query(
    "SELECT id, user_id, domain_id  FROM users_domains where id = ?",
    [input.userDomainId],
    (err, response, fields) => {
      if (!err && response.length === 1) {
        console.log('response', response);
        data.user_id = input.user_id ? input.user_id : response[0].user_id
        data.domain_id = input.domain_id ? input.domain_id : response[0].domain_id
        db_read.query(
          "SELECT id, user_id, domain_id FROM users_domains where user_id = ? and domain_id = ?",
          [data.user_id, data.domain_id],
          (err, response, fields) => {
            if (!err && response.length != 1) {
              console.log(response);
              db_write.query(
                "UPDATE users_domains SET ? WHERE id=?",
                [data, input.userDomainId],
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
              result({ error: "Update Failed!", message: "UserDmain Already Exits" });
            }
          }
        );
      } else {
        result({ error: "Insertion Failed!", message: "Domain Not Found Exits" });
      }
    }
  );
};

UserDomain.deleteUserDomain = function deleteUserDomain(id, result) {
  db_read.query(
    "SELECT id FROM users_domains where id = ?",
    [id],
    (err, response, fields) => {
      if (!err && response.length === 1) {
        db_write.query(
          "DELETE FROM users_domains WHERE id=?",
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
        result({ error: "Deletion Failed!", message: "Domain Not Found Exits" });
      }
    }
  );
};

module.exports = UserDomain;
