const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const errorController = {}

errorController.triggerError = (req, res, next) => {
    throw new Error('Internal error triggered');
  };

  errorController.errorHandler = async (err, res) => {
    let nav = await utilities.getNav()
    err.status = err.status || 500
    const image = `<img class="error" src="images/error_image.jpeg" alt="error image">`

    res.render("./error/error", {
        title: `${err.status} ${err.message}`,
        nav,
        image
    })
  };

module.exports = errorController
