var express = require('express');
var router = express.Router();
const Auth = require('../authentication/Auth')
const Partner = require('../controllers/partner.controller')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");

//สมัคร
router.post('/register',Partner.register)
router.post ('/login',Partner.login)
router.get("/me",Partner.me)
//ดึงข้อมูลทั้งหมด
router.get('/',Auth.all,Partner.getall)
//ดึงข้อมูล by id
router.get('/byid/:id',Auth.all,Partner.getbyid)
// แก้ไขข้อมูล partner 
router.put('/:id',Auth.all,Partner.edit)
// ลบข้อมูล partner
router.delete('/:id',Auth.all,Partner.delete)

router.put("/bankbook/:id",Auth.all,Partner.bankbook);
router.put("/idcard/:id",Auth.all,Partner.iden);
router.put("/signature/:id",Auth.all,Partner.signature);


/// ส่ง opt 
router.get("/sendotp/:id",Partner.sendotp);
router.put("/check/:id",Partner.check)
module.exports = router;