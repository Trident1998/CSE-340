const utilities = require("../utilities")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("./account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  }

  async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      title: "Register",
      nav,
      errors: null,
    })
  }

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
   req.flash("notice", "Please check your credentials and try again.")
   res.status(400).render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email,
   })
  return
  }
  try {
   if (await bcrypt.compare(account_password, accountData.account_password)) {
   delete accountData.account_password
   const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
   if(process.env.NODE_ENV === 'development') {
     res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
     } else {
       res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
     }
   return res.redirect("/account/")
   }
  } catch (error) {
   return new Error('Access Forbidden')
  }
 }

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildAcountManagment(req, res, next) {
  let nav = await utilities.getNav()
  const token  = req.cookies.jwt || null;

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      req.flash("notice", "Please login.")
      res.redirect("/account/login")
    } else {
      res.render("./account/menegment", {
        title: "Account Managment",
        greet: `Welcome ${decoded.account_firstname}`,
        nonClient: decoded.account_type != 'Client',
        nav,
        errors: null,
      })
    }
  });
}

/* ****************************************
*  Veerify token
* *************************************** */
async function verifyToken(req, res, next) {
  const token  = req.cookies.jwt || null;
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      res.status(401).json({ valid: false,});
    } else {
      res.status(200).json({ valid: true, first_name: decoded.account_firstname });
    }
  });
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function buildUpdateAccount(req, res) {
  let nav = await utilities.getNav()
  const token  = req.cookies.jwt || null;

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
    if (err) {
      req.flash("notice", "Please login.")
      res.redirect("/account/login")
    } else {
      res.render("./account/update-account", {
        title: "Update Account",
        nav,
        errors: null,
        account_firstname: decoded.account_firstname,
        account_lastname: decoded.account_lastname,
        account_email: decoded.account_email,
        account_id: decoded.account_id,
      })
    }
  });
}

/* ****************************************
 *  Process update user data request
 * ************************************ */
async function updateAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_id } = req.body
  const updateResult = await accountModel.updateAccoount(account_firstname, account_lastname, account_email, account_id)

  if (updateResult) {
    const itemName = updateResult.make + " " + updateResult.model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/account/")
  return
  } else {
    req.flash("notice", "Sorry, the updatee failed.")
    res.status(501).render("account/update-account", {
      title: "Update Account",
      nav,
      errors: null,
      account_firstname: account_firstname,
      account_lastname: account_lastname,
      account_email: account_email,
      account_id: account_id,
    })
  }
 }

 /* ****************************************
 *  Process update user data request
 * ************************************ */
async function updateAccountPassword(req, res) {
  let nav = await utilities.getNav()
  const { confirmPassword, account_id } = req.body
  
  let hashedPassword
  try {
    hashedPassword = await bcrypt.hashSync(confirmPassword, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/update-account", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const updateResult = await accountModel.updateAccountPassword(hashedPassword, account_id)

  if (updateResult) {
    const itemName = updateResult.make + " " + updateResult.model
    req.flash("notice", `The password was successfully updated.`)
    res.redirect("/account/")
  return
  } else {
    req.flash("notice", "Sorry, the updatee failed.")
    res.status(501).render("account/update-account", {
      title: "Update Account",
      nav,
      account_firstname: null,
      account_lastname: null,
      account_email: null,
      errors: null,
      account_id: account_id,
    })
  }
 }
 
  module.exports = { buildLogin, 
                    buildRegister, 
                    registerAccount, 
                    accountLogin, 
                    buildAcountManagment, 
                    verifyToken, 
                    buildUpdateAccount, 
                    updateAccount,
                    updateAccountPassword
                   }