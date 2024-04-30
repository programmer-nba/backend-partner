const {Posorder} = require('../../models/shop/posorder.schema');

// สร้างออเดอร์ pos 
exports.create = async (req, res) => {
    try {
        const posorder = new Posorder({...req.body,pos_ref:await runreferralcode(),
            pos_status:[{status:"รอออเดอร์",date:Date.now()}]});
        const add =  await posorder.save();
        if(add){
            return res.status(201).send({data:posorder,status:true,message:"เพิม่ข้อมูลสำเร็จ"});
        }else{
            return res.status(400).send({data:null,status:false,message:"เพิ่มข้อมูลไม่สำเร็จ"});
        }
    } catch (error) {
        return res.status(500).send({status:false,message:error.message});
    }
};


// แสดงข้อมูลออเดอร์ pos ทั้งหมด
exports.findAll = async (req, res) => {
    try {
       
        const posorder = await Posorder.find();
        if(posorder){
            return res.status(200).send({data:posorder,status:true,message:"แสดงข้อมูลสำเร็จ"});
        }else{
            return res.status(404).send({data:null,status:false,message:"ไม่พบข้อมูล"});
        }
    } catch (error) {
        return res.status(500).send({status:false,message:error.message});
    }
};


// แสดงข้อมูลออเดอร์ pos ตามรหัสออเดอร์
exports.findOne = async (req, res) => {
    try {
        const posorder = await Posorder.findById(req.params.id);
        if(posorder){
            return res.status(200).send({data:posorder,status:true,message:"แสดงข้อมูลสำเร็จ"});
        }else{
            return res.status(404).send({data:null,status:false,message:"ไม่พบข้อมูล"});
        }
    } catch (error) {
        return res.status(500).send({status:false,message:error.message});
    }
};

//แสดงออเดอร์ pos ตามร้านค้า
exports.findShop = async (req, res) => {
    try {
        const posorder = await Posorder.find({shop_id:req.params.id});
        if(posorder){
            return res.status(200).send({data:posorder,status:true,message:"แสดงข้อมูลสำเร็จ"});
        }else{
            return res.status(404).send({data:null,status:false,message:"ไม่พบข้อมูล"});
        }
    } catch (error) {
        return res.status(500).send({status:false,message:error.message});
    }
};
//แสดงออเดอร์ pos ตามร้านค้า แต่รอออเดอร์
exports.findShopWait = async (req, res) => {
    try {
         //ค้นหาข้อมูล ตามร้านค้า และ สถานะรอออเดอร์เป็นตำแหน่งสุดท้าย array ที่เป็น รอออเดอร์
         
        const posorder = await Posorder.find({shop_id:req.params.id});
        if(!posorder){
            return res.status(404).send({data:null,status:false,message:"ไม่พบข้อมูล"});
        }
        const posorderwait = posorder.filter((item) => item.pos_status[item.pos_status.length - 1].status == "รอออเดอร์");
        if(posorderwait){
            return res.status(200).send({data:posorderwait,status:true,message:"แสดงข้อมูลสำเร็จ"});
        }else{
            return res.status(404).send({data:null,status:false,message:"ไม่พบข้อมูล"});
        }
    } catch (error) {
        return res.status(500).send({status:false,message:error.message});
    }
};

//แสดงออเดอร์ pos ตามร้านค้า แต่ออเดอร์สำเร็จ
exports.findShopSuccess = async (req, res) => {
    try {
        //ค้นหาข้อมูล ตามร้านค้า และ สถานะรอออเดอร์เป็นตำแหน่งสุดท้าย array ที่เป็น ออเดอร์สำเร็จ
        const posorder = await Posorder.find({shop_id:req.params.id});
        if(!posorder){
            return res.status(404).send({data:null,status:false,message:"ไม่พบข้อมูล"});
        }
        const posordersuccess = posorder.filter((item) => item.pos_status[item.pos_status.length - 1].status == "ออเดอร์สำเร็จ");
        if(posordersuccess){
            return res.status(200).send({data:posordersuccess,status:true,message:"แสดงข้อมูลสำเร็จ"});
        }else{
            return res.status(404).send({data:null,status:false,message:"ไม่พบข้อมูล"});
        }
    } catch (error) {
        return res.status(500).send({status:false,message:error.message});
    }
};

