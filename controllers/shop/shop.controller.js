const jwt = require("jsonwebtoken");
const {Shop} = require('../../models/shop/shop.schema');
const mongoose = require('mongoose');
const multer = require("multer");
const {
  uploadFileCreate,
  deleteFile,
} = require("../../functions/uploadfilecreate");


const storage = multer.diskStorage({
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname);
      //console.log(file.originalname);
    },
  });


//ดึงข้อมูลร้านค้าทั้งหมด 
module.exports.getall = async (req, res) => {
    try{
        const get = await Shop.find().populate({path:'shop_partner_id', select:'partner_name partner_company_name'});
        if(get){
            return res.status(200).json({message:"ดึงข้อมูลร้านค้าสำเร็จ",data:get,status:true});
        }else{
            return res.status(400).json({message:"ดึงข้อมูลร้านค้าไม่สำเร็จ",status:false});
        }
    }catch(error){
        return res.status(500).json({message:error.message, status: false});
    }
}


//ดึงข้อมูลร้านค้าตามไอดี
module.exports.getbyid = async (req, res) => {
    try{
        const get = await Shop.findById(req.params.id).populate({path: 'shop_partner_id', select: 'partner_name partner_company_name'});
        if(get){
            return res.status(200).json({message:"ดึงข้อมูลร้านค้าสำเร็จ",data:get,status:true});
        }else{
            return res.status(400).json({message:"ดึงข้อมูลร้านค้าไม่สำเร็จ",status:false});
        }
    }catch(error){
        return res.status(500).json({message:error.message, status: false});
    }
}

//แก้ไขข้อมูลร้านค้า
module.exports.edit = async (req, res) => {
    try{
            //เช็คว่ามีไอดีนี้หรือไม่
            const check = await Shop.findById(req.params.id);
            if(!check){
                return res.status(400).json({message:"ไม่พบข้อมูลร้านค้า",status:false});
            }
            
            const edit = await Shop.findByIdAndUpdate(req.params.id,{
                shop_name:req.body.shop_name,
                shop_type:req.body.shop_type,
                address:req.body.address,
                latitude :req.body.latitude, //ละติจูด
                longitude:req.body.longitude, //ลองจิจูด
                
                taxstatus:req.body.taxstatus, //ภาษี (true: มี , false: ไม่มี)
                nametax:req.body.nametax, //ชื่อผู้เสียภาษี
                taxid:req.body.taxid, //เลขประจำตัวผู้เสียภาษี
                addresstax:req.body.addresstax,
                shop_partner_id:req.body.shop_partner_id, //ไอดีคู่ค้า
            },{new:true});

            if(edit){
                return res.status(200).json({message:"แก้ไขร้านค้าสำเร็จ",data:edit,status:true});
            }else{
                return res.status(400).json({message:"แก้ไขร้านค้าไม่สำเร็จ",status:false});
            }
     
    }catch(error){
        return res.status(500).json({message:error.message, status: false});
    }
}


//ลบข้อมูลร้านค้า
module.exports.delete = async (req, res) => {
    try{
        const check = await Shop.findById(req.params.id);
        if(!check){
            return res.status(400).json({message:"ไม่พบข้อมูลร้านค้า",status:false});
        }
        const del = await Shop.findByIdAndDelete(req.params.id);
        return res.status(200).json({message:"ลบร้านค้าสำเร็จ",status:true});
    }catch(error){
        return res.status(500).json({message:error.message, status: false});
    }
}


//เปิด-ปิดขายร้านค้า
module.exports.status = async (req, res) => {
    try{
        const check = await Shop.findById(req.params.id);
        if(!check){
            return res.status(400).json({message:"ไม่พบข้อมูลร้านค้า",status:false});
        }
        const status = await Shop.findByIdAndUpdate(req.params.id,{shop_status:req.body.shop_status},{new:true});
        if(status){
            return res.status(200).json({message:"เปลี่ยนสถานะร้านค้าสำเร็จ",data:status,status:true});
        }else{
            return res.status(400).json({message:"เปลี่ยนสถานะร้านค้าไม่สำเร็จ",status:false});
        }
    }catch(error){
        return res.status(500).json({message:error.message, status: false});
    }
}

//ค้นหาตาม partner ตาม id
module.exports.getbypartner = async (req, res) => {
    try{
        const get = await Shop.find({shop_partner_id:req.params.id}).populate({path: 'shop_partner_id', select: 'partner_name partner_company_name'});
        if(get){
            return res.status(200).json({message:"ดึงข้อมูลร้านค้าสำเร็จ",data:get,status:true});
        }else{
            return res.status(400).json({message:"ดึงข้อมูลร้านค้าไม่สำเร็จ",status:false});
        }
    }catch(error){
        return res.status(500).json({message:error.message, status: false});
    }
}



