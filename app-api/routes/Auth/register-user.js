const express = require("express");
const router = express("router");
const jwt = require("jsonwebtoken");

const createDBConnection = require("../mysql");
const {isAuthorized} = require('../middleware/authorization');

router.post("/")