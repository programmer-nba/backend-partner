const jwt = require("jsonwebtoken");
const {Requestshop}= require('../../models/shop/requestshop.schema');
const {Shop} = require('../../models/shop/shop.schema');
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


//เพิ่มคำร้องขอเปิดร้านค้า
module.exports.add = async (req, res) => {
    try{
        //request_status_detail
        const request_status_detail = {
            status:"รอการอนุมัติ",
            date:Date.now()
        }
        console.log(req.body.shop_type)
        const data = new Requestshop({
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
            
            request_status:false,
            request_status_detail:request_status_detail,

            shop_nameeng:req.body.shop_nameeng, //ชื่อภาษาอังกฤษ
            shop_telephone:req.body.shop_telephone, //เบอร์โทรติดต่อร้านค้า
            shop_idline:req.body.shop_idline, //ไอดีไลน์ร้านค้า
        });
        const add = await data.save();
        return res.status(200).json({ status:true,message: "คำร้องขอเปิดร้านค้าสำเร็จ",data: add });
    }catch(err){
        return res.status(500).json({ status:false,message: err.message });
    }

}

//ดึงข้อมูลคำร้องขอเปิดร้านค้าทั้งหมด
module.exports.getAll = async (req, res) => {
    try{
        const data = await Requestshop.find().populate({path: 'shop_partner_id', select: 'partner_name partner_company_name'});
        return res.status(200).json({ status:true,message: "ข้อมูลคำร้องขอเปิดร้านค้าทั้งหมด",data: data });
    }catch(err){
        return res.status(500).json({ status:false,message: err.message });
    }
}
//ดึงข้อมูลคำร้องขอเปิดร้านค้า by id
module.exports.getById = async (req, res) => {
    try{
        const data = await Requestshop.findById(req.params.id).populate({path: 'shop_partner_id', select: 'partner_name partner_company_name'});
        return res.status(200).json({ status:true,message: "ข้อมูลคำร้องขอเปิดร้านค้า",data: data });
    }catch(err){
        return res.status(500).json({ status:false,message: err.message });
    }
}

//ดึงข้อมูลคำร้องขอเปิดร้านค้า by partner_id
module.exports.getByPartnerId = async (req, res) => {
    try{
        const data = await Requestshop.find({shop_partner_id:req.params.id}).populate({path: 'shop_partner_id', select: 'partner_name partner_company_name'});
        return res.status(200).json({ status:true,message: "ข้อมูลคำร้องขอเปิดร้านค้า",data: data });
    }catch(err){
        return res.status(500).json({ status:false,message: err.message });
    }
}

//อัพเดทข้อมูลคำร้องขอเปิดร้านค้า
module.exports.update = async (req, res) => {
    try{
      
        const checrequest = await Requestshop.findById(req.params.id);
        if(checrequest){
            const data ={
                shop_name:req.body.shop_name,
                shop_type:req.body.shop_type,
                address:req.body.address,
                latitude :req.body.latitude, //ละติจูด
                longitude:req.body.longitude, //ลองจิจูด
            
                taxstatus:req.body.taxstatus, //ภาษี (true: มี , false: ไม่มี)
                nametax:req.body.nametax, //ชื่อผู้เสียภาษี
                taxid:req.body.taxid, //เลขประจำตัวผู้เสียภาษี
                addresstax:req.body.addresstax,

                shop_nameeng:req.body.shop_nameeng, //ชื่อภาษาอังกฤษ
                shop_telephone:req.body.shop_telephone, //เบอร์โทรติดต่อร้านค้า
                shop_idline:req.body.shop_idline, //ไอดีไลน์ร้านค้า
            }
           
            const edit = await Requestshop.findByIdAndUpdate(req.params.id,data,{new:true});
            return res.status(200).json({ status:true,message: "อัพเดทข้อมูลคำร้องขอเปิดร้านค้าสำเร็จ",data: edit });
        }
        return res.status(400).json({ status:false,message: "ไม่พบข้อมูลคำร้องขอเปิดร้านค้า" });
    }
    catch(err){
        return res.status(500).json({ status:false,message: err.message });
    }
}

//ลบข้อมูลคำร้องขอเปิดร้านค้า
module.exports.delete = async (req, res) => {
    try{
        const checkrequest = await Requestshop.findById(req.params.id);
        if(!checkrequest) return res.status(400).json({ status:false,message: "ไม่พบข้อมูลคำร้องขอเปิดร้านค้า" });
        const data = await Requestshop.findByIdAndDelete(req.params.id);
        return res.status(200).json({ status:true,message: "ลบข้อมูลคำร้องขอเปิดร้านค้าสำเร็จ",data: data });
    }catch(err){
        return res.status(500).json({ status:false,message: err.message });
    }
}