//สร้าง token สำหรับการเข้าถึงข้อมูล
module.exports.getpublictoken = async (req, res) => {
    try{
        const typecode = req.body.typecode;
        let token 
        if(typecode =="shop")
        {
            token = jwt.sign({code:"shop",name:"shop",key:"shop_tossagun"},process.env.SHOP_SECRET_KET)
        }else if(typecode =="service")
        {
            token = jwt.sign({code:"service",name:"service",key:"service"},process.env.SHOP_SECRET_KET)

        }else if(typecode =="office")
        {
            token = jwt.sign({code:"office",name:"office",key:"office"},process.env.SHOP_SECRET_KET)
        }
        else if(typecode =="contract"){
            token = jwt.sign({code:"contract",name:"contract",key:"contract"},process.env.SHOP_SECRET_KET)
        }
        else
        {
            return res.status(400).json({message:"ไม่พบ typecode ที่ต้องการ",status:false});
        }
        return res.status(200).json({message:"สร้าง token สำเร็จ",data:token,status:true});
    }catch(error){
        return res.status(500).json({message:error.message, status: false});
    }
}
// ดึงข้อมูลร้านค้าทั้งหมด ที่เปิดขาย
module.exports.gettruestatus = async (req, res) => {
    try{
        const get = await Shop.find({shop_status:true}).populate({path: 'shop_partner_id', select: 'partner_name partner_company_name'});
        if(get){
            return res.status(200).json({message:"ดึงข้อมูลร้านค้าสำเร็จ",data:get,status:true});
        }else{
            return res.status(400).json({message:"ดึงข้อมูลร้านค้าไม่สำเร็จ",status:false});
        }
    }catch(error){
        return res.status(500).json({message:error.message, status: false});
    }
}


// ของ office

// ดึงข้อมูลร้านค้าทั้งหมด และสินค้าในร้านค้า
module.exports.getallshopproduct = async (req, res) => {
    try{
        //
        const get = await Shop.aggregate([
            
            {
                $lookup: {
                    from: 'productshops',
                    localField: '_id',
                    foreignField: 'shop_id',
                    as: 'products'
                }
            }
        ])

        
        if(get){
            return res.status(200).json({message:"ดึงข้อมูลร้านค้าสำเร็จ",data:get,status:true});
        }else{
            return res.status(400).json({message:"ดึงข้อมูลร้านค้าไม่สำเร็จ",status:false});
        }
    }catch(error){
        return res.status(500).json({message:error.message, status: false});
    }
}

// ดึงข้อมูลร้านค้าทั้งหมด และสินค้าในร้านค้า ตามไอดี
module.exports.getallshopproductbyid = async (req, res) => {
    try{
        //
        const get = await Shop.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(req.params.id) }
            },
            {
                $lookup: {
                    from: 'productshops',
                    localField: '_id',
                    foreignField: 'shop_id',
                    as: 'products'
                }
            }
        ]);

        
        if(get){
            return res.status(200).json({message:"ดึงข้อมูลร้านค้าสำเร็จ",data:get,status:true});
        }else{
            return res.status(400).json({message:"ดึงข้อมูลร้านค้าไม่สำเร็จ",status:false});
        }
    }catch(error){
        return res.status(500).json({message:error.message, status: false});
    }
}

//แก้ไขข้อมูลร้านค้า ให้ office
module.exports.editoffice = async (req, res) => {
    try{
            //เช็คว่ามีไอดีนี้หรือไม่
            const check = await Shop.findById(req.params.id);
            if(!check){
                return res.status(400).json({message:"ไม่พบข้อมูลร้านค้า",status:false});
            }
            
            const edit = await Shop.findByIdAndUpdate(req.params.id,{
                shop_name:req.body.shop_name,
                shop_type:req.body.shop_type,
                address:req.body.address,
                latitude :req.body.latitude, //ละติจูด
                longitude:req.body.longitude, //ลองจิจูด
                
                taxstatus:req.body.taxstatus, //ภาษี (true: มี , false: ไม่มี)
                nametax:req.body.nametax, //ชื่อผู้เสียภาษี
                taxid:req.body.taxid, //เลขประจำตัวผู้เสียภาษี
                addresstax:req.body.addresstax,
                shop_partner_id:req.body.shop_partner_id, //ไอดีคู่ค้า
            },{new:true});

            if(edit){
                return res.status(200).json({message:"แก้ไขร้านค้าสำเร็จ",data:edit,status:true});
            }else{
                return res.status(400).json({message:"แก้ไขร้านค้าไม่สำเร็จ",status:false});
            }
     
    }catch(error){
        return res.status(500).json({message:error.message, status: false});
    }
}


