const express = require('express');
const router = express.Router();
const Requestshop= require('../../controllers/shop/requestshop.controller');
const userAuth = require('../../authentication/Auth');

//เพิ่มคำร้องขอฝากขายร้านค้า
router.post('/', userAuth.partner, Requestshop.add);
//ดึงข้อมูลคำร้องขอฝากขายร้านค้าทั้งหมด
router.get('/',userAuth.all,Requestshop.getAll);
//ดึงข้อมูลคำร้องขอฝากขายร้านค้า by id
router.get('/byid/:id',userAuth.all,Requestshop.getById);
//ดึงข้อมูลคำร้องขอฝากขายร้านค้า by partner_id
router.get('/bypartner/:id', userAuth.partner,Requestshop.getByPartnerId);



//อัพเดทข้อมูลคำร้องขอเปิดร้านค้า
router.put('/:id',userAuth.partner, Requestshop.update);
//ลบข้อมูลคำร้องขอเปิดร้านค้า
router.delete('/:id',userAuth.partner ,Requestshop.delete);



//ของ office

// สร้าง token เพื่อต่อด้านนอก
router.post('/getpublictoken',Requestshop.getpublictoken);

//ดึงข้อมูลคำร้องขอเปิดร้านค้า ที่รอการอนุมัติ
router.get('/waitapprove/',userAuth.public,Requestshop.getbyapprove);

//อนุมัติคำร้องขอเปิดร้านค้า
router.put('/approve/:id', userAuth.public,Requestshop.approve);
//ไม่อนุมัติคำร้องขอเปิดร้านค้า
router.put('/disapprove/:id',userAuth.public,Requestshop.disapprove);
//ดึงข้อมูลคำร้องขอเปิดร้านค้าทั้งหมด 
router.get('/getall/',userAuth.public,Requestshop.getAllpublic);


module.exports = router;