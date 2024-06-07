const Partner = require("../models/partner.schema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
//เรียกใช้ function เช็คชื่อซ้ำ
const axios = require("axios");

//สร้างไอดี Partner
module.exports.register = async (req, res) => {
  try {
    const checkusername = await Partner.findOne({
      username: req.body.username,
    });
    if (checkusername) {
      return res.status(409).send({ status: false, message: "usernameนี้ใช้งานไม่ได้" });
    }

    const data = new Partner({
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password, 10),
      antecedent: req.body.antecedent,
      partner_name: req.body.partner_name,
      partner_phone: req.body.partner_phone,
      partner_email: req.body.partner_email,
      partner_iden_number: req.body.partner_iden_number,
      partner_address: req.body.partner_address,
      partner_province: req.body.partner_province,
      partner_amphure: req.body.partner_amphure,
      partner_district: req.body.partner_district,
      partner_postcode: req.body.partner_postcode,
    });
    const add = await data.save();
    // ส่ง request ไปยัง API อื่นๆ โดยให้ url, method, headers และ data ตามที่ต้องการ
    if(add){
      return res.status(200).send({
        status: true,
        message: "คุณได้สร้างไอดี Partner เรียบร้อย",
        data: add,
      });
    }else{
      return res.status(200).send({
        status: false,
        message: "ไม่สามารถสร้างไอดี Partner ได้",
      });
    }
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

// opt
module.exports.sendotp = async (req, res) => {
  try {
    const id = req.params.id;
    const partner = await Partner.findById(id);
    if (!partner) {
      return res.status(404).send({ status: false, message: "ไม่มีข้อมูล" });
    }
    const config = {
      method: "post",
      url: `${process.env.SMS_URL}/otp-send`,
      headers: {
        "Content-Type": "application/json",
        api_key: `${process.env.SMS_API_KEY}`,
        secret_key: `${process.env.SMS_SECRET_KEY}`,
      },
      data: JSON.stringify({
        project_key: `${process.env.SMS_PROJECT_OTP}`,
        phone: `${partner?.partner_phone}`,
      }),
    };
    // ให้ใช้ await เพื่อรอให้ axios ทำงานเสร็จก่อนที่จะดำเนินการต่อ
    const result = await axios(config);

    if (result.data.code === "000") {
      return res.status(200).send({ status: true, result: result.data.result });
    } else {
      return res.status(400).send({ status: false, ...result.data });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ status: false, error: error.message });
  }
};

module.exports.check = async (req, res) => {
  try {
    const id = req.params.id;
    const partner = await Partner.findById(id);
    if (!partner) {
      return res.status(404).send({ status: false, message: "ไม่มีข้อมูล" });
    }

    const config = {
      method: "post",
      url: "https://portal-otp.smsmkt.com/api/otp-validate",
      headers: {
        "Content-Type": "application/json",
        api_key: `${process.env.SMS_API_KEY}`,
        secret_key: `${process.env.SMS_SECRET_KEY}`,
      },
      data: JSON.stringify({
        token: `${req.body.token}`,
        otp_code: `${req.body.otp_code}`,
      }),
    };
    await axios(config)
      .then(async (response) => {
        console.log(response.data);
        //หมดอายุ
        if (response.data.code === "5000") {
          return res.status(400).send({
            status: false,
            message: "OTP นี้หมดอายุแล้ว กรุณาทำรายการใหม่",
          });
        }

        if (response.data.code === "000") {
          //ตรวจสอบ OTP
          if (response.data.result.status) {
            const edit = await Partner.findByIdAndUpdate(
              id,
              { status_opt: true },
              { new: true }
            );
            const apiResponse = await axios
              .put(
                `${process.env.API_OFFICE}partners/OTP/${id}`,
                { status_opt: true },
                {
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              )
              .catch((error) => {
                return console.log(error);
              });

            return res
              .status(200)
              .send({ status: true, message: "ยืนยัน OTP สำเร็จ" });
          } else {
            return res.status(400).send({
              status: false,
              message: "รหัส OTP ไม่ถูกต้องกรุณาตรวจสอบอีกครั้ง",
            });
          }
        } else {
          return res.status(400).send({ status: false, ...response.data });
        }
      })
      .catch(function (error) {
        console.log(error);
        return res.status(400).send({ status: false, ...error });
      });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//login
module.exports.login = async (req, res) => {
  try {
    if (req.body.username === undefined || req.body.username === "") {
      return res
        .status(200)
        .send({ status: false, message: "กรุณากรอก username" });
    }
    if (req.body.password === undefined || req.body.password === "") {
      return res
        .status(200)
        .send({ status: false, message: "กรุณากรอก password" });
    }

    const username = req.body.username;
    const password = req.body.password;

    //เช็คว่า user นี้มีในระบบไหม
    const login = await Partner.findOne({ username: username });
    if (login) {
      //เช็ค password
      console.log(password);
      bcryptpassword = await bcrypt.compare(password, login.password);
      if (bcryptpassword) {
        //สร้าง signaturn
        console.log(login);
        const payload = {
          _id: login._id,
          username: login.username,
          antecedent: login.antecedent,
          partner_name: login.partner_name,
          partner_phone: login.partner_phone,
          partner_email: login.partner_email,
          position: "partner",
          status_otp: login.status_opt,
          status_appover: login.status_appover,
          status_otp: login.status_opt,
          status_appover: login.status_appover,
          partner_iden_number: login.partner_iden_number,
          partner_address: login.partner_address,
          partner_company_name: login.partner_company_name,
          partner_company_number: login.partner_company_number,
          partner_company_address: login.partner_company_address,
          partner_company_phone: login.partner_company_phone,
          partner_iden: login.partner_iden, // เลขบัตรประชาชน
          filecompany: login.filecompany,
          logo: login.logo,
          signature: login.signature,
        };
        const secretKey = process.env.SECRET_KEY;
        const token = jwt.sign(payload, secretKey, { expiresIn: "10D" });
        return res
          .status(200)
          .send({ status: true, data: payload, token: token });
      } else {
        return res
          .status(200)
          .send({ status: false, message: "คุณกรอกรหัสไม่ถูกต้อง" });
      }
    } else {
      return res
        .status(200)
        .send({ status: false, message: "ไม่มี user นี้ในระบบ" });
    }
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};
//getme
module.exports.me = async (req, res) => {
  try {
    const token = req.headers["token"];

    if (!token) {
      return res.status(403).send({ status: false, message: "Not authorized" });
    }

    const decodded = jwt.verify(token, process.env.SECRET_KEY);
    const dataResponse = {
      _id: decodded._id,
      username: decodded.username,
      antecedent: decodded.antecedent,
      partner_name: decodded.partner_name,
      partner_phone: decodded.partner_phone,
      partner_email: decodded.partner_email,
      position: "partner",
      status_otp: decodded.status_opt,
      status_appover: decodded.status_appover,
      partner_iden_number: decodded.partner_iden_number,
      partner_address: decodded.partner_address,
      partner_company_name: decodded.partner_company_name,
      partner_company_number: decodded.partner_company_number,
      partner_company_address: decodded.partner_company_address,
      partner_company_phone: decodded.partner_company_phone,

      partner_iden: decodded.partner_iden, // เลขบัตรประชาชน
      filecompany: decodded.filecompany,
      logo: decodded.logo,
      signature: decodded.signature,
    };

    return res.status(200).send({ status: true, data: dataResponse });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//ดึงข้อมูลทั้งหมด
module.exports.getall = async (req, res) => {
  try {
    const partnerdata = await Partner.find();
    if (!partnerdata) {
      return res.status(404).send({ status: false, message: "ไม่มีข้อมูล" });
    }
    return res.status(200).send({ status: true, data: partnerdata });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//ดึงข้อมูล by id
module.exports.getbyid = async (req, res) => {
  try {
    const partnerdata = await Partner.findOne({ _id: req.params.id });
    if (!partnerdata) {
      return res.status(404).send({ status: false, message: "ไม่มีข้อมูล" });
    }
    return res.status(200).send({ status: true, data: partnerdata });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//แก้ไขข้อมูล partner
module.exports.edit = async (req, res) => {
  try {
    const partner = await Partner.findOne({ _id: req.params.id });
    if (!partner) {
      return res.status(404).send({ status: false, message: "ไม่มีข้อมูล" });
    }

    if (partner.username != req.body.username) {
      const checkusername = await Partner.findOne({
        username: req.body.username,
      });
      if (checkusername) {
        res
          .status(409)
          .send({ status: false, message: "usernameนี้ใช้งานไม่ได้" });
      }
    }

    const data = {
      username: req.body.username,
      password:req.body.password != undefined && req.body.password != ""? bcrypt.hashSync(req.body.password, 10): partner.password,
      antecedent: req.body.antecedent,
      partner_name: req.body.partner_name,
      partner_phone: req.body.partner_phone,
      partner_email: req.body.partner_email,
      partner_iden_number: req.body.partner_iden_number,
      partner_address: req.body.partner_address,
      partner_district: req.body.partner_district, //ตำบล
      partner_amphure: req.body.partner_amphure, //อำเภอ
      partner_province: req.body.partner_province, //จังหวัด
      partner_postcode: req.body.partner_postcode, //รหัสไปรษณีย์
      /// บริษัท
      partner_company_name: req.body.partner_company_name,
      partner_company_number: req.body.partner_company_number,
      partner_company_address: req.body.partner_company_address,
      partner_company_district: req.body.partner_company_district, //ตำบล
      partner_company_amphure: req.body.partner_company_amphure, //อำเภอ
      partner_company_province: req.body.partner_company_province, //จังหวัด
      partner_company_postcode: req.body.partner_company_postcode, //รหัสไปรษณีย์
      partner_company_phone: req.body.partner_company_phone,
      partner_company_email : req.body.partner_company_email,
    };
    const edit = await Partner.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });
    // // ส่ง request ไปยัง API อื่นๆ โดยให้ url, method, headers และ data ตามที่ต้องการ
    // const apiResponse = await axios
    //   .put(
    //     `${process.env.API_OFFICE}/partners/wait/${req.params.id}`,
    //     {
    //       // ข้อมูลที่ต้องการส่งไปยัง API อื่นๆ
    //       username: req.body.username,
    //       password:
    //         req.body.password != undefined && req.body.password != ""
    //           ? bcrypt.hashSync(req.body.password, 10)
    //           : partner.password,
    //       antecedent: req.body.antecedent,
    //       partner_name: req.body.partner_name,
    //       partner_phone: req.body.partner_phone,
    //       partner_email: req.body.partner_email,
    //       partner_iden_number: req.body.partner_iden_number,
    //       partner_address: req.body.partner_address,
    //       partner_district: req.body.partner_district, //ตำบล
    //       partner_amphure: req.body.partner_amphure, //อำเภอ
    //       partner_province: req.body.partner_province, //จังหวัด
    //       partner_postcode: req.body.partner_postcode, //รหัสไปรษณีย์

    //       /// บริษัท
    //       partner_company_name: req.body.partner_company_name,
    //       partner_company_number: req.body.partner_company_number,
    //       partner_company_address: req.body.partner_company_address,
    //       partner_company_district: req.body.partner_company_district, //ตำบล
    //       partner_company_amphure: req.body.partner_company_amphure, //อำเภอ
    //       partner_company_province: req.body.partner_company_province, //จังหวัด
    //       partner_company_postcode: req.body.partner_company_postcode, //รหัสไปรษณีย์
    //       partner_company_phone: req.body.partner_company_phone,
    //     },
    //     {
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //     }
    //   );
      if(edit){
        return res.status(200).send({ status: true, data: edit,message: "แก้ไขข้อมูลสำเร็จ" });
      }else{
        return res.status(200).send({ status: false, message: "ไม่สามารถแก้ไขข้อมูลได้" });
      }
    
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

module.exports.accept = async (req, res) => {
  try {
    const partner = await Partner.findOne({ _id: req.params.id });
    if (!partner) {
      return res.status(404).send({ status: false, message: "ไม่มีข้อมูล" });
    }
   
    const status_detail = {
      status: "อนุมัติแล้ว",
      date: Date.now(),
      office_id: req.body.office_id,
      office_name: req.body.office_name,
    }

    const edit = await Partner.findByIdAndUpdate(
      req.params.id,
      { status_appover: "อนุมัติแล้ว" ,status_detail:status_detail},
      { new: true }
    );
    return res
      .status(200)
      .send({ status: true, data: edit, message: "อัพเดทสถานะ" });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//ลบข้อมูล partner
module.exports.delete = async (req, res) => {
  try {
    const partnerdata = await Partner.findOne({ _id: req.params.id });
    if (!partnerdata) {
      return res.status(200).send({ status: false, message: "ไม่มีข้อมูล" });
    }
    const deletepartner = await Partner.findByIdAndDelete(req.params.id);
    return res
      .status(200)
      .send({ status: true, message: "ลบข้อมูลสำเร็จ", data: deletepartner });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

const multer = require("multer");
const fs = require('fs');
const path = require('path');
const deleteimage = (filePath) => {
  console.log(__dirname, '..', filePath);
  const fullPath = path.join(__dirname, '..', filePath);
  fs.access(fullPath, fs.constants.F_OK, (err) => {
    if (!err) {
      fs.unlink(fullPath, (unlinkErr) => {
        if (unlinkErr) {
          console.error(`Failed to delete file: ${filePath}`, unlinkErr);
        } else {
          console.log(`Successfully deleted file: ${filePath}`);
        }
      });
    } else {
      console.log(`File not found: ${filePath}`);
    }
  });
};
// const {
//   uploadFileCreate,
//   deleteFile,
// } = require("../functions/uploadfilecreate");



const uploadidcard = path.join(__dirname, '../../assets/image/idcard');
fs.mkdirSync(uploadidcard, { recursive: true });
const storageidcard = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadidcard);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
        console.log(file.originalname);
    },
});

// บัตรประจำตัวประชาชน
module.exports.iden = async (req, res) => {
  try {
    let upload = multer({ storage: storageidcard }).array("image", 20);
    upload(req, res, async function (err) {
      if (err) {
        return res.status(500).send(err);
      }
      let image = ''; // ตัวแปรเก็บเส้นทางของรูปภาพ
      if (req.files) {
        const url = '/assets/image/idcard/';
        const reqFiles = [];
        req.files.forEach(file => {
          reqFiles.push(url + file.filename);
        });
        image = reqFiles[0];
        const partner = await Partner.findOne({ _id: req.params.id });
        if (partner.partner_iden != '') {
          deleteimage(partner.partner_iden);
        }
      }
      const data = {
        partner_iden: image,
      };
      const edit = await Partner.findByIdAndUpdate(req.params.id, data, {new: true,});
      if (edit) {
        return res.status(200).send({
          status: true,
          message: 'คุณได้รูปภาพเรียบร้อยแล้ว',
          data: edit,
        });
      } else {
        return res.status(200).send({ status: false, message: 'ไม่สามารถแก้ไขข้อมูลได้' });
      }
    });
  }
  catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};



// ตั้งค่า Multer ของ เอกสารที่เกี่ยวข้องกับบริษัท
const uploadcompany = path.join(__dirname, '../../assets/image/document');
fs.mkdirSync(uploadcompany , { recursive: true });
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadcompany );
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
        console.log(file.originalname);
    },
});


//ไฟล์เอกสาร
module.exports.filecompany = async (req, res) => {
  try {
    let upload = multer({ storage: storage }).array("image", 20);
    upload(req, res, async function (err) {
      if (err) {
        return res.status(500).send(err);
      }

      let image = ''; // ตัวแปรเก็บเส้นทางของรูปภาพ

      if (req.files) {
        const url = '/assets/image/document/';
        const reqFiles = [];

        req.files.forEach(file => {
          reqFiles.push(url + file.filename);
        });

        image = reqFiles[0];

        const partner = await Partner.findOne({ _id: req.params.id });
        if (partner.filecompany !='') {
          
          deleteimage(partner.filecompany)
        }
      }

      const data = {
        filecompany: image,
      };

      const edit = await Partner.findByIdAndUpdate(req.params.id, data, {
        new: true,
      });

      if (edit) {
        return res.status(200).send({
          status: true,
          message: 'คุณได้รูปภาพเรียบร้อยแล้ว',
          data: edit,
        });
      } else {
        return res.status(200).send({ status: false, message: 'ไม่สามารถแก้ไขข้อมูลได้' });
      }
    });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

module.exports.filecompany2 = async (req, res) => {
 try{
  let upload = multer({ storage: storage }).array("image", 20);
  upload(req, res, async function (err) {
    if (err) {
      return res.status(500).send(err);
    }

    let image = ''; // ตัวแปรเก็บเส้นทางของรูปภาพ

    if (req.files) {
      const url = '/assets/image/document/';
      const reqFiles = [];

      req.files.forEach(file => {
        reqFiles.push(url + file.filename);
      });

      image = reqFiles[0];

      const partner = await Partner.findOne({ _id: req.params.id });
      if (partner.filecompany2 !='') {
        deleteimage(partner.filecompany2)
      }
    }

    const data = {
      filecompany2: image,
    };

    const edit = await Partner.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });

    if (edit) {
      return res.status(200).send({
        status: true,
        message: 'คุณได้รูปภาพเรียบร้อยแล้ว',
        data: edit,
      });
    } else {
      return res.status(200).send({ status: false, message: 'ไม่สามารถแก้ไขข้อมูลได้' });
    }
  });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

module.exports.filecompany3 = async (req, res) => {
  try {
  
      let upload = multer({ storage: storage }).array("image", 20);
      upload(req, res, async function (err) {
        if (err) {
          return res.status(500).send(err);
        }
    
        let image = ''; // ตัวแปรเก็บเส้นทางของรูปภาพ
    
        if (req.files) {
          const url = '/assets/image/document/';
          const reqFiles = [];
    
          req.files.forEach(file => {
            reqFiles.push(url + file.filename);
          });
    
          image = reqFiles[0];
    
          const partner = await Partner.findOne({ _id: req.params.id });
          if (partner.filecompany3 != '') {
            deleteimage(partner.filecompany3)
          }
        }
    
        const data = {
          filecompany3: image,
        };
        console.log(data);
    
        const edit = await Partner.findByIdAndUpdate(req.params.id, data, {
          new: true,
        });
    
        if (edit) {
          return res.status(200).send({
            status: true,
            message: 'คุณได้รูปภาพเรียบร้อยแล้ว',
            data: edit,
          });
        } else {
          return res.status(200).send({ status: false, message: 'ไม่สามารถแก้ไขข้อมูลได้' });
        }
      });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

module.exports.filecompany4 = async (req, res) => {
  try {
  
    let upload = multer({ storage: storage }).array("image", 20);
    upload(req, res, async function (err) {
      if (err) {
        return res.status(500).send(err);
      }
  
      let image = ''; // ตัวแปรเก็บเส้นทางของรูปภาพ
  
      if (req.files) {
        const url = '/assets/image/document/';
        const reqFiles = [];
  
        req.files.forEach(file => {
          reqFiles.push(url + file.filename);
        });
  
        image = reqFiles[0];
  
        const partner = await Partner.findOne({ _id: req.params.id });
        if (partner.filecompany4 !='') {
          deleteimage(partner.filecompany4)
        }
      }
  
      const data = {
        filecompany4: image,
      };
  
      const edit = await Partner.findByIdAndUpdate(req.params.id, data, {
        new: true,
      });
  
      if (edit) {
        return res.status(200).send({
          status: true,
          message: 'คุณได้รูปภาพเรียบร้อยแล้ว',
          data: edit,
        });
      } else {
        return res.status(200).send({ status: false, message: 'ไม่สามารถแก้ไขข้อมูลได้' });
      }
    });
} catch (error) {
  return res.status(500).send({ status: false, error: error.message });
}
};




// โล้โก้
const uploadlogo = path.join(__dirname, '../../assets/image/logo');
fs.mkdirSync(uploadcompany , { recursive: true });
const storagelogo = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadcompany );
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
        console.log(file.originalname);
    },
});

// เพิ่มรูปภาพโลโก้
module.exports.logo = async (req, res) => {
  try {
    let upload = multer({ storage: storagelogo }).array("image", 20);
    upload(req, res, async function (err) {
      const reqFiles = [];
      const result = [];
      if (err) {
        return res.status(500).send(err);
      }
      let image = ""; // ตั้งตัวแปรรูป
      //ถ้ามีรูปให้ทำฟังก์ชั่นนี้ก่อน
      if (req.files) {
        const url = '/assets/image/logo/';
        const reqFiles = [];
  
        req.files.forEach(file => {
          reqFiles.push(url + file.filename);
        });
  
        image = reqFiles[0];
  
        const partner = await Partner.findOne({ _id: req.params.id });
        if (partner.logo !='') {
          deleteimage(partner.logo)
        }
      } else {
        return res.json({
          message: "not found any files",
          status: false
        })
      }

      const data = {
        logo: image,
      };
      const edit = await Partner.findByIdAndUpdate(req.params.id, data, {
        new: true,
      });


        if(edit){
          return res.status(200).send({
            status: true,
            message: "คุณได้รูปภาพเรียบร้อยแล้ว",
            data: edit,
          
          });
        }else{
          return res.status(200).send({ status: false, message: "ไม่สามารถแก้ไขข้อมูลได้" });
        }
      
    });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};




const uploadcompanyseal = path.join(__dirname, '../../assets/image/companyseal');
fs.mkdirSync(uploadcompanyseal , { recursive: true });
const storagescompanyseal = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadcompanyseal );
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
        console.log(file.originalname);
    },
});


//เพิ่มตราประทับบริษัท
module.exports.companyseal = async (req, res) => {
  try{
    let upload = multer({ storage: storagescompanyseal }).array("image", 20);
    upload(req, res, async function (err) {
      const reqFiles = [];
      const result = [];
      if (err) {
        return res.status(500).send(err);
      }
      let image = ""; // ตั้งตัวแปรรูป
      //ถ้ามีรูปให้ทำฟังก์ชั่นนี้ก่อน
      if (req.files) {
        const url = '/assets/image/companyseal/';
        const reqFiles = [];
  
        req.files.forEach(file => {
          reqFiles.push(url + file.filename);
        });
  
        image = reqFiles[0];
  
        const partner = await Partner.findOne({ _id: req.params.id });
        if (partner.companyseal !='') {
          deleteimage(partner.companyseal)
        }
      } else {
        return res.json({
          message: "not found any files",
          status: false
        })
      }

      const data = {
        companyseal: image,
      };
     
      const edit = await Partner.findByIdAndUpdate(req.params.id, data, {
        new: true,
      });

        if(edit){
          return res.status(200).send({
            status: true,
            message: "คุณได้รูปภาพเรียบร้อยแล้ว",
            data: edit,
          });
        }else{
          return res.status(200).send({ status: false, message: "ไม่สามารถแก้ไขข้อมูลได้" });
        }
      
    });
  }catch(error){
    return res.status(500).send({ status: false, error: error.message });
  }
};



const uploadsignature = path.join(__dirname, '../../assets/image/signature');
fs.mkdirSync(uploadsignature, { recursive: true });
const storagesignature = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsignature );
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
        console.log(file.originalname);
    },
});

