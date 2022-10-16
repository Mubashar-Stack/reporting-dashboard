const ModalReport = require("../models/report");
const csv = require("fast-csv");
const fs = require("fs");

/**
 * @param req
 * @param res
 * @returns {*}
 */

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
            create_at: new Date(req.body.date),
            updated_at: new Date(req.body.date),
          }
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

module.exports = { addReport };
