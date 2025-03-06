const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invController = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invController.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " Vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build inventory by single view
 * ************************** */
invController.buildByInventoryId = async function (req, res, next) {
  const inv_id = req.params.inventoryId
  const data = await invModel.getSingleByInventoryId(inv_id)
  const view = await utilities.buildSingleView(data)
  let nav = await utilities.getNav()
  const vehicleName = data.inv_year + " " + data.inv_make + " " + data.inv_model
  res.render("./inventory/single", {
    title: vehicleName,
    nav,
    view,
  })
}

/* ***************************
 *  Deliver management view
 * ************************** */
invController.buildManagementView = async function (req, res, next) {
  let nav = await utilities.getNav()
  let manageView = await utilities.buildManagementView()
  const classificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    manageView,
    errors: null,
    classificationSelect,
  })
}

/* ***************************
 *  Deliver add new classification view
 * ************************** */
invController.buildAddNewClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  //let newClassView = await utilities.newClassView()
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Process New Classification
* *************************************** */
invController.addNewClass = async function (req, res, next) {
  let nav = await utilities.getNav()
  let manageView = await utilities.buildManagementView()
  const { classification_name } = req.body

  const newClassResult = await invModel.addNewClass(
    classification_name,
  )

  if (newClassResult) {
    req.flash(
      "notice",
      `New classification successfully added.`
    )
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
      manageView,
      errors: null,
    })
  } else {
    req.flash("notice", `Sorry, add classification process failed. Try again.`)
    res.status(501).render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
    })
  }
}

/* ***************************
 *  Deliver Add New Vehicle view
 * ************************** */
invController.buildAddNewVehicle = async function (req, res, next) {
  let nav = await utilities.getNav()
  let classList = await utilities.buildClassificationList()
  res.render("./inventory/add-vehicle", {
    title: "Add New Vehicle",
    nav,
    classList,
    errors: null,
  })
}

/* ****************************************
*  Process New Vehcile
* *************************************** */
invController.addNewVehicle = async function (req, res, next) {
  let nav = await utilities.getNav()
  let manageView = await utilities.buildManagementView()
  let classList = await utilities.buildClassificationList()
  const { inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id } = req.body

  const newVehicleResult = await invModel.addNewVehicle(
    inv_make, 
    inv_model, 
    inv_description, 
    inv_image, 
    inv_thumbnail, 
    inv_price, 
    inv_year, 
    inv_miles, 
    inv_color, 
    classification_id,
  )

  if (newVehicleResult) {
    req.flash(
      "notice",
      `New vehicle successfully added.`
    )
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
      manageView,
      errors: null,
    })
  } else {
    req.flash("notice", `Sorry, add vehicle process failed. Try again.`)
    res.status(501).render("inventory/add-vehicle", {
      title: "Add New Vehicle",
      nav,
      classList,
      errors: null,
    })
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invController.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

module.exports = invController