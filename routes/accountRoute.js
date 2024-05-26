// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')

router.get("/", utilities.handleErrors(accountController.buildAcountManagment));

// Route to build inventory by classification view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

router.get("/register", utilities.handleErrors(accountController.buildRegister));

router.get("/verify-token", utilities.handleErrors(accountController.verifyToken));

router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Process the login attempt
router.post(
  "/login",
  regValidate.loginnRules(),
  regValidate.checkRegLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

router.get("/update", utilities.handleErrors(accountController.buildUpdateAccount));

router.post(
  "/update",
  regValidate.updatingRules(),
  regValidate.checkRegUpdateData,
  utilities.handleErrors(accountController.updateAccount)
)

router.post(
  "/change-password",
  regValidate.changePasswordRules(),
  regValidate.checkChangePasswordData,
  utilities.handleErrors(accountController.updateAccountPassword)
)

module.exports = router;
