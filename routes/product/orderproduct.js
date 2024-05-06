const express = require('express');
const router = express.Router();
const orderproduct = require("../../controllers/product/orderproduct.controller")
const auth = require('../../authentication/Auth')

router.post('/',orderproduct.create);


module.exports = router;