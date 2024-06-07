const jwt = require("jsonwebtoken");
const {Productshop} = require('../../models/shop/productshop.schema');
const multer = require("multer");
const {
  uploadFileCreate,
  deleteFile,
} = require("../../functions/uploadfilecreate");


const fs = require('fs');
const path = require('path');

const uploadFolder = path.join(__dirname, '../../assets/image/pospartner');
fs.mkdirSync(uploadFolder, { recursive: true });

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadFolder);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
        console.log(file.originalname);
    },
});

const deleteimage = (filePath) => {
   
    const fullPath = path.join(__dirname, '..', filePath);
    fs.access(fullPath, fs.constants.F_OK, (err) => {
      if (!err) {
        fs.unlink(fullPath, (unlinkErr) => {
          if (unlinkErr) {
            console.error(`Failed to delete file: ${filePath}`, unlinkErr);
          } else {
            console.log(`Successfully deleted file: ${filePath}`);
          }
        });
      } else {
        console.log(`File not found: ${filePath}`);
      }
    });
};

//เพิ่มสินค้า
module.exports.add = async (req, res) => {
    try{
        const data = new Productshop({
            productshop_name: req.body.productshop_name, //ชื่อสินค้า
            productshop_barcode: req.body.productshop_barcode, //บาร์โค้ดสินค้า
            productshop_price: req.body.productshop_price, //ราคาสินค้า
            productshop_unit: req.body.productshop_unit, //หน่วยสินค้า
            shop_id:req.body.shop_id, //ไอดีร้านค้า
        });
        const add = await data.save();
        return res.status(200).json({message:"เพิ่มสินค้าสำเร็จ",data:add,status:true});
    }catch(error){
        return res.status(500).json({message:error.message, status: false});
    }
}

//ดึงข้อมูลสินค้าทั้งหมด
module.exports.getall = async (req, res) => {
    try{
        const get = await Productshop.find().populate({path:'shop_id', select:'shop_name'});
        if(get){
            return res.status(200).json({message:"ดึงข้อมูลสินค้าสำเร็จ",data:get,status:true});
        }else{
            return res.status(400).json({message:"ดึงข้อมูลสินค้าไม่สำเร็จ",status:false});
        }
    }catch(error){
        return res.status(500).json({message:error.message, status: false});
    }
}
//ดึงข้อมูลสินค้า by id
module.exports.getbyid = async (req, res) => {
    try{
        const get = await Productshop.findById(req.params.id).populate({path: 'shop_id', select: 'shop_name'});
        if(get){
            return res.status(200).json({message:"ดึงข้อมูลสินค้าสำเร็จ",data:get,status:true});
        }else{
            return res.status(400).json({message:"ดึงข้อมูลสินค้าไม่สำเร็จ",status:false});
        }
    }catch(error){
        return res.status(500).json({message:error.message, status: false});
    }
}

//ดึงข้อมูลสินค้า by shop_id
module.exports.getbyshopid = async (req, res) => {
    try{
        const get = await Productshop.find({shop_id:req.params.id}).populate({path: 'shop_id', select: 'shop_name'});
        if(get){
            return res.status(200).json({message:"ดึงข้อมูลสินค้าสำเร็จ",data:get,status:true});
        }else{
            return res.status(400).json({message:"ดึงข้อมูลสินค้าไม่สำเร็จ",status:false});
        }
    }catch(error){
        return res.status(500).json({message:error.message, status: false});
    }
}

//แก้ไขข้อมูลสินค้า
module.exports.edit = async (req, res) => {
    try{
        const edit = await Productshop.findByIdAndUpdate(req.params.id,{
            productshop_name: req.body.productshop_name, //ชื่อสินค้า
            productshop_barcode: req.body.productshop_barcode, //บาร์โค้ดสินค้า
            productshop_price: req.body.productshop_price, //ราคาสินค้า
            productshop_unit: req.body.productshop_unit, //หน่วยสินค้า
            shop_id:req.body.shop_id, //ไอดีร้านค้า
        },{new:true});
        if(edit){
            return res.status(200).json({message:"แก้ไขสินค้าสำเร็จ",data:edit,status:true});
        }else{
            return res.status(400).json({message:"แก้ไขสินค้าไม่สำเร็จ",status:false});
        }
    }catch(error){
        return res.status(500).json({message:error.message, status: false});
    }
}

//ลบข้อมูลสินค้า
module.exports.delete = async (req, res) => {
    try{
        const check = await Productshop.findById(req.params.id);
        if(!check){
            return res.status(400).json({message:"ไม่พบข้อมูลสินค้า",status:false});
        }
        const del = await Productshop.findByIdAndDelete(req.params.id);
        return res.status(200).json({message:"ลบสินค้าสำเร็จ",status:true});
    }catch(error){
        return res.status(500).json({message:error.message, status: false});
    }
}


//เพิ่มรูปสินค้า
module.exports.addimgproduct = async (req, res) => {
    try{
    let upload = multer({ storage: storage }).array("image", 20);
    upload(req, res, async function (err) {
        console.log(req.files)
        const reqFiles = [];
        const result = [];
        if (err) {
            return res.status(500).send(err);
        }
        let image = '' // ตั้งตัวแปรรูป
        //ถ้ามีรูปให้ทำฟังก์ชั่นนี้ก่อน
        if (req.files) {
            const url = '/assets/image/emarket/';
            const reqFiles = [];
      
            req.files.forEach(file => {
              reqFiles.push(url + file.filename);
            });
      
            image = reqFiles[0];
      
            const product = await Productshop.findById(req.params.id);
            if (product.productshop_image!= '')
            {
                deleteimage(product.productshop_image);
            }
          } else {
            return res.json({
              message: "not found any files",
              status: false
            })
          }
        const data = { productshop_image: image }
        const edit = await Productshop.findByIdAndUpdate(req.params.id, data, { new: true })
        return res.status(200).send({ status: true, message: "เพิ่มรูปภาพเรียบร้อย", data: edit });
    });
    } catch (error) {
        return res.status(500).send({ status: false, error: error.message });
    }

};

//เปิด-ปิด สถานะสินค้า
module.exports.status = async (req, res) => {
    try{
        const check = await Productshop.findById(req.params.id);
        if(!check){
            return res.status(400).json({message:"ไม่พบข้อมูลสินค้า",status:false});
        }
        const status = await Productshop.findByIdAndUpdate(req.params.id,{productshop_status:req.body.productshop_status},{new:true});
        if(status){
            return res.status(200).json({message:"เปลี่ยนสถานะสินค้าสำเร็จ",data:status,status:true});
        }else{
            return res.status(400).json({message:"เปลี่ยนสถานะสินค้าไม่สำเร็จ",status:false});
        }
    }catch(error){
        return res.status(500).json({message:error.message, status: false});
    }
}


