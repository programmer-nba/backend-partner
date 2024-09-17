const mongoose = require("mongoose");
const Joi = require("joi");

const ProductSchema = new mongoose.Schema(
  {
    product_name:{type:String,require:true}, // ชื่อสินค้า
    product_status_type:{type:String,default:true}, //สถานะสินค้า  (ฝากขาย , สินค้าของตัวเอง)
    product_store :{type:String,require:true}, //(ของตัวเอง,ของคู่ค้า)
    product_category:{type:String,default:""}, //หมวดหมู่สินค้า
    product_provider: {type: String,default: "normal"},
    product_costprice:{type:Number,require:true},//ราคาต้นทุน
    product_price:{type:Number,require:true}, //ราคาสินค้า
    product_partner_id:{type: mongoose.Schema.Types.ObjectId,ref:'partner',default:null}, //ไอดีคู่ค้า
    product_detail:{type:String,require:true}, //รายละเอียดสินค้า
    product_stock:{type:Number,require:true}, //จำนวนสินค้า
    product_status :{type:Boolean,default:true}, //สถานะสินค้า (true: เปิดขาย , false: ปิดขาย)
    product_image:{type:String,default:""}, //รูปภาพสินค้า
    product_subimage1:{type:String,default:""}, //รูปภาพสินค้าย่อย 1
    product_subimage2:{type:String,default:""}, //รูปภาพสินค้าย่อย 2
    product_subimage3:{type:String,default:""}, //รูปภาพสินค้าย่อย 3
  },
  {timestamps: true}
);

const Product = mongoose.model("product", ProductSchema);

const validateproduct = (data) => {
    const schema = Joi.object({
        product_name:Joi.string().required().label("กรุณากรอกสินค้า"),
        product_status_type:Joi.string().required().label("กรุณากรอกสถานะสินค้า"),
        product_category:Joi.string().required().label("กรุณากรอกหมวดหมู่สินค้า"),
        product_provider:Joi.string().required().label("กรุณากรอกประเภทสินค้า"),
        product_price:Joi.number().required().label("กรุณากรอกราคาสินค้า"),
        product_store:Joi.string().required().label("กรุณากรอกสถานะสินค้า"),
        product_detail:Joi.string().required().label("กรุณากรอกรายละเอียดสินค้า"),
        product_stock:Joi.number().required().label("กรุณากรอกจำนวนสินค้า"),

    });
    return schema.validate(data);
};


module.exports = {Product,validateproduct};


