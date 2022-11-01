const express = require('express');
const app = express();
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

var fs = require('fs');
var fileupload = require('express-fileupload');

app.use(fileupload());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
  const query = "INSERT INTO markers(marker_name, latitude, longitude, icon_id) VALUES ('test', ?, ?, 10)"
  db.query(
    query, data, (err, result) => {
      if (err) {
        console.log(err.message)
      } else {
        const payload = {
          marker_id: result.insertId,
          marker_name: "test",
          latitude: req.body.position.lat.toFixed(8),
          longitude: req.body.position.lng.toFixed(8),
          file_name: "/images/edit_location_FILL0_wght400_GRAD0_opsz48.png",
        }
        result.payload = payload;
        res.status(200).send(result);
      }
    }
  )
});

app.post('/api/updateMarker',  (req, res) => {
  const query = "UPDATE markers SET icon_id = ? WHERE marker_id = ?"
  const data = [
    req.body.data.icon_id,
    req.body.data.marker_id
  ]

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
  const query = `SELECT
                  markers.marker_id,
                  markers.marker_name,
                  markers.latitude,
                  markers.longitude,
                  icons.file_name
                FROM markers
                JOIN icons
                  ON markers.icon_id = icons.icon_id`;
  
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

app.delete('/api/deleteMarker', (req, res) => {
  const query = "DELETE FROM markers WHERE marker_id = ?"
  const data = [
    req.body.marker_id
  ]

  db.query(
    query, data,
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.status(200).send(result);
      }
    }
  )
})


app.post('/api/upload', (req, res) => {
  let file = req.files.file;
  if (file.mimetype !== 'image/png') {
    res.status(400).send({message: 'File must be a png image'});

    return;
  }

  if (fs.existsSync('./public/images/' + file.name)) {
    res.status(400).send({message: 'File already exists'});

    return;
  }

  let filename = file.name;
  const data = [
    filename,
  ]
  const query = 'INSERT INTO icons (file_name) VALUES (?)';

  db.query(query, data, (err, result) => {
    if (err) {
      console.log(err.message);
      res.status(400).send({message: 'Error uploading file'});
    } else {
      file.mv('./public/images/' + filename, (err) => {
        if (err) {
          console.log(err);
        } else {
          res.status(200).send({message: 'File uploaded'});
        }
      })
    }
  });
});

app.get('/api/getIcons', (req, res) => {
  const query = 'SELECT * FROM icons';

  db.query(query, (err, result) => {
    if (err) {
      console.log(err.message);
    } else {
      res.status(200).send(result);
    }
  });
});

const PORT = 5000;
// start express server on port 5000
app.listen(PORT, () => {
  console.log(`server started on http://localhost:${PORT} `);
});