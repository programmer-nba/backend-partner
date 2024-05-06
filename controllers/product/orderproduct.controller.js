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
            const checkproduct = Product.findById(element.product_id);
            if(checkproduct.product_stock <= element.product_qty){
                return res.status(400).json({message:"สินค้า"+checkproduct.product_name+" มีไม่พอสั่ง", status: false});
            }
        })
        //ถ้าพอให้หักสต็อกสินค้าเลย
        product.forEach(async (element)=>{
            const checkproduct = Product.findById(element.product_id);
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


//แสดงออเดอร์ e-market ตามไอดี

//แสดงออเดอร์ e-market ตามไอดี partner

//แก้ไขออเดอร์ e-market ตามไอดี


//ลบออเดอร์ e-market ตามไอดี

// จัดส่งออเดอร์แล้ว

// ยกเลิกออเดอร์



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