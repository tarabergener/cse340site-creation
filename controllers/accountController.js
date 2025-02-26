const utilities = require("../utilities/index")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    //let logView = await utilities.buildLogin()
    res.render("account/login", {
        title: "Login",
        nav,
        //logView,
        errors: null,
    })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    //let regView = await utilities.buildRegister()
    res.render("account/register", {
        title: "Register",
        nav,
        //regView,
        errors: null,
    })
}

/* ****************************************
*  Process Login
* *************************************** */
async function loginAccount(req, res) {
  let nav = await utilities.getNav()
  //let loginView = await utilities.logView()
  const { account_firstname, account_email, account_password } = req.body

  const regResult = await accountModel.loginAccount(
    account_firstname,
    account_email,
    account_password
  )

  if (regResult) {
    req.flash(
      "notice",
      `Welcome, you\'re logged in ${account_firstname}.`
    )
    res.status(201).render("/", {
      title: "Home",
      nav,
    })
  } else {
    req.flash("notice", `Sorry, the login failed.`)
    res.status(501).render("account/login", {
      title: "Login",
      nav,
      //loginView,
    })
  }
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  //let logView = await utilities.buildLogin()
  //let regView = await utilities.buildRegister()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      //logView,
      errors: null,
    })
  } else {
    req.flash("notice", `Sorry, the registration failed.`)
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      //regView,
      errors: null,
    })
  }
}

module.exports = { buildLogin, buildRegister, registerAccount, loginAccount };