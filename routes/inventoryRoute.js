// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/index")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory by single view
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId));

// Route to build Vehicle Management view to add classifications and inventory
router.get("/", utilities.handleErrors(invController.buildManagementView));

// Route to build Add New Classification view
router.get("/add-classification", utilities.handleErrors(invController.buildAddNewClassification))

module.exports = router;