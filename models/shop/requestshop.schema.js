const mongoose = require("mongoose");


const RequestShopSchema = new mongoose.Schema(
  {
   shop_name:{type:String,default:""}, //ชื่อร้านค้า
   shop_type:{type:String,default:""}, //ประเภทร้านค้า
    address:{type:{
      address:{type:String,default:""}, //(ที่อยู่)
      province:{type:String,default:""}, //(จังหวัด)
      amphure:{type:String,default:""}, //(อำเภอ)
      tambon: {type:String,default:""}, //(ตำบล)
      zipcode:{type:String,default:""}//(รหัสไปรษณีย์)	        
    },required:false,default:null},
    latitude :{type:Number,default:0}, //ละติจูด
    longitude:{type:Number,default:0}, //ลองจิจูด
    
    taxstatus:{type:Boolean,default:false}, //ภาษี (true: มี , false: ไม่มี)
    nametax:{type:String,default:""}, //ชื่อผู้เสียภาษี
    taxid:{type:String,default:""}, //เลขประจำตัวผู้เสียภาษี
    addresstax:{type:{
      address:{type:String,default:""}, //(ที่อยู่)
      province:{type:String,default:""}, //(จังหวัด)
      amphure:{type:String,default:""}, //(อำเภอ)
      tambon: {type:String,default:""}, //(ตำบล)
      zipcode:{type:String,default:""}//(รหัสไปรษณีย์)	        
    },required:false,default:null},
    shop_partner_id:{type: mongoose.Schema.Types.ObjectId,ref:'partner',default:null}, //ไอดีคู่ค้า
    
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

const Requestshop = mongoose.model("requestshop", RequestShopSchema);

module.exports = {Requestshop};


