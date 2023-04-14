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
  origin: ["http://20.242.84.130"],
  methods: "GET, POST, DELETE",
  credentials: true,
}));



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


const options = {
  host: process.env.MYSQL_HOST_NAME,
  port: 3306,
  user: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_ROOT_PASSWORD,
  database: process.env.MYSQL_AUTH_DATABASE,
  schema: {
    tableName: 'sessions',
    columnNames: {
      session_id: 'session_id',
      expires: 'expires',
      data: 'data'
    }
  },
  clearExpired: true,
  checkExpirationInterval: 90000,
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
  console.log(`server started on http://20.242.84.130:${PORT} `);
});
