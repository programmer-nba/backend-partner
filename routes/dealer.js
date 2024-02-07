var express = require('express');
var router = express.Router();
const Auth = require('../authentication/Auth')
const Dealer = require('../controllers/dealer.controller')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");

router.post('/register',Dealer.adddealer);

router.get('/',Dealer.get);

module.exports = router;