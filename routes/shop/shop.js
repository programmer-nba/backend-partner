const express = require('express');
const router = express.Router();
const Shop = require('../../controllers/shop/shop.controller');
const userAuth = require('../../authentication/Auth');

//ดึงข้อมูลร้านค้าทั้งหมด 
router.get('/',Shop.getall);
//ดึงข้อมูลร้านค้าตามไอดี
router.get('/byid/:id',Shop.getbyid);
//ดึงข้อมูลร้านค้าตาม partner id
router.get('/bypartner/:id',Shop.getbypartner);


//แก้ไขข้อมูลร้านค้า
router.put('/:id',userAuth.partner,Shop.edit);
//ลบข้อมูลร้านค้า
router.delete('/:id',userAuth.partner,Shop.delete);
//เปิด-ปิดขายร้านค้า
router.put('/status/:id',userAuth.partner,Shop.status);


// สร้าง token เพื่อต่อด้านนอก
router.post('/getpublictoken',Shop.getpublictoken);
// ดึงข้อมูลร้านค้าทั้งหมด ที่เปิด
router.get('/getshop',userAuth.public,Shop.gettruestatus);
//ดึงข้อมูลร้านค้าทั้งหมด
router.get('/getshop/getall',userAuth.public,Shop.getall);
//by id
router.get('/getshop/byid/:id',userAuth.public,Shop.getbyid);



module.exports = router;