const express = require("express");
const router = express.Router();

const getPool = require("../mysql");
const verifyUserCredentials = require('../middleware/verifyUserCredentials');
const { canDelete } = require('../middleware/authorization');
const fs = require("fs");
const logger = require("../../logger");


router.post("/", verifyUserCredentials, canDelete, (req, res) => {
    const db = getPool(process.env.MYSQL_ESD8_DATABASE);


    try { 
        const icon = req.body.selectedIcon;
        const iconId = icon.icon_id;
        if (iconId === 1) {
            logger.error(`Error: Cannot delete default icon`);
            res.status(400).json({ status: "error", message: `Cannot delete default icon` });
            return
        }

        const sql = `DELETE FROM icons WHERE icon_id = ?`;
        db.query(sql, [iconId], (err, result) => {
            if (err) {
                logger.error(`Error: ${err.message}`);
                res.status(400).send({ error: err.message });
                return
            }

            if (fs.existsSync("../app-ui/public/icon_images/" + icon.icon_name)) {
                fs.unlinkSync("../app-ui/public/icon_images/" + icon.icon_name);
            }

            logger.info(`Icon deleted: ${iconId}`);
            res.status(200).send({ status: "success",message: `Icon deleted: ${iconId}` });
        });
    } catch (err) {
        logger.error(`Error: ${err.message}`);
        res.status(400).json({ status: "error", message: err.message });
    }
});

module.exports = router;