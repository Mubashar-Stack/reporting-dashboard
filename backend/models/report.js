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

Report.getFiles = function getFiles(result) {
  db_read.query("SELECT * FROM `files` ORDER BY id DESC", function (err, res) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      result(null, res);
    }
  });
};

Report.getReports = async function getReports(filter, result) {

  return new Promise(async (resolve) => {

    console.log('filter', filter);
    let middleQuery =""
    let filterArray
    if(filter.userDomains){
      console.log('filter.userDomains.length', filter.userDomains.length);
      filter.userDomains.length<2 ? middleQuery = "Domain_name = ? and " : middleQuery = "Domain_name in ? and "
      filter.userDomains.length<2 ? filter.userDomains = filter.userDomains[0] : filter.userDomains = "("+filter.userDomains.toString()+")"
      filterArray = [filter.userDomains, filter.start_date, filter.end_date] 
    }else{
      middleQuery =(filter.Domain_name.length>0? "Domain_name = ? and ": "")
      filterArray = filter.Domain_name.length>0 ? [filter.Domain_name, filter.start_date, filter.end_date] : [filter.start_date, filter.end_date] 
    }
    console.log('filterArray', filterArray, 'middleQuery', middleQuery);
    db_read.query("SELECT * FROM `reports` where " +middleQuery+"create_at >= ? and create_at <= ? ORDER BY id DESC", filterArray, function (err, res) {
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

//users_domains join domains on domain_id = domains.id JOIN reports on domains.domainname= reports.Domain_name

Report.deleteFile = function deleteFile(id, result) {
  db_read.query(
    "SELECT id, file FROM files where id = ?",
    [id],
    (err, response, fields) => {
      if (!err && response.length === 1) {
        db_write.query(
          "DELETE FROM files WHERE id=?",
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
        result({ error: "deletions Failed!", message: "File Not Found " });
      }
    }
  );
};

module.exports = Report;
