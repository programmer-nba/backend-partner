const mongoose = require("mongoose");


const EmployeeshopSchema = new mongoose.Schema(
  {

    employee_shop_id:{type: mongoose.Schema.Types.ObjectId,ref:'shop',default:null}, //ไอดีพนักงาน
    employee_name:{type:String,default:""}, //ชื่อพนักงาน
    employee_username:{type:String,required: true,unique: true}, //ชื่อผู้ใช้พนักงาน
    employee_password:{type:String,required: true}, //รหัสผ่านพนักงาน
    employee_phone:{type:String,default:""}, //เบอร์โทรพนักงาน
    employee_position:{type:String,default:""}, //ตำแหน่งพนักงาน

  },
  {timestamps: true}
);

const Employeeshop = mongoose.model("employeeshop", EmployeeshopSchema);

module.exports = {Employeeshop};


