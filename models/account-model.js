const pool = require("../database/")

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
  try {
    const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
    console.log("SQL", sql);
    console.log("Values:", account_firstname, account_lastname, account_email, account_password)    
    return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password]);
  } catch (error) {
    console.log("Error:", error.message);
    return error.message
  }
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}

/* **********************
 *   Check for correct password to email
 * ********************* */
async function incorrectPassword(account_email, account_password){
  try {
    const sql = "SELECT * FROM account WHERE (account_email, account_password) = ($1, $2)"
    const email = await pool.query(sql, [account_email])
    const password = await pool.query(sql, [account_password])
    return email.rowCount, password.rowCount
  } catch (error) {
    return error.message
  }
}

module.exports = { registerAccount, checkExistingEmail, incorrectPassword }