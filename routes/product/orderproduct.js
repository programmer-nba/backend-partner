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

router.get('/bycustomer/:customer_id',orderproduct.getbyidcustomer);

//แก้ไขออเดอร์ e-market ตามไอดี
router.put('/:id',orderproduct.update);

//ลบออเดอร์ e-market ตามไอดี
router.delete('/:id',orderproduct.delete);

// จัดส่งออเดอร์ตามไอดีแล้ว
router.put('/updatetracking/:id',orderproduct.updateTracking);

// จัดส่งออเดอร์ตามสถานะแล้ว
router.put('/delivery/:id',orderproduct.delivery);

// รับสินค้าแล้ว
router.put('/receive/:id',orderproduct.receive);

// ยกเลิกออเดอร์
router.put('/cancel/:id',orderproduct.cancel);

// อัพโหลดสลิป
router.put('/addslippayment/:id',orderproduct.addSlippayment);

//ยอดขาย
router.put('/report/:partner_id', auth.partner, orderproduct.report);

router.put("/report/export/:partner_id", auth.partner, orderproduct.exportReportToExcel);

module.exports = router;