//อนุมัติคำร้องขอเปิดร้านค้า
module.exports.approve = async (req, res) => {
    try{
        const checkrequest = await Requestshop.findById(req.params.id);
        if(!checkrequest) return res.status(400).json({ status:false,message: "ไม่พบข้อมูลคำร้องขอเปิดร้านค้า" });
        
        //request_status_detail
        const request_status_detail = {
            status:"อนุมัติ",
            date:Date.now()
        }

        const office_id = req.body.office_id;
        const office_name = req.body.office_name;
        checkrequest.request_status_detail.push(request_status_detail);
        const data = await Requestshop.findByIdAndUpdate(req.params.id,{request_status:true,request_status_detail:checkrequest.request_status_detail,office_id:office_id,office_name:office_name},{new:true});
        // เพิ่มข้อมูลสินค้า จาก ข้อมูลฝากขายสินค้า
        const shop = new Shop({
            shop_name:data.shop_name,
            shop_type:data.shop_type,
            address:data.address,
            latitude :data.latitude, //ละติจูด
            longitude:data.longitude, //ลองจิจูด
            
            taxstatus:data.taxstatus, //ภาษี (true: มี , false: ไม่มี)
            nametax:data.nametax, //ชื่อผู้เสียภาษี
            taxid:data.taxid, //เลขประจำตัวผู้เสียภาษี
            addresstax:data.addresstax,
            shop_partner_id:data.shop_partner_id, //ไอดีคู่ค้า
            shop_status:true,
            shop_nameeng:data.shop_nameeng, //ชื่อภาษาอังกฤษ
            shop_telephone:data.shop_telephone, //เบอร์โทรติดต่อร้านค้า
            shop_idline:data.shop_idline, //ไอดีไลน์ร้านค้า
        });
        const add = await shop.save();
        if(data && add )
        {
            return res.status(200).json({ status:true,message: "อนุมัติคำร้องขอเปิดร้านค้าสำเร็จ",data: data });
        }else{
            return res.status(400).json({ status:false,message: "ไม่สามารถอนุมัติคำร้องขอเปิดร้านค้าได้" });
        }
        
    }catch(err){
        return res.status(500).json({ status:false,message: err.message });
    }
}

//ไม่อนุมัติคำร้องขอเปิดร้านค้า
module.exports.disapprove = async (req, res) => {
    try{
        const checkrequest = await Requestshop.findById(req.params.id);
        if(!checkrequest) return res.status(400).json({ status:false,message: "ไม่พบข้อมูลคำร้องขอเปิดร้านค้า" });
        //request_status_detail
        const request_status_detail = {
            status:"ไม่อนุมัติ",
            date:Date.now()
        }
        const office_id = req.body.office_id;
        const office_name = req.body.office_name;
        checkrequest.request_status_detail.push(request_status_detail);
        const data = await Requestshop.findByIdAndUpdate(req.params.id,{request_status:false,request_status_detail:checkrequest.request_status_detail,office_id:office_id,office_name:office_name},{new:true});
        return res.status(200).json({ status:true,message: "ไม่อนุมัติคำร้องขอเปิดร้านค้าสำเร็จ",data: data });
    }catch(err){
        return res.status(500).json({ status:false,message: err.message });
    }
}


module.exports.getbyapprove = async (req, res) => {
    try{
        
        const data = await Requestshop.find({request_status:false}).populate({path: 'shop_partner_id', select: 'partner_name partner_company_name'});
        const datafilter = data.filter((item) => item.request_status_detail[item.request_status_detail.length - 1].status === "รอการอนุมัติ");

        return res.status(200).json({ status:true,data: datafilter });
    }catch(err){
        return res.status(500).json({ status:false,message: err.message });
    }
}

//สร้าง token สำหรับการเข้าถึงข้อมูล
module.exports.getpublictoken = async (req, res) => {
    try{
        const typecode = req.body.typecode;
        let token 
        if(typecode =="office")
        {
            token = jwt.sign({code:"office",name:"office",key:"office"},process.env.SHOP_SECRET_KET)
        }
        else{
            return res.status(400).json({message:"ไม่พบ typecode ที่ต้องการ",status:false});
        }
        return res.status(200).json({message:"สร้าง token สำเร็จ",data:token,status:true});
    }catch(error){
        return res.status(500).json({message:error.message, status: false});
    }
}


//ดึงข้อมูลคำร้องขอเปิดร้านค้าทั้งหมด
module.exports.getAllpublic = async (req, res) => {
    try{
        const data = await Requestshop.find().populate({path: 'shop_partner_id', select: 'partner_name partner_company_name'});
        return res.status(200).json({ status:true,message: "ข้อมูลคำร้องขอเปิดร้านค้าทั้งหมด",data: data });
    }catch(err){
        return res.status(500).json({ status:false,message: err.message });
    }
}
