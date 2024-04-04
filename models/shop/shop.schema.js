const mongoose = require("mongoose");


const ShopSchema = new mongoose.Schema(
  {
    shop_name:{type:String,required:true},
    shop_type:{type:String,required:true},
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
    shop_status :{type:Boolean,default:true}, //สถานะ (true: เปิด , false: ปิด)
    shop_partner_id:{type: mongoose.Schema.Types.ObjectId,ref:'partner',default:null}, //ไอดีคู่ค้า
  },
  {timestamps: true}
);

const Shop = mongoose.model("shop", ShopSchema);

module.exports = {Shop};


