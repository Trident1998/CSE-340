const utilities = require(".")
const { body, validationResult } = require("express-validator")
const accountModel = require("../models/account-model")
const constants = require("../utilities/constants")
const validate = {}

/*  **********************************
*  Classification Data Validation Rules
* ********************************* */
validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .matches(/^[a-zA-Z]+$/)
      .withMessage("Please provide a valid classification name."), 
  ]
}

/* ******************************
* Check data and return errors or continue to classification
* ***************************** */
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("inventory/add-classification", {
      errors,
      title: "Add Classification",
      nav,
      flashMessage: null,
      classification_name,
      })
      return
  }
  next()
}

/*  **********************************
*  Invantory Data Validation Rules
* ********************************* */
validate.invemtoryRules = () => {
    return [
      body("make") 
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Please provide a valid name in Make field."), 

      body("model") 
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Please provide a valid name in Model field."), 

      body('year')
      .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
      .isLength({ min: 4, max: 4 })
      .withMessage('Please provide a valid name in Year field.'),

      body("description") 
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a valid name in Description field."), 

      body("image_path") 
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a valid name in Image Path field."),

      body("thumbnail_path") 
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a valid name in Thumbnail Path field."),

      body('price')
      .matches(/^\d+(\.\d{2})?$/)
      .withMessage('Please provide a valid name in Price field.'),


      body('miles')
          .isInt({ min: 0 })
          .withMessage('Please provide a valid name in Miles field.'),

      body("color") 
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a valid name in Color field."),
    ]
  }

 /* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
  const {
    classification_id,
    make,
    model,
    year,
    description,
    image_path,
    thumbnail_path,
    price,
    miles,
    color
  } = req.body;

  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("inventory/add-inventory", {
      errors,
      title: "Add Inventory",
      nav,
      classification_id,
      make,
      model,
      year,
      description,
      image_path,
      thumbnail_path,
      price,
      miles,
      color,
      })
  }
  next()
}


 /* ******************************
 * Check data and return errors or continue to updating inventory
 * ***************************** */
 validate.checkUpdateData = async (req, res, next) => {
  const {
    inv_id,
    classification_id,
    make,
    model,
    year,
    description,
    image_path,
    thumbnail_path,
    price,
    miles,
    color
  } = req.body;

  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("inventory/edit-inventory", {
      errors,
      title: "Edit Inventory",
      nav,
      inv_id,
      classification_id,
      make,
      model,
      year,
      description,
      image_path,
      thumbnail_path,
      price,
      miles,
      color,
      })
  }
  next()
}

module.exports = validate
