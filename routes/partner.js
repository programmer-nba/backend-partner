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
router.get('/',Partner.getall)
//ดึงข้อมูล by id
router.get('/byid/:id',Partner.getbyid)
// แก้ไขข้อมูล partner 
router.put('/:id',Auth.all,Partner.edit)
// ลบข้อมูล partner
router.delete('/:id',Auth.all,Partner.delete)

router.put("/accept/:id",Partner.accept);




router.put("/idcard/:id",Auth.all,Partner.iden);
router.put("/filecompany/:id",Auth.all,Partner.filecompany);
router.put("/logo/:id",Auth.all,Partner.logo);

/// ส่ง opt 
router.get("/sendotp/:id",Partner.sendotp);
router.put("/check/:id",Partner.check)
module.exports = router;