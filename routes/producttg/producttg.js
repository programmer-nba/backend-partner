const express = require('express');
const router = express.Router();
const producttg = require("../../controllers/producttg/producttg.controller")
const userAuth = require('../../authentication/Auth')

//เพิ่มสินค้า producttg
router.post('/',userAuth.partner,producttg.addProducttg);
// ดึงข้อมูลสินค้า producttg by partnerid
router.get('/bypartner/:partnerid',userAuth.partner,producttg.getProducttg);

// แก้ไขข้อมูล producttg
router.put('/:id',userAuth.partner,producttg.editProducttg);

// ลบข้อมูล producttg
router.delete('/:id',userAuth.partner,producttg.deleteProducttg);

// ดึงหมวดหมู่สินค้า
router.get('/category',userAuth.partner,producttg.getCategory);

module.exports = router;