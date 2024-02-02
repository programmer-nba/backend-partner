const Partner = require('../models/partner.schema')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
//เรียกใช้ function เช็คชื่อซ้ำ

//สร้างไอดี Partner
module.exports.register = async (req, res) => {
    try {

        const checkusername = await Partner.findOne({username:req.body.username})
        if(checkusername)
        {
            res.status(409).send({status:false,message:"usernameนี้ใช้งานไม่ได้"});
        }        

        const data = new Partner({
            username: req.body.username,
            password: req.body.password,
            partner_name: req.body.partner_name,
            partner_address: req.body.partner_address,
            partner_phone: req.body.partner_phone,
            partner_status: false,
            partner_status_promiss: "รอตรวจสอบ",
            partner_bookbank: "", 
            partner_bookbank_name: req.body.partner_bookbank_name,
            partner_bookbank_number: req.body.partner_bookbank_number,
            partner_iden: "", // images
            partner_iden_number: req.body.partner_iden_number,
            partner_company_name: req.body.partner_company_name,
            partner_company_number: req.body.partner_company_number,
            partner_company_address: req.body.partner_company_address,
            signature:"",
        })
        const add = await data.save()
        res.status(200).send({status:true,message:"คุณได้สร้างไอดี Partner เรียบร้อย",data:add});
      } catch (error) {
        return res.status(500).send({status:false,error:error.message});
      }    
};

//login
module.exports.login = async (req,res) =>{
    try {

        if(req.body.username === undefined || req.body.username ==='')
        {
            return res.status(200).send({ status: false, message: "กรุณากรอก username" })
        }
        if(req.body.password === undefined || req.body.password ==='')
        {
            return res.status(200).send({ status: false, message: "กรุณากรอก password" })
        }

        const username = req.body.username
        const password = req.body.password
        
        //เช็คว่า user นี้มีในระบบไหม
        const login = await Partner.findOne({username:username})
        if(login)
        {
            //เช็ค password
            bcryptpassword = await bcrypt.compare(password,login.password)
            if(bcryptpassword)
            {
                //สร้าง signaturn
                const payload = {
                    _id:login._id,
                    username:login.username,
                    firstname:login.firstname,
                    lastname:login.lastname,
                    name:login.name,
                    position:login.position
                }
                const secretKey = process.env.SECRET_KEY
                const token = jwt.sign(payload,secretKey,{expiresIn:"10D"})
                return res.status(200).send({ status: true, data: payload, token: token})

            }else{
                return res.status(200).send({ status: false, message: "คุณกรอกรหัสไม่ถูกต้อง" })
            }
        }
        else{
            return res.status(200).send({ status: false, message: "ไม่มี user นี้ในระบบ" })
        }

       
    } catch(error){
        return res.status(500).send({status:false,error:error.message});
    }
}
//getme
module.exports.me  =async (req,res)=>{
    try{
        const token = req.headers['token'];
        if(!token){
            return res.status(403).send({status:false,message:'Not authorized'});
        }
        const decodded =jwt.verify(token,token,process.env.SECRET_KEY)
        const dataResponse = {
            _id:decodded._id,
            username:decodded.username,
            firstname:decodded.firstname,
            lastname:decodded.lastname,
            nickname:decodded.nickname,
            position:decodded.position
        }  
        return res.status(200).send({status:true,data:dataResponse});
    } catch(error){
        return res.status(500).send({status:false,error:error.message});
    }
}

//ดึงข้อมูลทั้งหมด
module.exports.getall = async (req,res) =>{
    try{    
        const partnerdata = await Partner.find()
        if(!partnerdata){
            return res.status(404).send({status:false,message:"ไม่มีข้อมูล"})
        }
        return res.status(200).send({status:true,data:partnerdata})
    }catch (error) {
        return res.status(500).send({status:false,error:error.message});
    }
}

//ดึงข้อมูล by id
module.exports.getbyid = async (req,res) =>{
    try{    
        const partnerdata = await Partner.findOne({_id:req.params.id})
        if(!partnerdata){
            return res.status(404).send({status:false,message:"ไม่มีข้อมูล"})
        }
        return res.status(200).send({status:true,data:partnerdata})
    }catch (error) {
        return res.status(500).send({status:false,error:error.message});
    }
}

//แก้ไขข้อมูล partner
module.exports.edit = async (req,res) =>{
    try{    
       
        const partner = await Partner.findOne({_id:req.params.id})
        if(!partner)
        {
            return res.status(404).send({status:false,message:"ไม่มีข้อมูล"})
        }
        const data ={
            username: req.body.username,
            password: req.body.password,
            partner_name: req.body.partner_name,
            partner_address: req.body.partner_address,
            partner_phone: req.body.partner_phone,
            partner_bookbank: "", 
            partner_bookbank_name: req.body.partner_bookbank_name,
            partner_bookbank_number: req.body.partner_bookbank_number,
            partner_iden: "", // images
            partner_iden_number: req.body.partner_iden_number,
            partner_company_name: req.body.partner_company_name,
            partner_company_number: req.body.partner_company_number,
            partner_company_address: req.body.partner_company_address,
            signature:"",
        }
        const edit = await Partner.findByIdAndUpdate(req.params.id,data,{new:true})
        return res.status(200).send({status:true,data:edit,message:"แก้ไขข้อมูลสำเร็จ"})
    }catch (error) {
        return res.status(500).send({status:false,error:error.message});
    }
}

