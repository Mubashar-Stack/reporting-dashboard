const ModalReport = require("../models/report");
const csv = require("fast-csv");
const fs = require("fs");
const { db_read, db_write } = require("../config/db");

/**
 * Returns User List if found in db
 * @param req
 * @param res
 * @returns {*}
 */
 function getAllFiles(req, res) {
  try {

    ModalReport.getFiles((err, response) => {
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


 async function getHomeStats(req, res) {
  try {
    const {domain_name, start_date, end_date} = req.query
    let responseArray = []
    let currentMonthRevenue= {revenue: 0, calculatedRevenue: 0}
    let lastMonthRevenue= {revenue: 0, calculatedRevenue: 0}
    console.log(domain_name, start_date, end_date);
    const data = {
      Domain_name: domain_name? domain_name :"",
      start_date: start_date? start_date : "",
      end_date: end_date? end_date : ""
    }
    /*
    alternate code if asked to not calculate cur and last month revenue in every call
    ModalReport.getReports(data, (err, response) => {
      if (!err && response) {
        // console.log('response', response);

        response.map(respons =>{
          console.log('respons', respons);
          //we can round this value if req arises i.e Math.round(respons.Ad_Impressions - respons.Ad_Impressions*(parseFloat(("0."+respons.commission))))
          respons.Calculated_Ad_Requests = respons.Ad_Requests - respons.Ad_Requests*(parseFloat(("0."+respons.commission)))
          respons.Calculated_Ad_Impressions = respons.Ad_Impressions - respons.Ad_Impressions*(parseFloat(("0."+respons.commission)))
          respons.Calculated_Revenue = respons.Revenue - respons.Revenue*(parseFloat(("0."+respons.commission)))

        })

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
    */
    await ModalReport.getReports(data, async (err, response) => {
      if (!err && response) {
        // console.log('response', response);

        await Promise.all(
          response.map(respons =>{
            console.log('respons', respons);
            //we can round this value if req arises i.e Math.round(respons.Ad_Impressions - respons.Ad_Impressions*(parseFloat(("0."+respons.commission))))
            respons.Calculated_Ad_Requests = respons.Ad_Requests - respons.Ad_Requests*(parseFloat(("0."+respons.commission)))
            respons.Calculated_Ad_Impressions = respons.Ad_Impressions - respons.Ad_Impressions*(parseFloat(("0."+respons.commission)))
            respons.Calculated_Revenue = respons.Revenue - respons.Revenue*(parseFloat(("0."+respons.commission)))
  
          })
        )
        responseArray = response

        // return res.json({
        //   message: "success",
        //   data: response,
        // });
      }
      // return res.status(401).send({
      //   error: "Not Found",
      //   message: "No user found.",
      // });
    });


    let date = new Date();
    let firstDayOfCurrentMonth = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
    let lastDayLastDayOfCurrentMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0];

    await ModalReport.getReports({Domain_name: "", start_date: firstDayOfCurrentMonth, end_date: lastDayLastDayOfCurrentMonth}, async (err, response) => {
      if (!err && response) {
        // console.log('response', response);

        await Promise.all(
          response.map(respons =>{
            console.log('respons', respons);
            respons.Calculated_Revenue = respons.Revenue - respons.Revenue*(parseFloat(("0."+respons.commission)))
            currentMonthRevenue.revenue += respons.Revenue
            currentMonthRevenue.calculatedRevenue += respons.Calculated_Revenue
          })
        )
      }
    });

    let firstDayOfLastMonth = new Date(date.getFullYear(), date.getMonth()-1, 1).toISOString().split('T')[0];
    let lastDayLastDayOfLastMonth = new Date(date.getFullYear(), date.getMonth() , 0).toISOString().split('T')[0];

    await ModalReport.getReports({Domain_name: "", start_date: firstDayOfLastMonth, end_date: lastDayLastDayOfLastMonth}, async (err, response) => {
      console.log('err :/'. err);
      if (!err && response) {
        console.log('response', response);

        await Promise.all(
          response.map(respons =>{
            console.log('respons', respons);
            respons.Calculated_Revenue = respons.Revenue - respons.Revenue*(parseFloat(("0."+respons.commission)))
            lastMonthRevenue.revenue += respons.Revenue
            lastMonthRevenue.calculatedRevenue += respons.Calculated_Revenue
          })
        )
      }
    });

    return res.json({
      message: "success",
      data: {response: responseArray, currentMonthRevenue, lastMonthRevenue},
    });
  } catch (e) {}
}

function addReport(req, res) {
  try {
    if (!req.files) {
      res.send({
        status: false,
        message: "No file uploaded",
      });
    } else {
      //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
      let report = req.files.report;
      if (!report.mimetype.includes("csv")) {
        return res.send({
          status: false,
          message: "Please upload only csv file.",
        });
      }

      //Use the mv() method to place the file in the upload directory (i.e. "uploads")
      report.mv(
        "./uploads/" + Math.floor(new Date() / 1000) + "_" + report.name
      );

      let rows = [];
     

      const data = {
        file: Math.floor(new Date() / 1000) + "_" + report.name,
        commission: req.body.commission,
        create_at: new Date(req.body.date),
        updated_at: new Date(req.body.date),
      };

      db_write.query("INSERT INTO files SET ? ", [data], function (err, res) {
        if (err) {
          console.log("error: ", err);
        } else {
          console.log("error: ", res);
        }
      });
      
      let path =
      "./uploads/" + Math.floor(new Date() / 1000) + "_" + report.name;

      fs.createReadStream(path)
        .pipe(csv.parse({ headers: true }))
        .on("error", (error) => {
          throw error.message;
        })
        .on("data", (row) => {
          let final_row = {
            Domain_name: row["Domain name"],
            Ad_Requests: row["Ad Requests"],
            Ad_Impressions: row["Ad Impressions"],
            Revenue: row["Revenue (USD)"],
            eCPM: row["eCPM"],
            commission: req.body.commission,
            create_at: new Date(req.body.date),
            updated_at: new Date(req.body.date),
          };
          rows.push(final_row);
        })
        .on("end", () => {
          ModalReport.addReport(rows, (err, response) => {
            if (!err && response) {
              return res.json({
                message: "Report imported successfully!",
                status: true,
              });
            }
            return res.status(401).send(err);
          });
        });
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
}


function deleteFile(req, res) {
  try {
    const fileId = req.params.id;

    ModalReport.deleteFile(fileId, (err, response) => {
        if (!err && response) {
          return res.json({
            message: "File Deleted successfully!",
            status: true,
          });
        }
        return res.status(401).send(err);
      });
   
  } catch (err) {
    res.status(500).send(err.message);
  }
}

module.exports = { addReport, getAllFiles,deleteFile, getHomeStats };