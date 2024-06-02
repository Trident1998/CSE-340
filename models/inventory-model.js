const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query(`
  SELECT DISTINCT cl.classification_name, cl.classification_id
FROM classification cl
JOIN inventory inv
    ON cl.classification_id = inv.classification_id
WHERE cl.classification_approved = true AND inv.inv_approved = true
ORDER BY cl.classification_name;`)
}

async function getApprovedClassifications(){
  return await pool.query(`
  SELECT DISTINCT cl.classification_name, cl.classification_id
FROM classification cl
WHERE cl.classification_approved = true
ORDER BY cl.classification_name;`)
}

/* ***************************
 *  Add classification data
 * ************************** */
async function addClassification(classification_name){
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
    return await pool.query(sql, [classification_name])
  } catch (error) {
    console.error("addClassification error " + error)
  }
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
      WHERE i.classification_id = $1 AND inv_approved = true`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getInventoryByClassificationId error " + error)
  }
}

/* ***************************
 *  Get all Unaproved Classifications
 * ************************** */
async function getUnaprovedClassifications() {
  try {
    const data = await pool.query(
      `SELECT cl.classification_id, 
              cl.classification_name
      FROM classification AS cl
      WHERE cl.classification_approved = false`
    )
    return data.rows
  } catch (error) {
    console.error("getUnaprovedClassifications error " + error)
  }
}

/* ***************************
 *  Get all Unaproved Inventory
 * ************************** */
async function getUnaprovedInventory() {
  try {
    const data = await pool.query(
      `SELECT cl.classification_name, 
              inv.inv_id,
              inv.inv_make,
              inv.inv_model,
              inv.inv_year
    FROM inventory inv
    JOIN classification cl	
    ON cl.classification_id = inv.classification_id 
    WHERE inv_approved = false
    ORDER BY classification_name, inv.inv_make, inv.inv_model, inv.inv_year;`
    )
    return data.rows
  } catch (error) {
    console.error("getUnaprovedInventory error " + error)
  }
}

/* ***************************
 *  Aspprove Classification
 * ************************** */
async function approveClassification(classification_id) {
  try {
    const data = await pool.query(
      `UPDATE public.classification SET classification_approved = true, classification_approval_date = NOW()
      WHERE classification_id = $1 
      RETURNING *`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("approveClassification error " + error)
  }
}

/* ***************************
 *  Reject Classification
 * ************************** */
async function rejectClassification(classification_id) {
  try {
    const data = await pool.query(
      `DELETE FROM public.classification WHERE classification_id = $1 RETURNING *`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("approveClassification error " + error)
  }
}
/* ***************************
 *  Aspprove Invantory
 * ************************** */
async function approveInvantory(inventoryId) {
  try {
    const data = await pool.query(
      `UPDATE public.inventory SET inv_approved = true, inv_approved_date = NOW()
      WHERE inv_id = $1 
      RETURNING *`,
      [inventoryId]
    )
    return data.rows
  } catch (error) {
    console.error("approveClassification error " + error)
  }
}

/* ***************************
 *  Reject Invantory
 * ************************** */
async function rejectInvantory(inventoryId) {
  try {
    const data = await pool.query(
      `DELETE FROM public.inventory WHERE inv_id = $1 RETURNING *`,
      [inventoryId]
    )
    return data.rows
  } catch (error) {
    console.error("approveClassification error " + error)
  }
}

/* ***************************
 *  Add inventory data
 * ************************** */
async function addInventory(classification_id, make, model, year, description, image_path, 
  thumbnail_path, price, miles, color){
  try {
    const sql = `INSERT INTO inventory (
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    )
   VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`
    return await pool.query(sql, [make, model, year, description, image_path, 
      thumbnail_path, price, miles, color, classification_id])
  } catch (error) {
    return error.message
  }
}

/* ***************************
 *  Get all inventory deteils by inv_id
 * ************************** */
async function getInventoryByInnventoryId(inv_id, inv_approved = true) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory
      WHERE inv_id = $1 AND inv_approved = $2`,
      [inv_id, inv_approved]
    )
    return data.rows[0]
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(
  inv_id,
  inv_make,
  inv_model,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_year,
  inv_miles,
  inv_color,
  classification_id
) {
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
    const data = await pool.query(sql, [
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
      inv_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

/* ***************************
 *  Delete Inventory Data
 * ************************** */
async function deleteInventory(inv_id) {
  try {
    const sql =
      "DELETE FROM public.inventory WHERE inv_id = $1 RETURNING *"
    const data = await pool.query(sql, [inv_id])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}


module.exports = {getClassifications, 
                  getApprovedClassifications,
                  getInventoryByClassificationId, 
                  getInventoryByInnventoryId, 
                  addClassification,
                  addInventory,
                  updateInventory,
                  deleteInventory,
                  getUnaprovedClassifications, 
                  getUnaprovedInventory,
                  approveClassification,
                  rejectClassification,
                  approveInvantory,
                  rejectInvantory
                };
