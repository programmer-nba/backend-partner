const mongoose = require("mongoose");


const PosorderSchema = new mongoose.Schema(
  {
    pos_ref:{type: String, required: true}, // รหัสออเดอร์
    pos_date:{type: Date, required: false ,default:Date.now()}, // วันที่ออเดอร์
    pos_order:{type: [{
        productshop_id:{type: mongoose.Schema.Types.ObjectId,ref:'productshop',default:null}, // รหัสสินค้า
        productshop_name:{type: String, required: true}, // ชื่อสินค้า
        productshop_price:{type: Number, required: true}, // ราคาสินค้า
        productshop_qty:{type: Number, required: true}, // จำนวนสินค้า
        productshop_total:{type: Number, required: true}, // ราคารวม
    }], required: true}, // รายการสินค้า
    pos_total:{type: Number, required: true}, // ราคารวม
    pos_discount:{type: Number, required: true}, // ส่วนลด
    pos_alltotal:{type: Number, required: true}, // ราคารวมทั้งหมด
    pos_payment:{type: String, required: true}, // ช่องทางการชำระ
    pos_status:{type: [{ // รอออเดอร์ , ออเดอร์สำเร็จ , ยกเลิก
      
        status:{type: String, required: true}, // ชื่อสถานะ
        date:{type: Date, required: false ,default:Date.now()}, // วันที่เปลี่ยนสถานะ
    }], required: true}, // สถานะ
    shop_id:{type: mongoose.Schema.Types.ObjectId,ref:'shop',default:null}, // รหัสร้านค้า
  },
  {timestamps: true}
);

const Posorder = mongoose.model("posorder", PosorderSchema);

module.exports = {Posorder};


