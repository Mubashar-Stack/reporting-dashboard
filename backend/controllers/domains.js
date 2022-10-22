const ModalDomain = require("../models/domain");
const Hash = require("crypto-js/pbkdf2");
const config = require("../config/app");

/**
 * Returns Domain Detail if found in db
 * @param req
 * @param res
 * @returns {*}
 */
function getDomainById(req, res) {
  try {
    const DomainId = req.params.id;
    console.log("DomainId", DomainId);
    ModalDomain.findById(DomainId, (err, response) => {
      if (!err && response) {
        return res.json({
          message: "success",
          data: response,
        });
      }
      return res.status(404).send({
        error: "Not Found",
        message: "No Domain found.",
      });
    });
  } catch (e) {}
}

/**
 * Returns Domain List if found in db
 * @param req
 * @param res
 * @returns {*}
 */
function getAllDomains(req, res) {
  try {
    const domainId = req.params.id;

    ModalDomain.getDomains((err, response) => {
      if (!err && response) {
        return res.json({
          message: "success",
          data: response,
        });
      }
      return res.status(401).send({
        error: "Not Found",
        message: "No domain found.",
      });
    });
  } catch (e) {}
}

/**
 * @param req
 * @param res
 * @returns {*}
 */

function addDomain(req, res) {
  try {
    let ads_code = req.files.ads_code;
    console.log("ads_code", ads_code);
    ads_code.mv(
      "./uploads/" + Math.floor(new Date() / 1000) + "_" + ads_code.name
    );
    console.log("received body", req.body.domainName);
    const data = {
      domainName: req.body.domainName,
      ads_code: Math.floor(new Date() / 1000) + "_" + ads_code.name,
    };

    ModalDomain.addDomain(data, (err, response) => {
      if (!err && response) {
        return res.json({
          message: "Domain Added successfully!",
          status: true,
        });
      }
      return res.status(401).send(err);
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
}

/**
 * @param req
 * @param res
 * @returns {*}
 */

function updateDomain(req, res) {
  try {
    const domainId = req.params.id;
    // if (req.body.isFileChange !== 'false' ) {
    //   if (!req.files) {
    //     res.send({
    //       status: false,
    //       message: "No file uploaded",
    //     });
    //   }
    // } else {
      let ads_code;
      if (req.files) {
        //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
        ads_code = req.files.ads_code;
        //Use the mv() method to place the file in the upload directory (i.e. "uploads")
        ads_code.mv(
          "./uploads/" + Math.floor(new Date() / 1000) + "_" + ads_code.name
        );
      }
      const data = {
        domainId,
        domainName: req.body.domainName,
      };

      if (req.files) {
        data.ads_code = Math.floor(new Date() / 1000) + "_" + ads_code.name;
      }

      if (!req.body.isFileChange) {
        data.photo = req.body.ads_code;
      }

      ModalDomain.updateDomain(data, (err, response) => {
        if (!err && response) {
          return res.json({
            message: "Domain Updated successfully!",
            status: true,
          });
        }
        return res.status(401).send(err);
      });
    // }
  } catch (err) {
    res.status(500).send(err.message);
  }
}

function deleteDomain(req, res) {
  try {
    const domainId = req.params.id;

    ModalDomain.deleteDomain(domainId, (err, response) => {
      if (!err && response) {
        return res.json({
          message: "Domain Deleted successfully!",
          status: true,
        });
      }
      return res.status(401).send(err);
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
}

module.exports = {
  getAllDomains,
  getDomainById,
  addDomain,
  updateDomain,
  deleteDomain,
};
