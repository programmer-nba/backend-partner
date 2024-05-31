var express = require('express');
var router = express.Router();
const Auth = require('../authentication/Auth')
const Contract = require('../controllers/contract.controller')

// ดึงสัญญาตาม partner_id
router.get('/getcontractbypartnerid/:id', Auth.partner, Contract.getcontractbypartnerid)


//ดึงสัญญาตามประเภทมาแสดง
router.get('/getcontractbycode/:id', Auth.partner, Contract.getcontractbycode)
//ยอมรับสัญญา เข้าใช้งานระบบ partner
router.put('/acceptcontractpartner/:id', Auth.partner, Contract.acceptcontractpartner)

// ยอมรับสัญญาเข้าใช้งานระบบ  emakert
router.put('/acceptcontractemakert/:id', Auth.partner, Contract.acceptcontractemakert)

// ยอมรับสัญญาเข้าใช้งานระบบ  pospartner
router.put('/acceptcontractpospartner/:id', Auth.partner, Contract.acceptcontractpospartner)

// ยอมรับสัญญาเข้าใช้งานระบบ  onestopservice
router.put('/acceptcontractonestopservice/:id', Auth.partner, Contract.acceptcontractonestopservice)

// ยอมรับสัญญาเข้าใช้งานระบบ  onestopshop
router.put('/acceptcontractonestopshop/:id', Auth.partner, Contract.acceptcontractonestopshop)


module.exports = router;