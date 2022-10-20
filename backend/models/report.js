"user strict";

const { db_read, db_write } = require("../config/db");

// Report object constructor
const Report = (data) => {
  this.id = data.id;
  this.Domain_name = data.Domain_name;
  this.Ad_Requests = data.Ad_Requests;
  this.Ad_Impressions = data.Ad_Impressions;
  this.Revenue = data.Revenue;
  this.eCPM = data.eCPM;
  this.commission=data.commission;
  this.created_at = data.create_at;
  this.updated_at = data.updated_at;
};


Report.addReport = function addReport(data, result) {

  
 
  db_write.query("INSERT INTO reports (Domain_name, Ad_Requests, Ad_Impressions,Revenue,commission,create_at,updated_at) VALUES ? ", [data.map(item => [item.Domain_name, item.Ad_Requests, item.Ad_Impressions,item.Revenue,item.commission,item.create_at,item.updated_at])], function (err, res) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      result(null, res);
    }
  });

 
};

module.exports = Report;
