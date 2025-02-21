const express = require('express')
const router = express.Router()
const accountController = require('../controllers/accountController')
const utilities = require('../utilities/index')

// Route to build account view
router.get('/login', utilities.handleErrors(accountController.buildLogin));

// Route to build registration view
router.get('/register', utilities.handleErrors(accountController.buildRegister));

// Route to save registration data to server
router.post('/register', utilities.handleErrors(accountController.registerAccount));

module.exports = router;