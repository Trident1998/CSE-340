const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const regValidate = require('../utilities/account-validation')

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build inventory details vieew  by inventory Id
 * ************************** */
invCont.buildIventoryDeetailsByInventoryId = async function (req, res, next) {
    const inv_id = req.params.inventoryId
    const data = await invModel.getInventoryByInnventoryId(inv_id)
    const grid = await utilities.buildInvetoryDetailHtml(data[0])
    let nav = await utilities.getNav()
    const className =  `${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model}`
    res.render("./inventory/classification", {
      title: className,
      nav,
      grid,
    })
}

invCont.buildManagement = async (req, res) => {
  const flashMessage = req.flash('message');
  let nav = await utilities.getNav()
  const classificationSelect = await utilities.buildClassificationList()


  res.render('inventory/management', { 
    title: "Vehical Menegment",
    nav,
    flashMessage,
    errors: null,
    classificationSelect
   });
};

invCont.showAddClassification = async (req, res) => {
  const flashMessage = req.flash('message');
  const e = req.flash('error');

  let nav = await utilities.getNav()

  res.render('inventory/add-classification', {     
    title: "Add Classification",
    nav,
    flashMessage, 
    errors: null,
  });
};


invCont.addClassification = async (req, res) => {
  let nav = await utilities.getNav()
  const { classification_name } = req.body

  const regResult = await invModel.addClassification(classification_name)

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re added ${classification_name}.`
    )
    res.status(201).redirect('/');
  } else {
    req.flash("notice", "Sorry, the procces to add clasification failed.")
    res.status(501).render("account/register", {
      title: "Add Classification",
      nav,
      errors: null,
    })
  }
};


invCont.showAddInventory = async (req, res) => {
  let nav = await utilities.getNav()
  const classificationList = await utilities.buildClassificationList();
  const flashMessage = req.flash('message');
  const errors = req.flash('error');

  res.render('inventory/add-inventory', { 
    title: "Add Inventory",
    nav,
    classificationList, 
    flashMessage, 
    errors: null,
  });
};

invCont.addInventory = async (req, res) => {
  const nav = await utilities.getNav()
  const classificationList = await utilities.buildClassificationList();

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

  const regResult = await invModel.addInventory(classification_id, make, model, year, description, image_path, 
    thumbnail_path, price, miles, color)

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re added a new invetory.`
    )
    res.status(201).redirect('/');
  } else {
    req.flash("notice", "Sorry, the procces to add invetory failed.")
    res.status(501).render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList, 
      errors: null,
  })
}
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

module.exports = invCont
