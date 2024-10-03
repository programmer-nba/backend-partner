const mongoose = require("mongoose");
const Joi = require("joi");

const RequestProductSchema = new mongoose.Schema(
  {
    product_name:{type:String,require:true}, // ชื่อสินค้า
    product_status_type:{type:String,default:true}, //สถานะสินค้า  (ฝากขาย , สินค้าของตัวเอง)
    product_store :{type:String,require:true}, //(ของตัวเอง,ของคู่ค้า)
    product_category:{type:String,default:""}, //หมวดหมู่สินค้า
    product_subcategory: { type: [String], default: [] }, //หมวดหมู่ย่อยสินค้า
    product_provider: {type: String,default:"normal"},
    product_basecost:{type:Number,require:true},//ราคาต้นทุนจริง
    product_costprice:{type:Number,require:true},//ราคาต้นทุน-ขาย
    product_price:{type:Number,require:true}, //ราคาสินค้า-ฝากบนเว็บ
    product_partner_id:{type: mongoose.Schema.Types.ObjectId,ref:'partner',default:null}, //ไอดีคู่ค้า
    product_detail:{type:String,require:true}, //รายละเอียดสินค้า
    product_stock:{type:Number,require:true}, //จำนวนสินค้า
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