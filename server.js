const express = require('express');
const app = express();
const mysql = require('mysql2');
require('dotenv').config()

app.use(express.json());

const db = mysql.createConnection({
  user: process.env.MYSQL_USERNAME,
  host: process.env.MYSQL_HOST_NAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

db.connect((err) => {
  if (err) {
      console.log("\x1b[41m", "MySQL Connection Error:")
      throw err;
  }

  console.log("Connected to MySQL server.");
});

app.get('/test', (req, res) => {
  res.status(200).send('Hello World!');
});

app.post('/api/dbtest', (req, res) => {
  db.query('SELECT * FROM locations', (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.status(200).send(result);
    }
  });
});

app.post('/test/:id', (req, res) => {
  const {id} = req.params;
  const {name} = req.body;

  res.send(`Hello ${name}! Your id is ${id}`);
});

const PORT = 5000;
// start express server on port 5000
app.listen(PORT, () => {
  console.log(`server started on http://localhost:${PORT} `);
})