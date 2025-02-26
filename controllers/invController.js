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
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    manageView,
    errors: null,
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
  const classification_name = req.body

  const newClassResult = await accountModel.registerAccount(
    classification_name,
  )

  if (newClassResult) {
    req.flash(
      "notice",
      `New classification successfully added.`
    )
    res.status(201).render("inv/", {
      title: "Vehicle Management",
      nav,
      manageView,
      errors: null,
    })
  } else {
    req.flash("notice", `Sorry, add classification process failed. Try again.`)
    res.status(501).render("inv/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
    })
  }
}

/* ***************************
 *  Build add new inventory view
 * ************************** */

module.exports = invController