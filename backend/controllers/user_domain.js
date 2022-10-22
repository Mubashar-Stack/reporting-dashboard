const ModalUserDomain = require("../models/users_domains");
const Hash = require("crypto-js/pbkdf2");
const config = require("../config/app");

/**
 * Returns Domain Detail if found in db
 * @param req
 * @param res
 * @returns {*}
 */
function getUserDomainById(req, res) {
  try {
    const UserDomainId = req.params.id;
    console.log('DomainId', UserDomainId);
    ModalUserDomain.findById(UserDomainId, (err, response) => {
      if (!err && response) {

        return res.json({
          message: "success",
          data: response,
        });
      }
      return res.status(404).send({
        error: "Not Found",
        message: "No UserDomain found.",
      });
    });
  } catch (e) { }
}

function getUserDomainByUserId(req, res) {
  try {
    const user_id = req.params.user_id;
    console.log('userID', user_id);
    ModalUserDomain.getUserDomainsById(user_id, (err, response) => {
      if (!err && response) {

        return res.json({
          message: "success",
          data: response,
        });
      }
      return res.status(404).send({
        error: "Not Found",
        message: "No UserDomain found.",
      });
    });
  } catch (e) { }
}

/**
 * Returns UserDomain List if found in db
 * @param req
 * @param res
 * @returns {*}
 */
function getAllUserDomains(req, res) {
  try {
    const domainId = req.params.id;

    ModalUserDomain.getUserDomains((err, response) => {
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

function addUserDomain(req, res) {
  try {
    const data = {
      user_id: req.body.user_id,
      domain_id: req.body.domain_id,
    };

    ModalUserDomain.addUserDomain(data, (err, response) => {
      if (!err && response) {
        return res.json({
          message: "UserDomain Added successfully!",
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

function updateUserDomain(req, res) {
  try {
    const userDomainId = req.params.id;
    const data = {
      userDomainId,
      user_id: req.body.user_id,
      domain_id: req.body.domain_id,
    };

    ModalUserDomain.updateUserDomain(data, (err, response) => {
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

function deleteUserDomain(req, res) {
  try {
    const userDomainId = req.params.id;

    ModalUserDomain.deleteUserDomain(userDomainId, (err, response) => {
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

module.exports = { getAllUserDomains, getUserDomainByUserId, getUserDomainById, addUserDomain, updateUserDomain, deleteUserDomain };
