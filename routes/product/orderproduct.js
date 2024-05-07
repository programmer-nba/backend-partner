const express = require('express');
const router = express.Router();
const orderproduct = require("../../controllers/product/orderproduct.controller")
const auth = require('../../authentication/Auth')

//สร้างออเดอร์ e-market
router.post('/',orderproduct.create);

//แสดงออเดอร์ e-market ทั้งหมด
router.get('/',orderproduct.getall);

//แสดงออเดอร์ e-market ตามไอดี
router.get('/byid/:id',orderproduct.getbyid);

//แสดงออเดอร์ e-market ตามไอดี partner
router.get('/bypartner/:id',orderproduct.getbyidpartner);

//แก้ไขออเดอร์ e-market ตามไอดี
router.put('/:id',orderproduct.update);

//ลบออเดอร์ e-market ตามไอดี
router.delete('/:id',orderproduct.delete);

// จัดส่งออเดอร์แล้ว
router.put('/delivery/:id',orderproduct.delivery);

// ยกเลิกออเดอร์
router.put('/cancel/:id',orderproduct.cancel);

module.exports = router;