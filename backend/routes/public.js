const express = require("express");
const router = express.Router();
const auth = require("../controllers/auth");
const validate = require("express-validation");
const authValidation = require("../validations/auth");
const users = require("../controllers/users");
const reports = require("../controllers/reports");


router
  .route("/auth/login")
  .post(validate(authValidation.loginParam), auth.login);
router.route("/users/:id").get(users.getUserById);
router.route("/users").get(users.getAllUsers);
router.route("/user/add").post(users.addUser);

router.route("/user/update/:id").put(users.updateUser);
router.route("/user/delete/:id").delete(users.deleteUser);


router.route("/reports/new").post(reports.addReport);


module.exports = router;
