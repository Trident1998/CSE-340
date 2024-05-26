const utilities = require(".")
const { body, validationResult } = require("express-validator")
const accountModel = require("../models/account-model")
const validate = {}
const bcrypt = require("bcryptjs")


/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
validate.registationRules = () => {
    return [
      // firstname is required and must be string
      body("account_firstname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), // on error this message is sent.
  
      // lastname is required and must be string
      body("account_lastname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), // on error this message is sent.
  
      // valid email is required and cannot already exist in the DB
      body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (emailExists){
          throw new Error("Email exists. Please log in or use different email")
        }
      }),
  
      // password is required and must be strong password
      body("account_password")
        .trim()
        .notEmpty()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
  }

 /* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/register", {
        errors,
        title: "Registration",
        nav,
        account_firstname,
        account_lastname,
        account_email,
        })
        return
    }
    next()
}


/*  **********************************
  *  Login Data Validation Rules
  * ********************************* */
validate.loginnRules = () => {
    return [
      // valid email is required and cannot already exist in the DB
      body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (!emailExists){
          throw new Error("Email does not exist. Please sin up")
        }
      }),
    ]
  }

 /* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegLoginData = async (req, res, next) => {
    const { account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/login", {
        errors,
        title: "Login",
        nav,
        account_email,
        })
    }
    next()
}

/*  **********************************
  *  Login Data Validation Rules
  * ********************************* */
validate.updatingRules = () => {
  return [
      // firstname is required and must be string
      body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Password does not meet requirements."),
  
      // lastname is required and must be string
      body("account_lastname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), // on error this message is sent.
  
      // valid email is required and cannot already exist in the DB
      body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail() // Refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email, { req }) => {
        const accountId = req.body.account_id; 
        const currentAccount = await accountModel.getAccountById(accountId);
        
        if (currentAccount.account_email === account_email) {
          return true;
        }

        const emailExists = await accountModel.checkExistingEmail(account_email);
        if (emailExists) {
          throw new Error("Email exists. Please use a different email.");
        }
        return true;
      }),
  ]
}

/* ******************************
* Check data and return errors or continue to registration
* ***************************** */
validate.checkRegUpdateData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email, account_id } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/update-account", {
      errors,
      title: "Update Account",
      nav,
      account_firstname,
      account_lastname,
      account_email,
      account_id,
      })
      return
  }
  next()
}

/*  **********************************
  *  Login Data Validation Rules
  * ********************************* */
validate.changePasswordRules = () => {
  return [
      // firstname is required and must be string
      body("currentPassword")
        .trim()
        .notEmpty()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Please provide a first name.")
        .custom(async (currentPassword, { req }) => {
          const accountId = req.body.account_id; 
          const currentAccount = await accountModel.getAccountById(accountId);
          const hashedPassword = await bcrypt.hashSync(currentPassword, 10)

          await bcrypt.compare(currentPassword, currentAccount.account_password)
          if (await bcrypt.compare(currentPassword, currentAccount.account_password)) {
            return true;
          }
          throw new Error("Current password does not mach!")
        }),

      body("newPassword")
        .trim()
        .notEmpty()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("New password does not meet requirements.")        
        .custom(async (newPassword, { req }) => {
          const accountId = req.body.account_id; 
          const currentAccount = await accountModel.getAccountById(accountId);
          if (await bcrypt.compare(newPassword, currentAccount.account_password)) {
            throw new Error("Old password and new password are endentical!")
          }
        }),
  
      body("confirmPassword")
      .trim()
      .notEmpty()
      .custom(async (confirmPassword, { req }) => {
        const newPassword = req.body.newPassword; 
        
        if (newPassword != confirmPassword) {
          throw new Error("Confirmed pssword does not mach with new password!");
        }}),
  ]
}

/* ******************************
* Check data and return errors or continue to registration
* ***************************** */
validate.checkChangePasswordData = async (req, res, next) => {
  const { account_id } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/update-account", {
      errors,
      title: "Update Account",
      nav,
      account_firstname: null,
      account_lastname: null,
      account_email: null,
      account_id,
      })
      return
  }
  next()
}

module.exports = validate
