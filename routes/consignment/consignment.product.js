const express = require('express');
const router = express.Router();
const consignment = require("../../controllers/consignment/consignment.product.controller")
const userAuth = require('../../authentication/Auth')

//เพิ่มสินค้า producttg
router.post('/', userAuth.partner, consignment.addProducttg);
// router.get('/', userAuth.partner, consignment.getCosignment);
router.get('/partner/:partnerid', userAuth.partner, consignment.getCosignmentByPartner);
router.put('/cancel/:id', userAuth.partner, consignment.cancel);

// ดึงข้อมูลสินค้า producttg by partnerid
router.get('/bypartner/:partnerid', userAuth.partner, consignment.getProducttg);

// แก้ไขข้อมูล producttg
router.put('/:id', userAuth.partner, consignment.editProducttg);

// ลบข้อมูล producttg
router.delete('/:id', userAuth.partner, consignment.deleteProducttg);

// ดึงหมวดหมู่สินค้า
router.get('/category', userAuth.partner, consignment.getCategory);

module.exports = router;