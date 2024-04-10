const express = require('express');
const router = express.Router();
const Productshop= require('../../controllers/shop/productshop.controller');
const userAuth = require('../../authentication/Auth');

//เพิ่มสินค้า
router.post('/', userAuth.partner, Productshop.add);
//ดึงข้อมูลสินค้าทั้งหมด
router.get('/',userAuth.all,Productshop.getall);
//ดึงข้อมูลสินค้า by id
router.get('/byid/:id',userAuth.all,Productshop.getbyid);
//ดึงข้อมูลสินค้า by shop_id
router.get('/byshopid/:id', userAuth.all,Productshop.getbyshopid);

//แก้ไขข้อมูลสินค้า
router.put('/:id',userAuth.partner, Productshop.edit);
//ลบข้อมูลสินค้า
router.delete('/:id',userAuth.partner ,Productshop.delete);
//เพิ่มรูปสินค้า
router.put('/image/:id', userAuth.partner, Productshop.addimgproduct);




//เปิด-ปิดสถานะสินค้า
router.put('/status/:id',userAuth.partner, Productshop.status);


//office
router.get('/office', userAuth.public, Productshop.getall);

//office by id
router.get('/office/byid/:id', userAuth.public, Productshop.getbyid);

//office by shop_id
router.get('/office/byshopid/:id', userAuth.public, Productshop.getbyshopid);

//แก้ไขข้อมูลสินค้า
router.put('/office/:id',userAuth.public, Productshop.edit);


module.exports = router;