const ModalFinalPayable = require("../models/final_payable");
const User =require("../models/user")
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

    ModalFinalPayable.getFiles((err, response) => {
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



function addFinalPayable(req, res) {
  try {
    if (!req.files) {
      res.send({
        status: false,
        message: "No file uploaded",
      });
    } else {
      //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
      let final_payable = req.files.final_payable;
      if (!final_payable.mimetype.includes("csv")) {
        return res.send({
          status: false,
          message: "Please upload only csv file.",
        });
      }

      //Use the mv() method to place the file in the upload directory (i.e. "uploads")
      final_payable.mv(
        "./uploads/" + Math.floor(new Date() / 1000) + "_" + final_payable.name
      );

      let rows = [];
     

      const data = {
        file: Math.floor(new Date() / 1000) + "_" + final_payable.name,
        commission: req.body.commission || 20,
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
      "./uploads/" + Math.floor(new Date() / 1000) + "_" + final_payable.name;

      fs.createReadStream(path)
        .pipe(csv.parse({ headers: true }))
        .on("error", (error) => {
          throw error.message;
        })
        .on("data", (row) => {
          let final_row = {
  // id, domain, gross_revenue, deductions, net_revenue

            domain: row["Domain"],
            gross_revenue: row["Gross Revenue"].split('$')[0],
            deductions: row["Deductions"].split('$')[0],
            net_revenue: row["Net Revenue"].split('$')[0],
            created_at: new Date(req.body.date),
            updated_at: new Date(req.body.date),
          };
          console.log('reading ', final_row, row["Gross Revenue"].split('$')[0]);
          rows.push(final_row);
        })
        .on("end", () => {
          ModalFinalPayable.addFinalPayable(rows, (err, response) => {
            if (!err && response) {
              return res.json({
                message: "FinalPayable imported successfully!",
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

async function getMonthlyReport(req, res) {
  try {
    let month =req.query.month

    let date = new Date(month);
    let firstDayOfSelectedMonth = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
    let lastDayLastDayOfSelectedMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0];

    await ModalFinalPayable.getMonthlyReport({month, start: firstDayOfSelectedMonth, end: lastDayLastDayOfSelectedMonth}, async (err, response) => {
      if (!err && response) {
        console.log('res', response);
        res.status(200).json({data: response})
      }
    })
  } catch (err) {
    res.status(500).send(err.message);
  }
}

const verifyToken = async (token) => {
  try {
    return await User.findById(JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString()).sub, (err, response) => {
      if (!err && response) {
        return response
      }
      return err
    })
    
  } catch (error) {
    console.log(error);
  }
}

async function getUserMonthlyReport(req, res) {
  try {

    if(!req.headers.authorization)
      res.status(400).json('Token required')
    const token = req.headers.authorization.split(" ")[1];
    req.user = await verifyToken(token);
    if(!req.user)
      res.status(404).json('User not found!')
    console.log('req.user', req.user);


    let month =req.query.month

    let date = new Date(month);
    let firstDayOfSelectedMonth = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
    let lastDayLastDayOfSelectedMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0];

    await ModalFinalPayable.getUserMonthlyReport({month, userId:req.user.id, start: firstDayOfSelectedMonth, end: lastDayLastDayOfSelectedMonth}, async (err, response) => {
      if (!err && response) {
        console.log('res', response);
        res.status(200).json({data: response})
      }
    })
  } catch (err) {
    res.status(500).send(err.message);
  }
}


module.exports = { addFinalPayable, getMonthlyReport, getUserMonthlyReport };