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



//อัพเดทข้อมูลคำร้องขอฝากขายสินค้า
router.put('/:id',userAuth.partner, Requestproduct.update);
//ลบข้อมูลคำร้องขอฝากขายสินค้า
router.delete('/:id',userAuth.partner ,Requestproduct.delete);

//เพิ่มรูปภาพสินค้า
router.put('/image/:id',userAuth.partner,Requestproduct.addimgproduct);


//ของ office

// สร้าง token เพื่อต่อด้านนอก
router.post('/getpublictoken',Requestproduct.getpublictoken);

//ดึงข้อมูลคำร้องขอฝากขายสินค้า ที่รอการอนุมัติ
router.get('/waitapprove/',userAuth.public,Requestproduct.getbyapprove);

//อนุมัติคำร้องขอฝากขายสินค้า
router.put('/approve/:id', userAuth.public,Requestproduct.approve);
//ไม่อนุมัติคำร้องขอฝากขายสินค้า
router.put('/disapprove/:id',userAuth.public,Requestproduct.disapprove);

//เพิ่มรูปสินค้าย่อย
router.put('/subimage1/:id', userAuth.partner, Requestproduct.addsubimgproduct);
//เพิ่มรูปสินค้าย่อย2
router.put('/subimage2/:id', userAuth.partner, Requestproduct.addsubimgproduct2);
//เพิ่มรูปสินค้าย่อย3
router.put('/subimage3/:id', userAuth.partner, Requestproduct.addsubimgproduct3);

router.put('/imagedoc/:id', userAuth.partner, Requestproduct.addimagedoc);

//แก้ไขข้อมูลสินค้า ให้ office
router.put('/editproductbyoffice/:id',userAuth.public,Requestproduct.update);


module.exports = router;