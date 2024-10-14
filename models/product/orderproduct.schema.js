const mongoose = require("mongoose");
const Joi = require("joi");

const OrderproductSchema = new mongoose.Schema(
  {
    orderref:{type:String,require:true}, //เลขอ้างอิง order
    partner_id:{type: mongoose.Schema.Types.ObjectId,ref:'partner',default:null}, //ไอดี partner
    partner_name:{type:String,require:false,default:""}, //ชื่อ partner
    customer_id :{type: String,require:false,default:""}, //ไอดี ลูกค้าx
    customer_name:{type:String,require:false,default:""}, //ชื่อลูกค้าx
    customer_address:{type:String,require:false,default:""}, //ที่อยู่ลูกค้าx
    customer_tambon :{type:String,require:false,default:""}, //ตำบลลูกค้าx
    customer_amphure :{type:String,require:false,default:""}, //อำเภอลูกค้าx
    customer_province:{type:String,require:false,default:""}, //จังหวัดลูกค้าx
    customer_zipcode:{type:String,require:false,default:""}, //รหัสไปรษณีย์ลูกค้าx
    customer_telephone :{type:String,require:false,default:""}, //เบอร์โทรลูกค้าx
    product:{type:[{
        product_id:{type: mongoose.Schema.Types.ObjectId,ref:'product',default:null}, //ไอดีสินค้า
        product_name:{type:String,require:false,default:""}, //ชื่อสินค้า
        product_image:{type:String,require:false,default:""}, //รูปสินค้า
        product_subimage1:{type:String,require:false,default:""}, //รูปสินค้า
        product_subimage2:{type:String,require:false,default:""}, //รูปสินค้า
        product_subimage3:{type:String,require:false,default:""}, //รูปสินค้า
        product_price:{type:Number,require:false,default:0}, //ราคาสินค้า
        product_qty:{type:Number,require:false,default:0}, //จำนวนสินค้า
        product_total:{type:Number,require:false,default:0}, //ราคารวมสินค้า
    }],require:false,default:[]}, //สินค้า

    delivery_detail:{type:[{
      product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'product', default: null }, // Product ID
          packages: [
            {
              package_qty: { type: Number, required: false, default: 0 }, // Quantity of items in package
              package_weight: { type: Number, required: false, default: 0 }, // Package weight
              package_width: { type: Number, required: false, default: 0 }, // Package width
              package_length: { type: Number, required: false, default: 0 }, // Package length
              package_height: { type: Number, required: false, default: 0 }, // Package height
              delivery_company: { type: String, required: false, default: "" }, // Delivery company name
              delivery_price: { type: Number, required: false, default: 0 }, // Delivery price
              delivery_totalprice: { type: Number, required: false, default: 0 }, // Delivery price
              amount: { type: Number, required: false, default: 0 }, // Amount of the package (you can rename this if needed)
              tracking: { type: String, required: false, default: "" }, // Tracking number
            }
          ],
    }],require:false,default:[]
    },
    slip_payment:{type:String,default:""},
    totalproduct:{type:Number,require:false,default:0}, //จำนวนสินค้าทั้งหมด
    totaldiscount:{type:Number,require:false,default:0}, //ส่วนลดทั้งหมด
    totaldeliveryPrice:{type:Number,require:false,default:0},//รวมค่าส่งทั้งหมด
    alltotal:{type:Number,require:false,default:0}, //ราคารวมทั้งหมด
    payment:{type:String,require:false,default:""}, //การชำระเงิน
    payment_id:{type:String,require:false,default:""}, //ไอดีการชำระเงิน
    statusdetail:{type:[{
        status:{type:String,require:false,default:""}, //สถานะ
        date:{type:Date,require:false,default:Date.now()}, //วันที่
    }],require:false,default:[]}, //สถานะรายละเอียด
  },
  {timestamps: true}
);

const Orderproduct = mongoose.model("orderproduct", OrderproductSchema);



module.exports = {Orderproduct};