//แสดงออเดอร์ pos ตามร้านค้า แต่ยกเลิกออเดอร์
exports.findShopCancel = async (req, res) => {
    try {
        //ค้นหาข้อมูล ตามร้านค้า และ สถานะรอออเดอร์เป็นตำแหน่งสุดท้าย array ที่เป็น ยกเลิก
        const posorder = await Posorder.find({shop_id:req.params.id});
        if(!posorder){
            return res.status(404).send({data:null,status:false,message:"ไม่พบข้อมูล"});
        }
        const posordercancel = posorder.filter((item) => item.pos_status[item.pos_status.length - 1].status == "ยกเลิก");
        if(posordercancel){
            return res.status(200).send({data:posordercancel,status:true,message:"แสดงข้อมูลสำเร็จ"});
        }
        else{
            return res.status(404).send({data:null,status:false,message:"ไม่พบข้อมูล"});
        }
    } catch (error) {
        return res.status(500).send({status:false,message:error.message});
    }
};


//เปลี่ยนสถานะ เป็น ออเดอร์สำเร็จ
exports.success = async (req, res) => {
    try{
        const posorder = await Posorder.findById(req.params.id);
        if(!posorder){
            return res.status(404).send({data:null,status:false,message:"ไม่พบข้อมูล"});
        }
        posorder.pos_status.push({status:"ออเดอร์สำเร็จ",date:Date.now()});
        const update = await posorder.save();
        if(update){
            return res.status(200).send({data:update,status:true,message:"แก้ไขข้อมูลสำเร็จ"});
        }else{
            return res.status(400).send({data:null,status:false,message:"แก้ไขข้อมูลไม่สำเร็จ"});
        }
    }catch(error){
        return res.status(500).send({status:false,message:error.message});
    }
}
//เปลี่ยนสถานะ เป็น ยกเลิกออเดอร์
exports.cancel = async (req, res) => {
    try{
        const posorder = await Posorder.findById(req.params.id);
        if(!posorder){
            return res.status(404).send({data:null,status:false,message:"ไม่พบข้อมูล"});
        }
        posorder.pos_status.push({status:"ยกเลิก",date:Date.now()});
        const update = await posorder.save();
        if(update){
            return res.status(200).send({data:update,status:true,message:"แก้ไขข้อมูลสำเร็จ"});
        }else{
            return res.status(400).send({data:null,status:false,message:"แก้ไขข้อมูลไม่สำเร็จ"});
        }
    }catch(error){
        return res.status(500).send({status:false,message:error.message});
    }
}


async function runreferralcode() {

    const startDate = new Date(new Date().setHours(0, 0, 0, 0)); // เริ่มต้นของวันนี้
    const endDate = new Date(new Date().setHours(23, 59, 59, 999)); // สิ้นสุดของวันนี้
    const number = await Posorder.find({ createdAt: { $gte: startDate, $lte: endDate } }).countDocuments()
    const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    let referenceNumber = String(number).padStart(5, '0');
    let ref = `Order${currentDate}${referenceNumber}`;
    let loopnum  = 0
    let check = await Posorder.find({ pos_ref: ref }).countDocuments();
    if (check!== 0) {
    
    do{
        check = await Posorder.find({ pos_ref: ref }).countDocuments()
        if(check != 0)
        {
        loopnum++;
        referenceNumber = String(number+loopnum).padStart(5, '0');
        ref = `Order${currentDate}${referenceNumber}`;
        }

    }while(check !== 0)

    }
    
    return ref;

    
}