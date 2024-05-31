const {
  siteVerification,
} = require("googleapis/build/src/apis/siteVerification");
const mongoose = require("mongoose");

// Define the schema for the HotelUser entity
const partnerSchema = new mongoose.Schema(
  {
    //บุคคล
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    antecedent: { type: String, required: true },
    partner_name: { type: String, required: true },
    partner_phone: { type: String, required: true },
    partner_email: { type: String, required: true },
    partner_iden_number: { type: String, required: true },
    partner_address: { type: String, required: true },
    partner_district: { type: String, required: false }, //ตำบล
    partner_amphure: { type: String, required: false }, //อำเภอ
    partner_province: { type: String, required: false }, //จังหวัด
    partner_postcode: { type: String, required: false }, //รหัสไปรษณีย์
    contract_type: { type: String, default: "", required: false },

    //otp
    status_opt: { type: Boolean, default: false },
    status_appover: { type: String, default: "ยังกรอกข้อมูลไม่ครบ" },
    status_detail:{type:[{
      status:{type:String,default:""},
      date:{type:Date,default:Date.now()},
      office_id:{type:String,default:""},
      office_name:{type:String,default:""},
    }],default:[]},
    // นิติบุคคล

    /// บริษัท
    partner_company_name: { type: String, required: false, default: "" },
    partner_company_number: { type: String, required: false, default: "" },
    partner_company_address: { type: String, required: false, default: "" },
    partner_company_district: { type: String, required: false, default: "" }, //ตำบล
    partner_company_amphure: { type: String, required: false, default: "" }, //อำเภอ
    partner_company_province: { type: String, required: false, default: "" }, //จังหวัด
    partner_company_postcode: { type: String, required: false, default: "" }, //รหัสไปรษณีย์
    partner_company_phone: { type: String, default: "" },

    partner_iden: { type: String, required: false, default: "" }, // เลขบัตรประชาชน
    filecompany: { type: String, default: "" },
    filecompany2: { type: String, default: "" },
    filecompany3: { type: String, default: "" },
    filecompany4: { type: String, default: "" },
    logo: { type: String, default: "" },
    //ตราประทับบริษัท
    companyseal :{ type: String, default: ""},
    //อีเมล์บริษัท
    partner_company_email: { type: String, default: "" },
    // ลายเซ็นต์
    signature: {
      type: [
        {
          name: { type: String },
          role: { type: String },
          position: { type: String },
          sign: { type: String },
        },
      ],
      default: null,
    },
    partner_timestamp: { type: Array, required: false, default: [] },
    //สัญญา 
    contract_partner:{type:Boolean,default:false}, //ยืนยันสัญญา ล็อคอินเข้าระบบครั้งแรก
    contract_emakert:{type:Boolean,default:false}, //ยืนยันสัญญา เข้าใช้งาน emarket
    contract_pospartner:{type:Boolean,default:false}, //ยืนยันสัญญา เข้าใช้งาน pospartner
    contract_onestopservice:{type:Boolean,default:false}, //ยืนยันสัญญา เข้าใช้งาน onestopservice
    contract_onestopshop:{type:Boolean,default:false}, //ยืนยันสัญญา เข้าใช้งาน onestopshop
  },
  { timestamps: true }
);

const Partner = mongoose.model("partner", partnerSchema);

module.exports = Partner;
