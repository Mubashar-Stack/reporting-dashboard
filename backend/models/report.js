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
  this.created_at = data.create_at;
  this.updated_at = data.updated_at;
};


Report.addReport = function addReport(data, result) {
  data.map(async (input) => {
    let singleRow = {
      Domain_name: input.Domain_name,
      Ad_Requests: input.Ad_Requests,
      Ad_Impressions: input.Ad_Impressions,
      Revenue: input.Revenue,
      eCPM: input.eCPM,
      create_at: input.create_at,
      updated_at: input.updated_at,
    };

    console.log(singleRow,"singleRow");

    // db_write.query("INSERT INTO reports SET ? ", [data], function (err, res) {
    //   if (err) {
    //     console.log("error: ", err);
    //     result(err, null);
    //   } else {
    //     result(null, res);
    //   }
    // });


  });

 
};

module.exports = Report;
