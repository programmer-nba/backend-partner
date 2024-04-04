var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cor = require('cors')
require('dotenv').config()
const mongoose = require('mongoose')

process.env.TZ = 'UTC'
var app = express();
//เชื่ิอมdatabase
const urldatabase = process.env.ATLAS_MONGODB
mongoose.Promise = global.Promise
mongoose.connect(urldatabase).then(() => console.log("connect")).catch((err) => console.error(err))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cor())
//router
const prefix = '/v1/Backend-Partner'
app.use(prefix + '/', require('./routes/index'));
//ข้อมูล admin
app.use(prefix + '/partner', require('./routes/partner'));
//ข้อมูลคู่ค้า
app.use(prefix + '/dealer', require('./routes/dealer'));

//ฝากขายสินค้า
app.use(prefix + '/requestproduct', require('./routes/product/requestproduct'));
//ข้อมูลสินค้า
app.use(prefix + '/product', require('./routes/product/product'));

//ข้อมูลร้านค้า
app.use(prefix + '/shop', require('./routes/shop/shop'));
//คำร้องขอเปิดร้านค้า
app.use(prefix + '/requestshop', require('./routes/shop/requestshop'));
//ข้อมูลสินค้าร้านค้า
app.use(prefix + '/productshop', require('./routes/shop/productshop'));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // หรือกำหนด origin ที่เฉพาะเจาะจง
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
const port = process.env.PORT || 9998;
app.listen(port, console.log(`Listening on port ${port}`));
