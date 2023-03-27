const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const routes = require('./routes/routes');
var fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);



app.use(fileupload());
app.use(cors({
  origin: ["http://localhost:3000"],
  credentials: true,
}));



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const options = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'root',
  database: 'auth',
  schema: {
    tableName: 'sessions',
    columnNames: {
      session_id: 'session_id',
      expires: 'expires',
      data: 'data'
    }
  }
};

const sessionStore = new MySQLStore(options);


app.use(session({
  name: "sid",
  secret: process.env.SECRET_KEY_SESSION,
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24, // 24 hours
  },
}));

routes(app);



const PORT = 5000;
// start express server on port 5000
app.listen(PORT, () => {
  console.log(`server started on http://localhost:${PORT} `);
});