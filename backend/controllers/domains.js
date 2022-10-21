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
    console.log('DomainId', DomainId); 
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
  } catch (e) { }
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
  } catch (e) { }
}

/**
 * @param req
 * @param res
 * @returns {*}
 */

function addDomain(req, res) {
  try {
    console.log('received body', req.body.domainName);
    const data = {
      domainName: req.body.domainName
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

    const data = {
      domainId,
      domainName: req.body.domainName
    };
    ModalDomain.updateDomain(data, (err, response) => {
      if (!err && response) {
        return res.json({
          message: "Domain Updated successfully!",
          status: true,
        });
      }
      return res.status(401).send(err);
    });
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

module.exports = { getAllDomains, getDomainById, addDomain, updateDomain, deleteDomain };
