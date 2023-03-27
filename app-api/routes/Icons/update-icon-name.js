const express = require("express");
const router = express.Router();

const createDBConnection = require("../mysql");
const verifyUserCredentials = require('../middleware/verifyUserCredentials');


router.post("/", verifyUserCredentials, (req, res) => {
    const db = createDBConnection(process.env.MYSQL_DATABASE);
    const id = req.body.id;
    const iconName = req.body.formData.iconName;
    const query = `UPDATE icons SET icon_name = ? WHERE icon_id = ?`;
  
    const data = [
      iconName,
      id
    ]
  
    db.query(query, data, (err, result) => {
      if (err) {
        res.status(400).send({status: "error", message: "Error updating icon name", error: err.message});
      } else {
        res.status(200).send({status: "success", message: "Icon name updated"});
      }
    })
});

module.exports = router;