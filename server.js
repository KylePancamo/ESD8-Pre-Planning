const express = require('express');
const app = express();
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config()

app.use(cors());
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


app.post('/api/setMarkerInfo', (req, res) => {
  const data = [
    req.body.position.lat.toFixed(8),
    req.body.position.lng.toFixed(8)
  ]
  const query = "INSERT INTO markers(marker_name, latitude, longitude) VALUES ('test', ?, ?) "
  db.query(
    query, data, (err, result) => {
      if (err) {
        console.log(err.message)
      } else {
        res.status(200).send(result);
      }
    }
  )
});

app.get('/api/getMarkerInfo', (req, res) => {
  const query = "SELECT * FROM markers"
  
  db.query(
    query, 
    (err, result) => {
      if (err) {
        console.log(err.message)
      } else {
        console.log(result);
        res.status(200).send(result);
      }
    }
  )
});

app.delete('/api/deleteMarkers', (req, res) => {
  const query = "DELETE FROM markers"

  db.query(
    query,
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.status(200).send(result);
      }
    }
  )
})

const PORT = 5000;
// start express server on port 5000
app.listen(PORT, () => {
  console.log(`server started on http://localhost:${PORT} `);
})