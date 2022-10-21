"user strict";

const { db_read, db_write } = require("../config/db");

// Domain object constructor
const Domain = (data) => {
  this.id = data.id;
  this.domainname = data.domainname;
  this.created_at = new Date();
  this.updated_at = new Date();
};

Domain.findById = function getDomainById(domainId, result) {
  db_read.query(
    "Select * from domains where id = ?",domainId,
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

Domain.getDomains = function getAllDomains(result) {
  db_read.query("Select * from domains", function (err, res) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      result(null, res);
    }
  });
};

Domain.addDomain = function addDomain(input, result) {
  let currentDate = new Date();

  let data = {
    domainname: input.domainName,
    created_at: currentDate,
    updated_at: currentDate,
  };
  console.log(data);
  db_read.query(
    "SELECT id, domainname FROM domains where domainname = ?",
    [input.domainname],
    (err, response, fields) => {
      if (!err && response.length != 1) {
        console.log(response);
        db_write.query("INSERT INTO domains SET ? ", [data], function (err, res) {
          if (err) {
            console.log("error: ", err);
            result(err, null);
          } else {
            result(null, res);
          }
        });
      } else {
        result({ error: "Insertion Failed!", message: "Dmain Already Exits" });
      }
    }
  );
};

Domain.updateDomain = function updateDomain(input, result) {
  let currentDate = new Date();

  let data = {
    domainname: input.domainName,
    updated_at: currentDate,
  };
  console.log(data, input.domainId);
  db_read.query(
    "SELECT id, domainname FROM domains where id = ?",
    [input.domainId],
    (err, response, fields) => {
      if (!err && response.length === 1) {
        console.log('response', response);
        db_write.query(
          "UPDATE domains SET ? WHERE id=?",
          [data, input.domainId],
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
        result({ error: "Insertion Failed!", message: "Domain Not Found Exits" });
      }
    }
  );
};

Domain.deleteDomain = function deleteDomain(id, result) {
  db_read.query(
    "SELECT id, domainname FROM domains where id = ?",
    [id],
    (err, response, fields) => {
      if (!err && response.length === 1) {
        db_write.query(
          "DELETE FROM domains WHERE id=?",
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

module.exports = Domain;
