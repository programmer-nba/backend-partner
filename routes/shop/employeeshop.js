const express = require('express');
const router = express.Router();
const userAuth = require('../../authentication/Auth');
const Employeeshop = require('../../controllers/shop/employeeshop.controller');

// เพิ่มข้อมูลพนักงานร้าน
router.post('/', userAuth.partner, Employeeshop.add);

//ดึงข้อมูลพนักงานร้านทั้งหมด
router.get('/',userAuth.all, Employeeshop.getall);

//ดึงข้อมูลพนักงานร้านตามไอดี
router.get('/byid/:id',userAuth.all, Employeeshop.getbyid);

//ดึงข้อมูลพนักงานร้านตาม shop_id
router.get('/byshop/:id', userAuth.partner, Employeeshop.getbyshopid);

//แก้ไขข้อมูลพนักงานร้าน
router.put('/:id', userAuth.partner, Employeeshop.edit);

//ลบข้อมูลพนักงานร้าน
router.delete('/:id', userAuth.partner, Employeeshop.delete);

module.exports = router;