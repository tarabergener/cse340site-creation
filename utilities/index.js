const { buildByClassificationId } = require("../controllers/invController")
const invModel = require("../models/inventory-model")
const Util = {}
const { body, validationResult } = require("express-validator")
const validate = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the single view HTML
* ************************************ */
Util.buildSingleView = async function(data){
  let view = '';
      view += '<div class="car-container">';
      view += '<img src="' + data.inv_image + '" alt="Image of ' + data.inv_make + ' ' + data.inv_model + '">';
      view += '<ul class="car-details">';
      view += '<li><h2 class="price">Price: $' + Intl.NumberFormat('en-US').format(data.inv_price) + '</h2></li>';
      view += '<li class="description"><b>Description</b>: ' + data.inv_description + '</li>';
      view += '<li class="color"><b>Color</b>: ' + data.inv_color + '</li>';
      view += '<li class="miles"><b>Milage</b>: ' + Intl.NumberFormat('en-US').format(data.inv_miles) + '</li>';
      view += '</ul>';
      view += '</div>';

  return view
}

/* **************************************
* Build the Vehicle Management view
* ************************************ */
Util.buildManagementView = async function (req, res, next) {
  let manageView = '';
    manageView += '<ul>';
    manageView += '<li><a href="../../inv/add-classification" title="Add New Classification">Add New Classification</a></li>';
    manageView += '<li><a href="../../inv/add-vehicle" title="Add New Vehicle">Add New Vehicle</a></li>'

  return manageView
}

/* **************************************
* Dynamically update classification list
* ************************************ */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}

/* **************************************
* Build the Login Page view
* ************************************ */
//Util.buildLogin = async function(req, res, next){
//  let logView = '';
//    logView += '<form class="login-form" action="/account/login" method="post">';
//    logView += '<fieldset>'
//    logView += '<label for="account_email"><strong>Email Address:</strong></label><br>';
//    logView += '<input type="email" id="account_email" name="account_email" required><br>';
//    logView += '<label for="account_password"><strong>Password:</strong></label><br>';
//    logView += '<input type="password" id="account_password" name="account_password" required pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{12,}$"><br>';
//    logView += '<span>Passwords must be minimum of 12 characters and include 1 capital letter, 1 number and 1 special character.</span>';
//    logView += '<input type="button" value="Show Password"><br>';
//    logView += '<input type="submit" value="Login">';
//    logView += '<p>No account? <a href="../../account/register">Sign-up</a></p>'
//    logView += '</fieldset>'
//    logView += '</form>';
//
//  return logView
//}

/* **************************************
* Build the Registration Page view
* ************************************ */
//Util.buildRegister = async function(req, res, next){
  //const pswdbtn = 
  //document.querySelector("#pswdbtn");
  //pswdbtn.addEventListener("click",function() {
  //  const pswdInput = document.getElementById("account_password");
  //  const type = pswdInput.getAttribute("type");
  //  if (type == "password") {
  //    pswdInput.setAttribute("type", "text");
  //    pswdbtn.innerHTML = "Hide Password";
  //  } else {
  //    pswdInput.setAttribute("type", "password");
  //    pswdbtn.innerHTML = "Show Password";
  //  }
  //});
  //let regView = '';
  //  regView += '<div>';
  //  regView += '<p>ALL FIELDS ARE REQUIRED.</p>';
  //  regView += '<form class="register-form" action="/account/register" method="post">';
  //  regView += '<fieldset>';
  //  regView += '<label for="account_firstname"><strong>First Name:</strong></label><br>';
  //  regView += '<input type="text" id="account_firstname" name="account_firstname" required value="<%= locals.account_firstname %>"><br>';
  //  regView += '<label for="account_lastname"><strong>Last Name:</strong></label><br>';
  //  regView += '<input type="text" id="account_lastname" name="account_lastname" required value="<%= locals.account_lastname %>"><br>';
  //  regView += '<label for="account_email"><strong>Email Address:</strong></label><br>';
  //  regView += '<input type="email" id="account_email" name="account_email" required value="<%= locals.account_email %>" placeholder="Enter a valide email address"><br>';
  //  regView += '<label for="account_password"><strong>Password:</strong></label><br>';
  //  regView += '<input type="password" id="account_password" name="account_password" required pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{12,}$"><br>';
  //  regView += '<span>Passwords must be minimum of 12 characters and include 1 capital letter, 1 number and 1 special character.</span><br>';
  //  regView += '<span id="pswdbtn">Show Password</span><br>';
  //  regView += '<input type="submit" value="Register">';
  //  regView += '</fieldset>';
  //  regView += '</form>';
  //  regView += '</div>';
//
  //return regView
//}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util