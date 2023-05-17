const express = require("express");
const router = express.Router();

const verifyUserCredentials = require('../middleware/verifyUserCredentials');
const logger = require("../../logger");
const fs = require('fs');
const readline = require('readline');
const path = require('path');


const readFileLineByLine = async (filePath) => {
  const fileStream = fs.createReadStream(filePath);

  const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
  });

  const array = [];

  for await (const line of rl) {
    const fileJSON = JSON.parse(line);
    // keep only level, message and timestamp in fileJSON object. Remove everything else
    let { level, message, timestamp } = fileJSON;
    const newObj = { level, message, timestamp };
    array.push(newObj);
  }

  return array;
};

router.get("/", verifyUserCredentials, async (req, res) => {
  try {
    const infoLogs = await readFileLineByLine(path.join(__dirname, "../../logs/info.log"));

    res.status(200).send({ status: "success", logs: infoLogs });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ error: 'An error occurred while fetching the logs' });
  }
});

module.exports = router;