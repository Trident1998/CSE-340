// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const regValidate = require('../utilities/inventory-validation')

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory by classification view
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildIventoryDeetailsByInventoryId));

router.get("/edit/:inventoryId", utilities.handleErrors(invController.buildEditIventoryDeetailsByInventoryId));

router.post("/update", invController.updateInventory)

router.get("/delete/:inventoryId", invController.buildDeleteIventoryDeetailsByInventoryId)

router.post("/delete", invController.deleteInventory)

router.get("/", utilities.handleErrors(invController.buildManagement));

router.get("/add-classification", utilities.handleErrors(invController.showAddClassification));

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

router.post(
    "/add-classification", 
    regValidate.classificationRules(),
    regValidate.checkClassificationData,
    utilities.handleErrors(invController.addClassification));

router.get("/add-inventory", utilities.handleErrors(invController.showAddInventory));

router.post(
    "/add-inventory",
    regValidate.invemtoryRules(),
    regValidate.checkInventoryData,
     utilities.handleErrors(invController.addInventory)
    );

module.exports = router;