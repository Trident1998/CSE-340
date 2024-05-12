const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const errorController = {}

errorController.triggerError = (req, res, next) => {
    try {
      // Intentionally causing an error to trigger 500-type error
      throw new Error('Internal error triggered');
    } catch (err) {
      next(err);
    }
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
