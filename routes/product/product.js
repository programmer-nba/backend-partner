const express = require('express');
const router = express.Router();
const product = require("../../controllers/product/product.controller")
const userAuth = require('../../authentication/Auth')


//เพิ่มข้อมูลสินค้า
router.post('/',userAuth.partner,product.add);

//ดึงข้อมูลสินค้าทั้งหมด 
router.get('/',product.getall);
//ดึงข้อมูลสินค้าตามไอดี
router.get('/byid/:id',product.getbyid);
//ดึงข้อมูลสินค้าตาม dealer id
router.get('/bypartner/:id',product.getbypartner);

//ค้นหาสินค้าตามที่กรอกเข้ามา
router.get('/search/:name',product.search);

// //ดึงข้อมูลสินค้าแนะนำ
// router.get('/recommend/:id',product.getbycategory);

//แก้ไขข้อมูลสินค้า
router.put('/:id',userAuth.partner,product.edit);
//ลบข้อมูลสินค้า
router.delete('/:id',userAuth.partner,product.delete);
//เปิด-ปิดขายสินค้า
router.put('/status/:id',userAuth.partner,product.status);

//รูปสินค้า
router.put('/image/:id',userAuth.partner,product.addimgproduct);

// สร้าง token เพื่อต่อด้านนอก
router.post('/getpublictoken',product.getpublictoken);
// ดึงข้อมูลสินค้าทั้งหมด ที่เปิดขาย
router.get('/getshopproduct',userAuth.public,product.gettruestatus);


module.exports = router;