const express = require('express');
const router = express.Router();
const userAuth = require('../../authentication/Auth');
const Posshop = require('../../controllers/shop/posshop.controller');

// สร้างออเดอร์ pos 
router.post('/', userAuth.partner, Posshop.create);

// แสดงข้อมูลออเดอร์ pos ทั้งหมด
router.get('/',userAuth.all, Posshop.findAll);

// แสดงข้อมูลออเดอร์ pos ตามรหัสออเดอร์
router.get('/byid/:id',userAuth.all, Posshop.findOne);

//แสดงออเดอร์ pos ตามร้านค้า
router.get('/byshop/:id', userAuth.partner, Posshop.findShop);

//แสดงออเดอร์ pos ตามร้านค้า แต่รอออเดอร์
router.get('/waitorder/:id', userAuth.partner, Posshop.findShopWait);

//แสดงออเดอร์ pos ตามร้านค้า แต่ออเดอร์สำเร็จ
router.get('/successorder/:id', userAuth.partner, Posshop.findShopSuccess);

//แสดงออเดอร์ pos ตามร้านค้า แต่ยกเลิกออเดอร์
router.get('/cancelorder/:id', userAuth.partner, Posshop.findShopCancel);

//เปลี่ยนสถานะ เป็น ออเดอร์สำเร็จ
router.put('/success/:id', userAuth.partner, Posshop.success);
//เปลี่ยนสถานะ เป็น ยกเลิกออเดอร์
router.put('/cancel/:id', userAuth.partner, Posshop.cancel);

module.exports = router;