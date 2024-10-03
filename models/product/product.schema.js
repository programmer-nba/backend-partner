const mongoose = require("mongoose");
const Joi = require("joi");

const ProductSchema = new mongoose.Schema(
  {
    product_name:{type:String,require:true}, // ชื่อสินค้า
    product_status_type:{type:String,default:true}, //สถานะสินค้า  (ฝากขาย , สินค้าของตัวเอง)
    product_store :{type:String,require:true}, //(ของตัวเอง,ของคู่ค้า)
    product_category:{type:String,default:""}, //หมวดหมู่สินค้า
    product_subcategory: { type: [String], default: [] }, //หมวดหมู่ย่อยสินค้า
    product_provider: {type: String,default: "normal"},
    product_basecost:{type:Number,require:true},//ราคาต้นทุนจริง
    product_costprice:{type:Number,require:true},//ราคาต้นทุน-ขาย
    product_price:{type:Number,require:true}, //ราคาสินค้า-ฝากบนเว็บ
    product_partner_id:{type: mongoose.Schema.Types.ObjectId,ref:'partner',default:null}, //ไอดีคู่ค้า
    product_detail:{type:String,require:true}, //รายละเอียดสินค้า
    product_stock:{type:Number,require:true}, //จำนวนสินค้า
    product_status :{type:Boolean,default:true}, //สถานะสินค้า (true: เปิดขาย , false: ปิดขาย)
    product_image:{type:String,default:""}, //รูปภาพสินค้า
    product_subimage1:{type:String,default:""}, //รูปภาพสินค้าย่อย 1
    product_subimage2:{type:String,default:""}, //รูปภาพสินค้าย่อย 2
    product_subimage3:{type:String,default:""}, //รูปภาพสินค้าย่อย 3
    product_document:{type:String,default:""}, //รูปภาพเอกสารกำกับสินค้า
    product_package_options:{type:[{
      package_qty:{type:Number,require:true},//จำนวนสินค้าต่อแพ็คเกจ
      package_weight:{type:Number,require:true},//น้ำหนัก
      package_width:{type:Number,require:true},//กว้าง
      package_length:{type:Number,require:true},//ยาว
      package_height:{type:Number,require:true},//สูง
      isCustom: {type:Boolean,require:false},
      selectedPackage: {type:String,require:false}
    }],default:[]},
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
        product_package_options: Joi.array().items(
          Joi.object({
              package_qty: Joi.number().required().label("กรุณากรอกจำนวนสินค้าต่อแพ็คเกจ"),
              package_weight: Joi.number().required().label("กรุณากรอกน้ำหนักแพ็คเกจ"),
              package_width: Joi.number().required().label("กรุณากรอกความกว้างของแพ็คเกจ"),
              package_length: Joi.number().required().label("กรุณากรอกความยาวของแพ็คเกจ"),
              package_height: Joi.number().required().label("กรุณากรอกความสูงของแพ็คเกจ"),
          })
      ).required().label("กรุณากรอกข้อมูลแพ็คเกจ"),
    });
    return schema.validate(data);
};


module.exports = {Product,validateproduct};