// เพิ่มรูปภาพลายเซ็นต์
module.exports.addsignature = async (req, res) => {
  try {
    let upload = multer({ storage: storagesignature  }).array("image", 20);
    upload(req, res, async function (err) {
      const reqFiles = [];
      const result = [];
      if (err) {
        return res.status(500).send(err);
      }
      let image = ""; // ตั้งตัวแปรรูป
      //ถ้ามีรูปให้ทำฟังก์ชั่นนี้ก่อน
      if (req.files) {
        const url = '/assets/image/signature/';
        const reqFiles = [];
  
        req.files.forEach(file => {
          reqFiles.push(url + file.filename);
        });
  
        image = reqFiles[0];
  
     
      } else {
        return res.json({
          message: "not found any files",
          status: false
        })
      }

      const partner = await Partner.findById(req.params.id);
      if (!partner) {
        res.status(400).send({ status: false, message: "ไม่มีข้อมูล" });
      }

      const data = {
        name: req.body.name,
        role: req.body.role,
        position: req.body.position,
        sign: image,
      };
      partner.signature.push(data);
      const edit = await Partner.findByIdAndUpdate(
        req.params.id,
        { signature: partner.signature },
        { new: true }
      );
    
        if(edit){
          return res.status(200).send({
            status: true,
            message: "คุณได้รูปภาพเรียบร้อยแล้ว",
            data: edit,
           
          });
        }else{
          return res.status(200).send({ status: false, message: "ไม่สามารถแก้ไขข้อมูลได้" });
        }
      
    });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

// แก้รูปภาพลายเซ็นต์
module.exports.editsignature = async (req, res) => {
  try {
    let upload = multer({ storage: storage }).array("image", 20);
    upload(req, res, async function (err) {
      const reqFiles = [];
      const result = [];
      if (err) {
        return res.status(500).send(err);
      }
      let image = ""; // ตั้งตัวแปรรูป
      //ถ้ามีรูปให้ทำฟังก์ชั่นนี้ก่อน
      if (req.files) {
        const url = req.protocol + "://" + req.get("host");
        for (var i = 0; i < req.files.length; i++) {
          const src = await uploadFileCreate(req.files, res, { i, reqFiles });
          result.push(src);

          //   reqFiles.push(url + "/public/" + req.files[i].filename);
        }

        //ไฟล์รูป
        image = reqFiles[0];
        const partner = await Partner.findById(req.params.id);
        if(partner.signature !='')
        {
          const deletefile = await deleteFile(partner.signature);
        }
      }

      const partner = await Partner.findById(req.params.id);
      if (!partner) {
        res.status(400).send({ status: false, message: "ไม่มีข้อมูล" });
      }
      const signatureid = req.body.signatureid;
      partner.signature = partner.signature.filter(
        (item) => item._id != signatureid
      );

      const data = {
        name: req.body.name,
        role: req.body.role,
        position: req.body.position,
        sign: image,
      };
      partner.signature.push(data);
      const edit = await Partner.findByIdAndUpdate(
        req.params.id,
        { signature: partner.signature },
        { new: true }
      );
      // const apiResponse = await axios
      //   .put(
      //     `${process.env.API_OFFICE}/partners/addSignature/${req.params.id}`,
      //     { signature: partner.signature },
      //     {
      //       headers: {
      //         "Content-Type": "application/json",
      //       },
      //     }
      //   );
      if(edit){
        return res.status(200).send({
          status: true,
          message: "คุณได้รูปภาพเรียบร้อยแล้ว",
          data: edit,
      
        });
      }else{
        return res.status(200).send({ status: false, message: "ไม่สามารถแก้ไขข้อมูลได้" });
      }
    });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//ลบลายเซ็นต์
module.exports.deletesignature = async (req, res) => {
  try {
    const id = req.params.id;
    const signatureid = req.body.signatureid;
    const partner = await Partner.findById(req.params.id);
    if (!partner) {
      res.status(400).send({ status: false, message: "ไม่มีข้อมูล" });
    }

  partner.signature.forEach((item) => {
    if (item._id == signatureid) {
      if (item.sign != '') {
        deleteimage(item.sign)
      }
    }
  }); 
    partner.signature = partner.signature.filter(
      (item) => item._id != signatureid
    );
    //ลบรูปภาพลายเซ็น

    const edit = await Partner.findByIdAndUpdate(
      req.params.id,
      { signature: partner.signature },
      { new: true }
    );
  
      if(edit){
        return res.status(200).send({
          status: true,
          message: "คุณได้ลบภาพลายเซ็นแล้ว",
          data: edit,
        });
      }else{
        return res.status(200).send({ status: false, message: "ไม่สามารถแก้ไขข้อมูลได้" });
      }
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//รออนุมัติ
module.exports.WaitForApproval = async (req, res) => {
  try {
    const id = req.params.id;
    const updateStatus = await Partner.findOne({ _id: id });
    if (!updateStatus) {
      return res.status(500).send({
        message: "ไม่พบข้อมูล Partner",
        status: false,
      });
    }
    updateStatus.status_appover = "รออนุมัติ";
    await updateStatus.save();
    // const apiResponse = await axios
    // .put(
    //   `${process.env.API_OFFICE}/partners/updateStatus/${req.params.id}`,
    //   { },
    //   {
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   }
    // );
    if(updateStatus){
      return res.status(200).send({
        status: true,
        message: "เพิ่มข้อมูล รอ อนุมัติสำเร็จ",
        data: updateStatus,
      });
    }else{
      return res.status(200).send({ status: false, message: "ไม่สามารถแก้ไขข้อมูลได้" });
    }
  } catch (error) {
    return res.status(500).send({ message: error.message, status: false });
  }
};



//ส่งประเภทสัญญา
module.exports.sendtypecontract = async (req, res) => {
  try {
    const id = req.params.id;
    const partner = await Partner.findById(id);
    if (!partner) {
      return res.status(404).send({ status: false, message: "ไม่มีข้อมูล" });
    }
    const data = {
      contract_type: req.body.contract_type,
    }
    const edit = await Partner.findByIdAndUpdate(id,data,{new:true});
    return res.status(200).send({
      status: true,
      message: "คุณได้รูปภาพเรียบร้อยแล้ว",
      data: edit,
    });
  }
  catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
}






