const express = require('express')
const router = express.Router()
const accountController = require('../controllers/accountController')
const utilities = require('../utilities/index')
const validate = require('../utilities/account-validation')

// Route to build account view
router.get('/login', utilities.handleErrors(accountController.buildLogin));

// Route to build registration view
router.get('/register', utilities.handleErrors(accountController.buildRegister));

// Route for processing registration without validation, just posts ALL inputs
//router.post('/register', utilities.handleErrors(accountController.registerAccount));

// Process the registration data
router.post(
    '/register',
    validate.registrationRules(),
    validate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
);

// Process the login attempt
router.post(
    '/login',
    validate.loginRules(),
    validate.checkLoginData,
    utilities.handleErrors(accountController.loginAccount)
  );

module.exports = router;