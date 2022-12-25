const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const routes = require('./routes/routes');
var fileupload = require('express-fileupload');

app.use(fileupload());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

routes(app);

const PORT = 5000;
// start express server on port 5000
app.listen(PORT, () => {
  console.log(`server started on http://localhost:${PORT} `);
});