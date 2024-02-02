const { siteVerification } = require("googleapis/build/src/apis/siteVerification");
const mongoose = require("mongoose");

// Define the schema for the HotelUser entity
const partnerSchema = new mongoose.Schema(
  {
    //บุคคล
    username: {type: String, required: true,unique: true}, 
    password: {type: String, required: true},
    antecedent:{type:String,required:true},
    partner_name: { type: String, required: true },
    partner_phone: { type: String, required: true },
    partner_email:{type:String,required:true},
    partner_iden_number: { type: String, required: true },
    partner_address: { type: String, required: true },
    //otp
    status_opt :{ type: Boolean, default: false },

    // นิติบุคคล 
    partner_iden: { type: String, required: false, default: "" }, // ภาพบัญชี
    /// บริษัท
    partner_company_name: { type: String, required: false, default: "" },
    partner_company_number: { type: String, required: false, default: "" },
    partner_company_address: { type: String, required: false, default: "" },  
    filecompany:{type:String,default:""},
    logo:{type:String,default:""},

    
    //สถานะ
    partner_status: { type: Boolean, required: false, default: false }, 
    partner_status_promiss: {
      type: String,
      required: false,
      default: "รอตรวจสอบ",
    }, 

    signature:{type:[{
      name: {type:String},
      role: {type:String},
      position: {type:String},
      sign: {type:String}
    }],default:null},


   
    
    
    statusready :{ type: Boolean, default: false },
    statusdetail:{type:String,default:"ข้อมูลยังไม่ครบ"},


    partner_timestamp: { type: Array, required: false, default: [] },
  },
  {timestamps: true}
);

const Partner= mongoose.model("partner", partnerSchema);

module.exports = Partner;
