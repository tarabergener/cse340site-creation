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
 *   Return account data using email address
 * ********************* */
async function getAccountByEmail(account_email){
  try {
    const result = await pool.query(
      "SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1",
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

/* **********************
 *   Return account data using email address
 * ********************* */
async function getAccountById(account_id){
  try {
    const data = await pool.query(
      "SELECT account_id, account_firstname, account_lastname, account_email, account_password FROM account WHERE account_id = $1",
      [account_id])
    return data.rows[0]
  } catch (error) {
    return new Error("No matching account information found")
  }
}

/* *****************************
*   Update account information
* *************************** */
async function updateAccount(
  account_id,
  account_firstname,
  account_lastname,
  account_email,
) {
  try {
    const sql = `UPDATE public.account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *`
    console.log("SQL", sql);
    console.log("Values:", account_id, account_firstname, account_lastname, account_email)
    const data = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_id,
    ])
    return data.rows[0]
  } catch (error) {
    console.log("Error: " + error);
  }
}

/* *****************************
*   Update password
* *************************** */
async function updatePassword(account_password){
  try {
    const sql = `UPDATE public.account SET account_password = $1 WHERE account_id = $ RETURNING *`
    console.log("SQL", sql);
    console.log("Values:", account_password)    
    return await pool.query(sql, [account_password]);
  } catch (error) {
    console.log("Error:", error.message);
    return error.message
  }
}

module.exports = { 
  registerAccount, 
  checkExistingEmail, 
  getAccountByEmail,
  getAccountById, 
  updateAccount,
}