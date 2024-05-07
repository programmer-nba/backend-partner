const { Orderproduct } = require("../../models/product/orderproduct.schema");
const { Product } = require("../../models/product/product.schema");
const Partner = require("../../models/partner.schema");
//สร้างออเดอร์ e-market
module.exports.create = async (req, res) => {
    try{
        //เช็คว่ามี partner ไหม
        const partner = await Partner.findById(req.body.partner_id);
        if(!partner){
            return res.status(400).json({message:"ไม่พบ partner", status: false});
        }

        //เช็คว่าของพอสั่งหรือเปล่า
        const product = req.body.product;
        product.forEach(async (element)=>{
            const checkproduct = await Product.findById(element.product_id);
            if(checkproduct.product_stock <= element.product_qty){
                return res.status(400).json({message:"สินค้า"+checkproduct.product_name+" มีไม่พอสั่ง", status: false});
            }
        })
        //ถ้าพอให้หักสต็อกสินค้าเลย
        product.forEach(async (element)=>{

            const checkproduct = await Product.findById(element.product_id);
          
            checkproduct.product_stock = checkproduct.product_stock - element.product_qty;
            await checkproduct.save();
        })
        //สร้างออเดอร์
        const orderproduct = new Orderproduct({
            ...req.body,
            orderref: await runreforder(),
            partner_name: partner.partner_name,
            statusdetail: [{status:"กำลังเตรียมจัดส่ง",date:Date.now()}]

        });
        const add = await orderproduct.save();
        return res.status(200).json({message:"สร้างออเดอร์สำเร็จ", status: true, data: add});
    }catch(error){
        return res.status(500).json({message:error.message, status: false});
    }
};

//แสดงออเดอร์ e-market ทั้งหมด
module.exports.getall = async (req, res) => {
    try{
        const orderproduct = await Orderproduct.find();
        return res.status(200).json({message:"แสดงออเดอร์สำเร็จ", status: true, data: orderproduct});
    }catch(error){
        return res.status(500).json({message:error.message, status: false});
    }
};

//แสดงออเดอร์ e-market ตามไอดี
module.exports.getbyid = async (req, res) => {
    try{
        const orderproduct = await Orderproduct.findById(req.params.id);
        return res.status(200).json({message:"แสดงออเดอร์สำเร็จ", status: true, data: orderproduct});
    }catch(error){
        return res.status(500).json({message:error.message, status: false});
    }
};

//แสดงออเดอร์ e-market ตามไอดี partner
module.exports.getbyidpartner = async (req, res) => {
    try{
        const orderproduct = await Orderproduct.find({partner_id:req.params.id});
        return res.status(200).json({message:"แสดงออเดอร์สำเร็จ", status: true, data: orderproduct});
    }catch(error){
        return res.status(500).json({message:error.message, status: false});
    }
};

//แก้ไขออเดอร์ e-market ตามไอดี
module.exports.update = async (req, res) => {
    try{
        const orderproduct = await Orderproduct.findById(req.params.id);
        if(!orderproduct){
            return res.status(400).json({message:"ไม่พบ order", status: false});
        }
       const update = await Orderproduct.findByIdAndUpdate(req.params.id, req.body,{new:true})
        return res.status(200).json({message:"แก้ไขออเดอร์สำเร็จ", status: true, data: update});
    }catch(error){
        return res.status(500).json({message:error.message, status: false});
    }
};


//ลบออเดอร์ e-market ตามไอดี
module.exports.delete = async (req, res) => {
    try{
        const orderproduct = await Orderproduct.findById(req.params.id);
        if(!orderproduct){
            return res.status(400).json({message:"ไม่พบ order", status: false});
        }
        const del = await Orderproduct.findByIdAndDelete(req.params.id);
        return res.status(200).json({message:"ลบออเดอร์สำเร็จ", status: true, data: del});
    }catch(error){
        return res.status(500).json({message:error.message, status: false});
    }
};

// จัดส่งออเดอร์แล้ว
module.exports.delivery = async (req, res) => {
    try{
        const orderproduct = await Orderproduct.findById(req.params.id);
        if(!orderproduct){
            return res.status(400).json({message:"ไม่พบ order", status: false});
        }

        orderproduct.statusdetail.push({status:"จัดส่งแล้ว",date:Date.now()});
        const data ={
            statusdetail:orderproduct.statusdetail,
            tracking: req.body.tracking  
        }
        const update = await Orderproduct.findByIdAndUpdate(req.params.id, data,{new:true})
        return res.status(200).json({message:"จัดส่งออเดอร์สำเร็จ", status: true, data: update});
    }catch(error){
        return res.status(500).json({message:error.message, status: false});
    }
};

// ยกเลิกออเดอร์
module.exports.cancel = async (req, res) => {
    try{
        const orderproduct = await Orderproduct.findById(req.params.id);
        if(!orderproduct){
            return res.status(400).json({message:"ไม่พบ order", status: false});
        }
        orderproduct.statusdetail.push({status:"ยกเลิกออเดอร์",date:Date.now()});
        const update = await Orderproduct.findByIdAndUpdate(req.params.id, orderproduct,{new:true})
        return res.status(200).json({message:"ยกเลิกออเดอร์สำเร็จ", status: true, data: update});
    }catch(error){
        return res.status(500).json({message:error.message, status: false});
    }
};


//ฟังก์ชั่น สร้างเลขอ้างอิง order
async function runreforder() {

    const startDate = new Date(new Date().setHours(0, 0, 0, 0)); // เริ่มต้นของวันนี้
    const endDate = new Date(new Date().setHours(23, 59, 59, 999)); // สิ้นสุดของวันนี้
    const number = await Orderproduct.find({ createdAt: { $gte: startDate, $lte: endDate } }).countDocuments()
    const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    let referenceNumber = String(number).padStart(5, '0');
    let ref = `Order${currentDate}${referenceNumber}`;
    let loopnum  = 0
    let check = await Orderproduct.find({ orderref: ref }).countDocuments();
    if (check!== 0) {
    
    do{
        check = await Orderproduct.find({ orderref: ref }).countDocuments()
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