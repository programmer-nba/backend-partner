const mongoose = require("mongoose");
const Joi = require("joi");

const RequestProductSchema = new mongoose.Schema(
  {
    product_name:{type:String,require:true}, // ชื่อสินค้า
    product_status_type:{type:String,default:true}, //สถานะสินค้า  (ฝากขาย , สินค้าของตัวเอง)
    product_store :{type:String,require:true}, //(ของตัวเอง,ของคู่ค้า)
    product_category:{type:String,default:""}, //หมวดหมู่สินค้า
    product_costprice:{type:Number,require:true},//ราคาต้นทุน
    product_price:{type:Number,require:true}, //ราคาสินค้า
    product_partner_id:{type: mongoose.Schema.Types.ObjectId,ref:'partner',default:null}, //ไอดีคู่ค้า
    product_detail:{type:String,require:true}, //รายละเอียดสินค้า
    product_stock:{type:Number,require:true}, //จำนวนสินค้า
    product_image:{type:String,default:""}, //รูปภาพสินค้า
    product_subimage1:{type:String,default:""}, //รูปภาพสินค้าย่อย 1
    product_subimage2:{type:String,default:""}, //รูปภาพสินค้าย่อย 2
    product_subimage3:{type:String,default:""}, //รูปภาพสินค้าย่อย 3
    request_status:{type:Boolean,default:false}, //สถานะการขอสินค้า (true: อนุมัติ , false: รอการอนุมัติ)
    request_status_detail:{type:[{
      status:{type:String,default:""}, //สถานะการขอสินค้า
      date:{type:Date,default:Date.now()} //วันที่เปลี่ยนสถานะ
    }],default:[]}, //รายละเอียดสถานะการขอสินค้า
    office_id:{type:String,default:""}, //คนอนุมัติ
    office_name:{type:String,default:""}, //ชื่อคนอนุมัติ
    
    

  },
  {timestamps: true}
);

const Requestproduct = mongoose.model("requestproduct", RequestProductSchema);


module.exports = {Requestproduct};