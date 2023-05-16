const express = require("express");
const router = express.Router();

const verifyUserCredentials = require('../middleware/verifyUserCredentials');
const logger = require("../../logger");
const fs = require('fs');
const util = require('util');

const readFile = util.promisify(fs.readFile);

router.get("/", verifyUserCredentials, async (req, res) => {
  try {
    const [errorLogs, infoLogs, warnLogs] = await Promise.all([
        readFile('./logs/error.log', 'utf-8'),
        readFile('./logs/info.log', 'utf-8'),
        readFile('./logs/warn.log', 'utf-8')
    ]);


    const log = JSON.parse(infoLogs);
    const log2 = JSON.parse(errorLogs);
    const log3 = JSON.parse(warnLogs);
    console.log(log2);

    // res.json(logs);
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ error: 'An error occurred while fetching the logs' });
  }
});

module.exports = router;