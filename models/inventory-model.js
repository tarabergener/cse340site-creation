const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* ***************************
 *  Get single inventory item and details by inv_id
 * ************************** */
async function getSingleByInventoryId(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory
      WHERE inv_id = $1`,
      [inv_id]
    )
    return data.rows[0]
  } catch (error) {
    console.error("getvehiclesbyid error " + error)
  }
}

/* *****************************
*   Add new vehicle classification
* *************************** */
async function addNewClass(classification_name){
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
    console.log("SQL", sql);
    console.log("Values:", classification_name)    
    return await pool.query(sql, [classification_name]);
  } catch (error) {
    console.log("Error:", error.message);
    return error.message
  }
}

/* **********************
 *   Check for existing classification
 * ********************* */
async function checkExistingClass(classification_name){
  try {
    const sql = "SELECT * FROM classification WHERE classification_name = $1"
    const className = await pool.query(sql, [classification_name])
    return className.rowCount
  } catch (error) {
    return error.message
  }
}

module.exports = {
  getClassifications, 
  getInventoryByClassificationId, 
  getSingleByInventoryId, 
  addNewClass, 
  checkExistingClass, 
};