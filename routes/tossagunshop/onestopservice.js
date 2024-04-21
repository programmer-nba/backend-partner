var express = require('express');
var router = express.Router();
const Auth = require('../../authentication/Auth')
const OneStopService = require('../../controllers/tossagunshop/onestopservice.controller')

//สร้างร้านค้า
router.post('/', Auth.partner, OneStopService.createShop);

//ดึงข้อมูลร้านค้า
router.get('/bypartner/:partnerid', Auth.partner, OneStopService.getShop);

//ดึงข้อมูลร้านค้าตาม id
router.get('/byid/:id', Auth.partner, OneStopService.getShopById);

//แก้ไขข้อมูลร้านค้า
router.put('/:id', Auth.partner, OneStopService.editShop);

//ลบข้อมูลร้านค้า
router.delete('/:id', Auth.partner, OneStopService.deleteShop);

//สร้างพนักงาน
router.post('/employee', Auth.partner, OneStopService.createShopEmployee);

//ดึงข้อมูลพนักงาน ตาม shopid
router.get('/employee/shop/:shopid', Auth.partner, OneStopService.getShopEmployee);

// //ดึงข้อมูลพนักงานตาม id
// router.get('/employee/:id', Auth.partner, OneStopService.getShopEmployeeById);

//แก้ไขข้อมูลพนักงาน
router.put('/employee/:id', Auth.partner, OneStopService.editShopEmployee);

//ลบข้อมูลพนักงาน
router.delete('/employee/:id', Auth.partner, OneStopService.deleteShopEmployee);

module.exports = router;