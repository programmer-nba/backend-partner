const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { uploadFileCreate, deleteFile } = require("../../functions/uploadfilecreate");
const axios = require("axios");

const uploadFolder = path.join(__dirname, '../../assets/shop');
fs.mkdirSync(uploadFolder, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder)
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
    //console.log(file.originalname);
  },
});

//สร้างร้านค้า
module.exports.createShop = async (req, res) => {
  try {
    let upload = multer({ storage: storage }).single("productTG_image");
    upload(req, res, async function (err) {
      console.log(req.file)
      if (!req.file) {
        const resq = await CreateShop(req.body);
        if (!resq.status) {
          res.status(403).json({ status: false, message: resq.message });
        } else {
          res.status(200).json({ status: true, message: resq.message })
        }
      }
    })
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//ดึงข้อมูลร้านค้า partner
module.exports.getShop = async (req, res) => {
  try {
    const apiResponse = await axios.get(`${process.env.API_TOSSAGUNSHOP}/partner/shop/${req.params.partnerid}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (apiResponse?.data?.status == true) {
      return res.status(200).json({ message: "ดึงข้อมูลร้านค้าสำเร็จ", data: apiResponse.data.data, status: true });
    } else {
      return res.status(400).json({ message: "ดึงข้อมูลร้านค้าไม่สำเร็จ", status: false });
    }

  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
}

//ดึงข้อมูลร้านค้า by id 
module.exports.getShopById = async (req, res) => {
  try {
    const apiResponse = await axios.get(`${process.env.API_TOSSAGUNSHOP}/partner/shop/shop/${req.params.id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (apiResponse?.data?.status == true) {
      return res.status(200).json({ message: "ดึงข้อมูลร้านค้าสำเร็จ", data: apiResponse.data.data, status: true });
    } else {
      return res.status(400).json({ message: "ดึงข้อมูลร้านค้าไม่สำเร็จ", status: false });
    }

  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
}

//แก้ไขข้อมูลร้านค้า
module.exports.editShop = async (req, res) => {
  try {
    let upload = multer({ storage: storage }).array("shop_logo", 20);
    upload(req, res, async function (err) {
      const reqFiles = [];
      const result = [];
      if (err) {
        return res.status(500).send(err);
      }
      let data;
      if (req.body.shop_logo != '' && req.body.shop_logo != null) {
        data = {
          ...req.body,
          shop_logo: req.body.shop_logo
        }
      } else {
        data = {
          ...req.body
        }
      }

      const apiResponse = await axios.put(`${process.env.API_TOSSAGUNSHOP}/partner/shop/shop/${req.params.id}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );


      if (apiResponse?.data?.status == true) {
        return res.status(200).json({ message: "แก้ไขร้านค้าสำเร็จ", data: apiResponse.data.data, status: true });
      } else {
        return res.status(400).json({ message: "แก้ไขร้านค้าไม่สำเร็จ", status: false });
      }
    });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
}

//ลบข้อมูลร้านค้า
module.exports.deleteShop = async (req, res) => {
  try {
    const apiResponse = await axios.delete(`${process.env.API_TOSSAGUNSHOP}/partner/shop/${req.params.id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (apiResponse?.data?.status == true) {
      return res.status(200).json({ message: "ลบข้อมูลร้านค้าสำเร็จ", data: apiResponse.data.data, status: true });
    } else {
      return res.status(400).json({ message: "ลบข้อมูลร้านค้าไม่สำเร็จ", status: false });
    }

  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
}

//เพิ่มพนักงาน
module.exports.createShopEmployee = async (req, res) => {
  try {
    const resq = await CreateEmployee(req.body);
    if (!resq.status) {
      return res.status(403).json({ status: false, message: resq.message });
    } else {
      return res.status(200).json({ status: true, message: resq.message })
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

//ดึงข้อมูลพนักงาน by shopid
module.exports.getShopEmployee = async (req, res) => {
  try {
    const apiResponse = await axios.get(`${process.env.API_TOSSAGUNSHOP}/partner/shop/employee/${req.params.shopid}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (apiResponse?.data?.status == true) {
      return res.status(200).json({ message: "ดึงข้อมูลพนักงานสำเร็จ", data: apiResponse.data.data, status: true });
    } else {
      return res.status(400).json({ message: "ดึงข้อมูลพนักงานไม่สำเร็จ", status: false });
    }

  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
}

//ดึงข้อมูลพนักงาน by id (ไม่ได้ใช้)
module.exports.getShopEmployeeById = async (req, res) => {
  try {
    const apiResponse = await axios.get(`${process.env.API_TOSSAGUNSHOP}/employee/${req.params.id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (apiResponse?.data?.status == true) {
      return res.status(200).json({ message: "ดึงข้อมูลพนักงานสำเร็จ", data: apiResponse.data.data, status: true });
    } else {
      return res.status(400).json({ message: "ดึงข้อมูลพนักงานไม่สำเร็จ", status: false });
    }

  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
}

//แก้ไขข้อมูลพนักงาน
module.exports.editShopEmployee = async (req, res) => {
  try {

    let data
    if (req.body.employee_password != '' && req.body.employee_password != null && req.body.employee_password != undefined) {
      data = {
        ...req.body,
        employee_password: req.body.employee_password
      }
    } else {
      data = {
        ...req.body
      }
    }
    const apiResponse = await axios.put(`${process.env.API_TOSSAGUNSHOP}/partner/shop/employee/${req.params.id}`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      });

    if (apiResponse?.data?.status == true) {
      return res.status(200).json({ message: "แก้ไขข้อมูลพนักงานสำเร็จ", data: apiResponse.data.data, status: true });
    }

    else {
      return res.status(400).json({ message: "แก้ไขข้อมูลพนักงานไม่สำเร็จ", status: false });
    }
  } catch (error) {
    if (error.response.status == 409) {
      return res.status(409).send({ status: false, error: "รหัสซ้ำกรุณาเปลี่ยนใหม่" });
    } else {
      return res.status(500).send({ status: false, error: error.message });
    }
  }
}

// ลบข้อมูลพนักงาน
module.exports.deleteShopEmployee = async (req, res) => {
  try {
    const apiResponse = await axios.delete(`${process.env.API_TOSSAGUNSHOP}/partner/shop/employee/${req.params.id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (apiResponse?.data?.status == true) {
      return res.status(200).json({ message: "ลบข้อมูลพนักงานสำเร็จ", data: apiResponse.data.data, status: true });
    } else {
      return res.status(400).json({ message: "ลบข้อมูลพนักงานไม่สำเร็จ", status: false });
    }

  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
}

async function CreateShop(packageData) {
  let data = JSON.stringify(packageData);
  const config = {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    url: `${process.env.API_TOSSAGUNSHOP}/partner/shop/create`,
    data: data,
  };
  let response;
  await axios(config).then((res) => {
    // console.log(res.data.message);
    response = res.data;
  }).catch((err) => {
    // console.log(err.response.data);
    response = err.response.data;
  })
  return response;
}

async function CreateEmployee(packageData) {
  let data = JSON.stringify(packageData);
  const config = {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    url: `${process.env.API_TOSSAGUNSHOP}/partner/shop/employee`,
    data: data,
  };
  let response;
  await axios(config).then((res) => {
    // console.log(res.data.message);
    response = res.data;
  }).catch((err) => {
    // console.log(err.response.data);
    response = err.response.data;
  })
  return response;
};