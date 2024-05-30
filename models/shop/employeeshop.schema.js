const mongoose = require("mongoose");


const EmployeeshopSchema = new mongoose.Schema(
  {

    employee_shop_id:{type: mongoose.Schema.Types.ObjectId,ref:'shop',default:null}, //ไอดีพนักงาน
    employee_prefix:{type:String,default:""}, //คำนำหน้าชื่อ
    employee_firstname:{type:String,default:""}, //ชื่อพนักงาน
    employee_lastname:{type:String,default:""}, //นามสกุลพนักงาน
    employee_username:{type:String,required: true,unique: true}, //ชื่อผู้ใช้พนักงาน
    employee_password:{type:String,required: true}, //รหัสผ่านพนักงาน
    employee_phone:{type:String,default:""}, //เบอร์โทรพนักงาน
    employee_email:{type:String,default:""}, // อีเมล์
    employee_position:{type:String,default:""}, //ตำแหน่งพนักงาน

  },
  {timestamps: true}
);

const Employeeshop = mongoose.model("employeeshop", EmployeeshopSchema);

module.exports = {Employeeshop};


