const mongoose = require("mongoose");
const Joi = require("joi");

const OrderproductSchema = new mongoose.Schema(
  {
    orderref:{type:String,require:true}, //เลขอ้างอิง order
    partner_id:{type: mongoose.Schema.Types.ObjectId,ref:'partner',default:null}, //ไอดี partner
    partner_name:{type:String,require:false,default:""}, //ชื่อ partner
    customer_id :{type: String,require:false,default:""}, //ไอดี ลูกค้า
    customer_name:{type:String,require:false,default:""}, //ชื่อลูกค้า
    customer_address:{type:String,require:false,default:""}, //ที่อยู่ลูกค้า
    customer_tambon :{type:String,require:false,default:""}, //ตำบลลูกค้า
    customer_amphure :{type:String,require:false,default:""}, //อำเภอลูกค้า
    customer_province:{type:String,require:false,default:""}, //จังหวัดลูกค้า
    customer_zipcode:{type:String,require:false,default:""}, //รหัสไปรษณีย์ลูกค้า
    customer_telephone :{type:String,require:false,default:""}, //เบอร์โทรลูกค้า
    product:{type:[{
        product_id:{type: mongoose.Schema.Types.ObjectId,ref:'product',default:null}, //ไอดีสินค้า
        product_name:{type:String,require:false,default:""}, //ชื่อสินค้า
        product_image:{type:String,require:false,default:""}, //รูปสินค้า
        product_price:{type:Number,require:false,default:0}, //ราคาสินค้า
        product_qty:{type:Number,require:false,default:0}, //จำนวนสินค้า
        product_total:{type:Number,require:false,default:0}, //ราคารวมสินค้า
    }],require:false,default:[]}, //สินค้า
    totalproduct:{type:Number,require:false,default:0}, //จำนวนสินค้าทั้งหมด
    totaldiscount:{type:Number,require:false,default:0}, //ส่วนลดทั้งหมด
    alltotal:{type:Number,require:false,default:0}, //ราคารวมทั้งหมด
    payment:{type:String,require:false,default:""}, //การชำระเงิน
    payment_id:{type:String,require:false,default:""}, //ไอดีการชำระเงิน
    statusdetail:{type:[{
        status:{type:String,require:false,default:""}, //สถานะ
        date:{type:Date,require:false,default:Date.now()}, //วันที่
    }],require:false,default:[]}, //สถานะรายละเอียด
    tracking:{type:String,require:false,default:""}, //tracking
  },
  {timestamps: true}
);

const Orderproduct = mongoose.model("orderproduct", OrderproductSchema);



module.exports = {Orderproduct};


