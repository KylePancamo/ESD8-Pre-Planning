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
      console.log(process.env.MYSQL_DATABASE)
      throw err;
  }

  console.log("Connected to MySQL server.");
});


app.post('/api/insert-placed-marker', (req, res) => {
  const data = [
    req.body.position.lat.toFixed(8),
    req.body.position.lng.toFixed(8)
  ]
  const query = "INSERT INTO markers(marker_name, latitude, longitude, icon_id) VALUES ('Enter a new marker name', ?, ?, 10)"
  db.query(
    query, data, (err, result) => {
      if (err) {
        console.log(err.message)
      } else {
        const payload = {
          marker_id: result.insertId,
          marker_name: "Enter a new marker name",
          latitude: req.body.position.lat.toFixed(8),
          longitude: req.body.position.lng.toFixed(8),
          file_name: "/icon_images/edit_location_FILL0_wght400_GRAD0_opsz48.png",
        }
        result.payload = payload;
        res.status(200).send(result);
      }
    }
  )
});

app.post('/api/update-map-marker',  (req, res) => {
  let query = "UPDATE markers SET marker_name = ?, icon_id = ?, latitude = ?, longitude = ?, image = ? WHERE marker_id = ?"
  let file = req.files?.file;
  let data = [
    req.body.marker_name,
    req.body.icon_id,
    Number(req.body.latitude),
    Number(req.body.longitude),
    req.body.image_name ? req.body.image_name : null,
    req.body.marker_id,
  ]

  db.query(
    query, data, (err, result) => {
      if (err) {
        console.log(err.message)
      } else {
        if (file) {
          file.mv("./public/marker_images/" + file.name, (err) => {
            if (err) {
              console.log(err);
            }
          });
        }
        res.status(200).send(result);
      }
    }
  )
});


app.get('/api/fetch-placed-markers', (req, res) => {
  const query = `SELECT
                  markers.marker_id,
                  markers.marker_name,
                  markers.latitude,
                  markers.longitude,
                  markers.icon_id,
                  markers.image,
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

app.delete('/api/delete-all-markers', (req, res) => {
  const query = "TRUNCATE TABLE markers"

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

app.delete('/api/delete-selected-marker', (req, res) => {
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


app.post('/api/upload-icon', (req, res) => {
  let file = req.files.file;
  let iconName = req.body.iconName;
  if (file.mimetype !== 'image/png') {
    res.status(400).send({message: 'File must be a png image'});

    return;
  }

  if (fs.existsSync('./public/icon_images/' + file.name)) {
    res.status(400).send({message: 'File already exists'});

    return;
  }

  let filename = file.name;
  const data = [
    filename,
    iconName,
  ]
  const query = 'INSERT INTO icons (file_name, icon_name) VALUES (?, ?)';

  db.query(query, data, (err, result) => {
    if (err) {
      console.log(err.message);
      res.status(400).send({message: 'Error uploading file'});
    } else {
      file.mv('./public/icon_images/' + filename, (err) => {
        if (err) {
          console.log(err);
        } else {
          const payload = {
            icon_id: result.insertId,
            file_name: filename,
            icon_name: iconName,
          }
          res.status(200).send({message: 'File uploaded', payload: payload});
        }
      })
    }
  });
});

app.get('/api/get-uploaded-icons', (req, res) => {
  const query = 'SELECT * FROM icons';

  db.query(query, (err, result) => {
    if (err) {
      console.log(err.message);
    } else {
      res.status(200).send(result);
    }
  });
});

/*********SIDEBAR REQUESTS*********/

app.post('/api/get-sidebar-data', (req, res) => {
  let address = req.body.address;
  // splitup address with separator ','
  let addressArray = address.split(',');

  let occupancyaddress = addressArray[0].trim();
  console.log(occupancyaddress);
  let city = addressArray[1].trim();
  console.log(city);
  const query = `SELECT * FROM pre_planning WHERE occupancyaddress = ? AND occupancycity = ?`;
  const data = [
    occupancyaddress,
    city,
  ]

  db.query(
    query, data, (err, result) => {
      if (err) {
        console.log(err.message);
      } else {
        res.status(200).send(result);
      }
    }
  );
});

app.post("/api/add-preplanning-location", (req, res) => {
  const payload = req.body.payload;
  const query = `INSERT INTO pre_planning (occupancyname, mut_aid_helotesfd, mut_aid_d7fr, mut_aid_leonspringsvfd, mut_aid_bc2fd, occupancyaddress, occupancycity, occupancystate, occupancyzip, occupancycountry, constructiontype, 
                                           hazards, hydrant_address, hydrant_distance, access, electric_meter, breaker_box, water, gas_shutoff, emergency_contact_number, other_notes,
                                           occupancytype, contactname) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
  const data = [
    payload.occupancyName,
    parseInt(payload.mutual_aid1),
    parseInt(payload.mutual_aid2),
    parseInt(payload.mutual_aid3),
    parseInt(payload.mutual_aid4),
    payload.streetAddress,
    payload.city,
    payload.state,
    payload.zipCode,
    payload.country,
    parseInt(payload.constructionType),
    payload.hazards,
    payload.hydrantAddress,
    parseInt(payload.hydrantDistance),
    payload.accessInformation,
    payload.electricMeterLoc,
    payload.breakerBoxLoc,
    payload.waterLoc,
    payload.gasShutoffLoc,
    payload.emergencyContact,
    payload.notes,
    payload.occupancyType,
    payload.contactName
  ];

  db.query(
    `SELECT * FROM pre_planning WHERE occupancyaddress = ? AND occupancycity = ?`, [payload.streetAddress, payload.city], (err, result) => {
      if (err) {
        console.log(err.message);
      } else {
        if (result.length > 0) {
          res.status(409).send({status: "error", message: 'Location already exists'});
        } else {
          db.query(
            query, data, (err, result) => {
              if (err) {
                res.status(400).send({status: "error", message: "Error adding preplanning location", error: err.message});
              } else {
                res.status(200).send({status: "success", message: "Preplanning location added"});
              }
            }
          )
        }
      }
    }
  )
});

