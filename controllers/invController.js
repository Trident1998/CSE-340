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
 *  Build inventory details vieew by inventory Id
 * ************************** */
invCont.buildIventoryDeetailsByInventoryId = async function (req, res, next) {
    const inv_id = req.params.inventoryId
    const data = await invModel.getInventoryByInnventoryId(inv_id)
    const grid = await utilities.buildInvetoryDetailHtml(data)
    let nav = await utilities.getNav()
    const className =  `${data.inv_year} ${data.inv_make} ${data.inv_model}`
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
  const classificationList = await utilities.buildApprovedClassificationList();
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


  const decoded_thumbnail_path = thumbnail_path.replaceAll("&#x2F;", "/")
  const decoded_image_path = image_path.replaceAll("&#x2F;", "/")

  const regResult = await invModel.addInventory(classification_id, make, model, year, description, decoded_image_path, 
    decoded_thumbnail_path, price, miles, color)

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
 *  Build edit inventory details vieew  by inventory Id
 * ************************** */
invCont.buildEditIventoryDeetailsByInventoryId = async function (req, res, next) {
  const inv_id = parseInt(req.params.inventoryId)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryByInnventoryId(inv_id)
  const classificationList = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationList: classificationList,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

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

/* ***************************
 *  Return Unproved Classification As JSON
 * ************************** */
invCont.getUnaprovedClassificationsJSON = async (req, res, next) => {
  const invData = await invModel.getUnaprovedClassifications()
  if (invData) {
    res.status(200).json(invData);
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Return Unproved Inventory As JSON
 * ************************** */
invCont.getUnaprovedInventoryJSON = async (req, res, next) => {
  const invData = await invModel.getUnaprovedInventory()
  if (invData) {
    res.status(200).json(invData);
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Approve Classification
 * ************************** */
invCont.approveClassification = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const data = await invModel.approveClassification(classification_id)
  if (data) {
    req.flash("notice", `You have approved the Classification "${data[0].classification_name}" successfully`)
    res.status(200).redirect("/account");
  } else {
    req.flash("notice", `Approving of Classification "${data[0].classification_name}" was unsuccessfully`)
    res.status(401).redirect("/account");
  }
}

/* ***************************
 *  Reject Classification
 * ************************** */
invCont.rejectClassification = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const data = await invModel.rejectClassification(classification_id)
  if (data) {
    req.flash("notice", `You have rejected the Classification "${data[0].classification_name}" successfully`)
    res.status(200).redirect("/account");
  } else {
    req.flash("notice", `Rejecting of Classification "${data[0].classification_name}" was unsuccessfully`)
    res.status(401).redirect("/account");
  }
}

/* ***************************
 *  Review Inventory
 * ************************** */
invCont.reviewInventory = async (req, res, next) => {
  const inventoryId = parseInt(req.params.inventoryId)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryByInnventoryId(inventoryId, false)
  
  if (itemData) {
    const classificationList = await utilities.buildClassificationList(itemData.classification_id)
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`
    res.render("./inventory/review-inventory", {
      title: "Review " + itemName,
      nav,
      classificationList: classificationList,
      errors: null,
      inv_id: itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year,
      inv_description: itemData.inv_description,
      inv_image: itemData.inv_image,
      inv_thumbnail: itemData.inv_thumbnail,
      inv_price: itemData.inv_price,
      inv_miles: itemData.inv_miles,
      inv_color: itemData.inv_color,
      classification_id: itemData.classification_id
    })
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Approve or reject inventory
 * ************************** */
invCont.doActionForInventoryReview = async (req, res, next) => {
  let nav = await utilities.getNav()
  const {
    inv_id,
    action,
    make,
    model
  } = req.body

  let updateResult = null;

  if(action == "approve") {
    updateResult = await invModel.approveInvantory(inv_id)
  }
  if(action == "reject") {
    updateResult = await invModel.rejectInvantory(inv_id)
  }

  if (updateResult) {
    const itemName = make + " " + model
    req.flash("notice", `The ${itemName} was successfully proccesed.`)
    res.redirect("/account")
  } else {
    req.flash("notice", `The ${itemName} was unsuccessfully proccesed.`)
    res.redirect("/account")
  }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    make,
    model,
    description,
    image_path,
    thumbnail_path,
    price,
    year,
    miles,
    color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    make,
    model,
    description,
    image_path,
    thumbnail_path,
    price,
    year,
    miles,
    color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.make + " " + updateResult.model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationList = await utilities.buildClassificationList(classification_id)
    const itemName = `${make} ${model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationList: classificationList,
    errors: null,
    inv_id,
    make,
    model,
    year,
    description,
    image_path,
    thumbnail_path,
    price,
    miles,
    color,
    classification_id
    })
  }
}

/* ***************************
 *  Build delete inventory details vieew  by inventory Id
 * ************************** */
invCont.buildDeleteIventoryDeetailsByInventoryId = async function (req, res, next) {
  const inv_id = parseInt(req.params.inventoryId)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryByInnventoryId(inv_id)
  const classificationList = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
    classification_id: itemData.classification_id
  })
}

/* ***************************
 *  Delete Inventory Data
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    make,
    model,
    price,
    year,
    classification_id,
  } = req.body 
  const deleteResult = await invModel.deleteInventory(inv_id)

  if (deleteResult) {
    const itemName = deleteResult.make + " " + deleteResult.model
    req.flash("notice", `The ${itemName} was successfully deleted.`)
    res.redirect("/inv/")
  } else {
    const classificationList = await utilities.buildClassificationList(classification_id)
    const itemName = `${make} ${model}`
    req.flash("notice", "Sorry, the deleting failed.")
    res.status(501).render("inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    classificationList: classificationList,
    errors: null,
    inv_id,
    make,
    model,
    year,
    price,
    classification_id
    })
  }
}

module.exports = invCont
