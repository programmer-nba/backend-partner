const express = require('express');
const router = express.Router();
const Requestproduct= require('../../controllers/product/requestproduct.controller');
const userAuth = require('../../authentication/Auth');

//เพิ่มคำร้องขอฝากขายสินค้า
router.post('/', userAuth.partner, Requestproduct.add);
//ดึงข้อมูลคำร้องขอฝากขายสินค้าทั้งหมด
router.get('/',Requestproduct.getAll);
//ดึงข้อมูลคำร้องขอฝากขายสินค้า by id
router.get('/byid/:id', Requestproduct.getById);
//ดึงข้อมูลคำร้องขอฝากขายสินค้า by partner_id
router.get('/bypartner/:id', userAuth.partner,Requestproduct.getByPartnerId);

//ดึงข้อมูลคำร้องขอฝากขายสินค้า ที่รอการอนุมัติ
router.get('/waitapprove/',Requestproduct.getbyapprove);


//อัพเดทข้อมูลคำร้องขอฝากขายสินค้า
router.put('/:id',userAuth.partner, Requestproduct.update);
//ลบข้อมูลคำร้องขอฝากขายสินค้า
router.delete('/:id',userAuth.partner ,Requestproduct.delete);

//เพิ่มรูปภาพสินค้า
router.put('/image/:id',userAuth.partner,Requestproduct.addimgproduct);

//อนุมัติคำร้องขอฝากขายสินค้า
router.put('/approve/:id', Requestproduct.approve);
//ไม่อนุมัติคำร้องขอฝากขายสินค้า
router.put('/disapprove/:id',Requestproduct.disapprove);

module.exports = router;