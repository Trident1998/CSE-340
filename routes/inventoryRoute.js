// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const regValidate = require('../utilities/inventory-validation')
const checkAuthority = require('../utilities/check-authority')

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory by classification view
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildIventoryDeetailsByInventoryId));

router.get("/edit/:inventoryId", checkAuthority, utilities.handleErrors(invController.buildEditIventoryDeetailsByInventoryId));

router.post("/update", checkAuthority, invController.updateInventory)

router.get("/delete/:inventoryId", checkAuthority, invController.buildDeleteIventoryDeetailsByInventoryId)

router.post("/delete", checkAuthority, invController.deleteInventory)

router.get("/", checkAuthority, utilities.handleErrors(invController.buildManagement));

router.get("/add-classification", checkAuthority, utilities.handleErrors(invController.showAddClassification));

router.get("/getInventory/:classification_id", checkAuthority, utilities.handleErrors(invController.getInventoryJSON))

router.get("/get-unproved-classifications", checkAuthority, utilities.handleErrors(invController.getUnaprovedClassificationsJSON))

router.get("/get-unproved-inventory", checkAuthority, utilities.handleErrors(invController.getUnaprovedInventoryJSON))

router.get("/classification-approve/:classification_id", checkAuthority, utilities.handleErrors(invController.approveClassification))

router.get("/classification-reject/:classification_id", checkAuthority, utilities.handleErrors(invController.rejectClassification))

router.get("/inventory-review/:inventoryId", checkAuthority, utilities.handleErrors(invController.reviewInventory))

router.post(
    "/inventory-review", 
    utilities.handleErrors(invController.doActionForInventoryReview));

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