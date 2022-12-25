const express = require("express");
const router = express.Router();

const db = require("../mysql");

router.post("/", (req, res) => {
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