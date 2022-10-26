"use strict";

const { db_read, db_write } = require("../config/db");

// final_payable object constructor
const final_payable = (data) => {
  this.id = data.id;
  this.domain = data.domain;
  this.gross_revenue = data.gross_revenue;
  this.deductions = data.deductions;
  // id, domain, gross_revenue, deductions, net_revenue
  this.net_revenue = data.net_revenue;
  this.created_at = new Date();
  this.updated_at = new Date();
};


final_payable.addFinalPayable = function addFinalPayable(data, result) {

  db_write.query("INSERT INTO final_payable (domain, gross_revenue, deductions, net_revenue,created_at,updated_at) VALUES ? ", [data.map(item => [item.domain, item.gross_revenue, item.deductions, item.net_revenue, item.created_at, item.updated_at])], function (err, res) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      result(null, res);
    }
  });

};

final_payable.getMonthlyReport = function monthlyReport(filter, result) {

  return new Promise(async (resolve) => {

    console.log('filter', filter);

    db_read.query("SELECT * FROM `final_payable` where created_at >= ? and created_at <= ? + interval 1 DAY ORDER BY id DESC", [filter.start, filter.end], function (err, res) {
      if (err) {
        console.log("error: ", err);
        resolve(result(err, null));
      } else {
        // result(null, res);
        resolve(result(null, res));
      }
    });
  });

};


final_payable.getUserMonthlyReport = function monthlyReport(filter, result) {

  return new Promise(async (resolve) => {

    console.log('filter', filter);

    db_read.query("SELECT * FROM users_domains join domains on domain_id = domains.id JOIN final_payable on domains.domainname= final_payable.domain where"+ (filter.userId ? " user_id = ? and" : "")+" final_payable.created_at >= ? and final_payable.created_at <= ? ORDER BY final_payable.id DESC", (filter.userId ? [filter.userId, filter.start, filter.end] : [filter.start, filter.end]), function (err, res) {
      if (err) {
        console.log("error: ", err);
        resolve(result(err, null));
      } else {
        // result(null, res);
        resolve(result(null, res));
      }
    });
  });

};


module.exports = final_payable;