//ลบข้อมูล partner
module.exports.delete = async (req,res) =>{
    try{    
        const partnerdata = await Partner.findOne({_id:req.params.id})
        if(!partnerdata){
            return res.status(200).send({status:false,message:"ไม่มีข้อมูล"})
        }
        const deletepartner = await Partner.findByIdAndDelete(req.params.id)
        return res.status(200).send({status:true,message:"ลบข้อมูลสำเร็จ",data:deletepartner})
    }catch (error) {
        return res.status(500).send({status:false,error:error.message});
    }
    
}


const multer = require("multer");
const {
  uploadFileCreate,
  deleteFile,
} = require("../functions/uploadfilecreate");

// เพิ่มรูปภาพธนาคาร
module.exports.bankbook = async (req, res) => {
    try {
      let upload = multer({ storage: storage }).array("image", 20);
      upload(req, res, async function (err) {
        const reqFiles = [];
        const result = [];
        if (err) {
          return res.status(500).send(err);
        }
        let image = '' // ตั้งตัวแปรรูป
        //ถ้ามีรูปให้ทำฟังก์ชั่นนี้ก่อน
        if (req.files) {
          const url = req.protocol + "://" + req.get("host");
          for (var i = 0; i < req.files.length; i++) {
            const src = await uploadFileCreate(req.files, res, { i, reqFiles });
            result.push(src);
          
            //   reqFiles.push(url + "/public/" + req.files[i].filename);
          }
  
          //ไฟล์รูป
          image = reqFiles[0]
        }
      
  
        const data = {
            partner_bookbank: image
        }
        const edit = await Partner.findByIdAndUpdate(req.params.id,data,{new:true})
        return res.status(200).send({status: true,message: "คุณได้รูปภาพเรียบร้อยแล้ว",data: edit});
      });
    } catch (error) {
      return res.status(500).send({ status: false, error: error.message });
    }
  };
// บัตรประจำตัวประชาชน
module.exports.iden = async (req, res) => {
    try {
      let upload = multer({ storage: storage }).array("image", 20);
      upload(req, res, async function (err) {
        const reqFiles = [];
        const result = [];
        if (err) {
          return res.status(500).send(err);
        }
        let image = '' // ตั้งตัวแปรรูป
        //ถ้ามีรูปให้ทำฟังก์ชั่นนี้ก่อน
        if (req.files) {
          const url = req.protocol + "://" + req.get("host");
          for (var i = 0; i < req.files.length; i++) {
            const src = await uploadFileCreate(req.files, res, { i, reqFiles });
            result.push(src);
          
            //   reqFiles.push(url + "/public/" + req.files[i].filename);
          }
  
          //ไฟล์รูป
          image = reqFiles[0]
        }
      
  
        const data = {
            partner_iden: image
        }
        const edit = await Partner.findByIdAndUpdate(req.params.id,data,{new:true})
        return res.status(200).send({status: true,message: "คุณได้รูปภาพเรียบร้อยแล้ว",data: edit});
      });
    } catch (error) {
      return res.status(500).send({ status: false, error: error.message });
    }
  };
// เพิ่มรูปภาพลายเซ็นต์ 
module.exports.iden = async (req, res) => {
    try {
      let upload = multer({ storage: storage }).array("image", 20);
      upload(req, res, async function (err) {
        const reqFiles = [];
        const result = [];
        if (err) {
          return res.status(500).send(err);
        }
        let image = '' // ตั้งตัวแปรรูป
        //ถ้ามีรูปให้ทำฟังก์ชั่นนี้ก่อน
        if (req.files) {
          const url = req.protocol + "://" + req.get("host");
          for (var i = 0; i < req.files.length; i++) {
            const src = await uploadFileCreate(req.files, res, { i, reqFiles });
            result.push(src);
          
            //   reqFiles.push(url + "/public/" + req.files[i].filename);
          }
  
          //ไฟล์รูป
          image = reqFiles[0]
        }
      
  
        const data = {
            signature: image
        }
        const edit = await Partner.findByIdAndUpdate(req.params.id,data,{new:true})
        return res.status(200).send({status: true,message: "คุณได้รูปภาพเรียบร้อยแล้ว",data: edit});
      });
    } catch (error) {
      return res.status(500).send({ status: false, error: error.message });
    }
  };