app.post("/api/update-preplanning-location", (req, res) => {
  const payload = req.body.payload;
  const id = req.body.id;
  console.log(payload);
  console.log(id);
  const query = `UPDATE pre_planning SET 
                  occupancyname = ?, mut_aid_helotesfd = ?, mut_aid_d7fr = ?, mut_aid_leonspringsvfd = ?, 
                  mut_aid_bc2fd = ?, occupancyaddress = ?, occupancycity = ?, occupancystate = ?, occupancyzip = ?,
                  occupancycountry = ?, constructiontype = ?, hazards = ?, hydrant_address = ?, 
                  hydrant_distance = ?, access = ?, electric_meter = ?, breaker_box = ?, water = ?, 
                  gas_shutoff = ?, emergency_contact_number = ?, other_notes = ?, occupancytype = ?, 
                  contactname = ? WHERE id = ?`;

  const data = [
    payload.occupancyName,
    parseInt(payload.mutual_aid1),
    parseInt(payload.mutual_aid2),
    parseInt(payload.mutual_aid3),
    parseInt(payload.mutual_aid4),
    payload.streetAddress,
    payload.city,
    payload.state,
    payload.zipCode,
    payload.country,
    parseInt(payload.constructionType),
    payload.hazards,
    payload.hydrantAddress,
    parseInt(payload.hydrantDistance),
    payload.accessInformation,
    payload.electricMeterLoc,
    payload.breakerBoxLoc,
    payload.waterLoc,
    payload.gasShutoffLoc,
    payload.emergencyContact,
    payload.notes,
    payload.occupancyType,
    payload.contactName,
    id
  ];

  db.query(query, data, (err, result) => {
    if (err) {
      res.status(400).send({status: "error", message: "Error updating preplanning location", error: err.message});
    } else {
      res.status(200).send({status: "success", message: "Preplanning location updated"});
    }
  })
});

app.get("/api/get-preplanning-locations", (req, res) => {
  const query = "SELECT * FROM pre_planning";

  db.query(
    query, (err, result) => {
      if (err) {
        console.log(err.message);
      } else {
        res.status(200).send(result);
      }
    }
  );
});

app.get("/api/get-preplanning-location/:id", (req, res) => {
  // grab id from url
  const id = req.params.id;
  db.query(
    `SELECT * FROM pre_planning WHERE id = ?`, [id], (err, result) => {
      if (err) {
        console.log(err.message);
      } else {
        res.status(200).send(result);
      }
    }
  )
});

app.post("/api/update-icon-name", (req, res) => {
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
})

/*********SIDEBAR REQUESTS*********/

const PORT = 5000;
// start express server on port 5000
app.listen(PORT, () => {
  console.log(`server started on http://localhost:${PORT} `);
});