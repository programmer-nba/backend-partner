const {Employeeshop} = require("../../models/shop/employeeshop.schema");
const bcrypt = require("bcryptjs");

// เพิ่มข้อมูลพนักงานร้าน
module.exports.add = async (req, res) => {
    try{
       //เช็คว่าusername ซ้ำหรือไม่
         const check = await Employeeshop.findOne({employee_username:req.body.employee_username});
            if(check){
                return res.status(409).json({message:"ชื่อผู้ใช้ซ้ำ",status:false});
            }
        //ทำการเพิ่มข้อมูลพนักงานร้าน
        const data = new Employeeshop({
            employee_shop_id: req.body.employee_shop_id, //ไอดีร้านค้า
            employee_name: req.body.employee_name, //ชื่อพนักงาน
            employee_username: req.body.employee_username, //ชื่อผู้ใช้พนักงาน
            employee_password: bcrypt.hashSync(req.body.employee_password, 10), //รหัสผ่านพนักงาน
            employee_phone: req.body.employee_phone, //เบอร์โทรพนักงาน
            employee_position: req.body.employee_position, //ตำแหน่งพนักงาน
        });
        const add = await data.save();
        if(add){
            return res.status(201).json({message:"เพิ่มข้อมูลพนักงานร้านสำเร็จ",status:true});
        }else{
            return res.status(500).json({message:"เพิ่มข้อมูลพนักงานร้านไม่สำเร็จ",status:false});
        }
    }catch(error)
    {
        return res.status(500).json({message:error.message, status: false});
    }

};  
//ดึงข้อมูลพนักงานร้านทั้งหมด
module.exports.getall = async (req, res) => {
    try{
        const get = await Employeeshop.find();
        if(get){
            return res.status(200).json({data:get,status:true});
        }else{
            return res.status(404).json({message:"ไม่พบข้อมูลพนักงานร้าน",status:false});
        }
    }catch(error){
        return res.status(500).json({message:error.message, status: false});
    }
};

//ดึงข้อมูลพนักงานร้านตามไอดี
module.exports.getbyid = async (req, res) => {
    try{
        const get = await Employeeshop.findById(req.params.id);
        if(get){
            return res.status(200).json({data:get,status:true});
        }else{
            return res.status(404).json({message:"ไม่พบข้อมูลพนักงานร้าน",status:false});
        }
    }catch(error){
        return res.status(500).json({message:error.message, status: false});
    }
};
//ดึงข้อมูลพนักงานร้านตาม shop_id
module.exports.getbyshopid = async (req, res) => {
    try{
        const get = await Employeeshop.find({employee_shop_id:req.params.id});
        if(get){
            return res.status(200).json({data:get,status:true});
        }else{
            return res.status(404).json({message:"ไม่พบข้อมูลพนักงานร้าน",status:false});
        }
    }catch(error){
        return res.status(500).json({message:error.message, status: false});
    }
};

//แก้ไขข้อมูลพนักงานร้าน
module.exports.edit = async (req, res) => {
    try{
        //เช็คว่า id นี้มีในระบบไหม
        const check = await Employeeshop.findById(req.params.id);
        if(!check){
            return res.status(404).json({message:"ไม่พบข้อมูลพนักงานร้าน",status:false});
        }
        //เช็คว่า username เหมือนกันไหม
        if(check.employee_username != req.body.employee_username){
            const check_username = await Employeeshop.findOne({employee_username:req.body.employee_username});
            if(check_username){
                return res.status(409).json({message:"ชื่อผู้ใช้ซ้ำ",status:false});
            }
        }
        const data = {
            employee_shop_id: req.body.employee_shop_id, //ไอดีร้านค้า
            employee_name: req.body.employee_name, //ชื่อพนักงาน
            employee_username: req.body.employee_username, //ชื่อผู้ใช้พนักงาน
            employee_password: bcrypt.hashSync(req.body.employee_password, 10), //รหัสผ่านพนักงาน
            employee_phone: req.body.employee_phone, //เบอร์โทรพนักงาน
            employee_position: req.body.employee_position, //ตำแหน่งพนักงาน
        };
        const edit = await Employeeshop.findByIdAndUpdate(req.params.id, data, {useFindAndModify: false});
        if(edit){
            return res.status(200).json({message:"แก้ไขข้อมูลพนักงานร้านสำเร็จ",status:true});
        }else{
            return res.status(500).json({message:"แก้ไขข้อมูลพนักงานร้านไม่สำเร็จ",status:false});
        }
    }catch(error){
        return res.status(500).json({message:error.message, status: false});
    }
};

//ลบข้อมูลพนักงานร้าน
module.exports.delete = async (req, res) => {
    try{
        //เช็คว่า id นี้มีในระบบไหม
        const check = await Employeeshop.findById(req.params.id);
        if(!check){
            return res.status(404).json({message:"ไม่พบข้อมูลพนักงานร้าน",status:false});
        }
        const del = await Employeeshop.findByIdAndDelete(req.params.id, {useFindAndModify: false});
        if(del){
            return res.status(200).json({message:"ลบข้อมูลพนักงานร้านสำเร็จ",status:true});
        }else{
            return res.status(500).json({message:"ลบข้อมูลพนักงานร้านไม่สำเร็จ",status:false});
        }
    }catch(error){
        return res.status(500).json({message:error.message, status: false});
    }
};

