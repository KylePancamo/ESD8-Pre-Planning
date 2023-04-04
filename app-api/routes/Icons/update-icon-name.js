const express = require("express");
const router = express.Router();

const getPool = require("../mysql");
const verifyUserCredentials = require('../middleware/verifyUserCredentials');
const logger = require("../../logger");


router.post("/", verifyUserCredentials, (req, res) => {
    const db = getPool(process.env.MYSQL_DATABASE);
    const id = req.body.id;
    const iconName = req.body.formData.iconName;
    const query = `UPDATE icons SET icon_name = ? WHERE icon_id = ?`;
  
    const data = [
      iconName,
      id
    ]
  
    db.query(query, data, (err, result) => {
      if (err) {
        logger.warn(`Error updating icon name for icon ${id}`, {
          error: `${err.message, err.stack}`
        });
        res.status(400).send({status: "error", message: "Error updating icon name", error: err.message});
      } else {
        res.status(200).send({status: "success", message: "Icon name updated"});
      }
    })
});

module.exports = router;