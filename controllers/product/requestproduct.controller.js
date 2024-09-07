const jwt = require("jsonwebtoken");
const { Requestproduct } = require('../../models/product/requestproduct.schema');
const { Product } = require('../../models/product/product.schema');
const multer = require("multer");
const {
    uploadFileCreate,
    deleteFile,
} = require("../../functions/uploadfilecreate");


const fs = require('fs');
const path = require('path');

const uploadFolder = path.join(__dirname, '../../assets/image/emarket');
fs.mkdirSync(uploadFolder, { recursive: true });

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadFolder);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
        console.log(file.originalname);
    },
});

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


//เพิ่มคำร้องขอฝากขายสินค้า
module.exports.add = async (req, res) => {
    try {
        //request_status_detail
        const request_status_detail = {
            status: "รอการอนุมัติ",
            date: Date.now()
        }
        const data = new Requestproduct({
            product_name: req.body.product_name,
            product_status_type: req.body.product_status_type,
            product_category: req.body.product_category,
            product_costprice: req.body.product_costprice,
            product_price: req.body.product_price,
            product_store: req.body.product_store,
            product_partner_id: (req.body.product_partner_id == undefined || req.body.product_partner_id == '') ? null : req.body.product_partner_id,
            product_detail: req.body.product_detail,
            product_stock: req.body.product_stock,
            request_status: false,
            request_status_detail: request_status_detail,
        });
        const add = await data.save();
        return res.status(200).json({ status: true, message: "คำร้องขอฝากขายสินค้าสำเร็จ", data: add });
    } catch (err) {
        return res.status(500).json({ status: false, message: err.message });
    }

}

//ดึงข้อมูลคำร้องขอฝากขายสินค้าทั้งหมด
module.exports.getAll = async (req, res) => {
    try {
        const data = await Requestproduct.find().populate({ path: 'product_partner_id', select: 'partner_name partner_company_name' });
        return res.status(200).json({ status: true, message: "ข้อมูลคำร้องขอฝากขายสินค้าทั้งหมด", data: data });
    } catch (err) {
        return res.status(500).json({ status: false, message: err.message });
    }
}
//ดึงข้อมูลคำร้องขอฝากขายสินค้า by id
module.exports.getById = async (req, res) => {
    try {
        const data = await Requestproduct.findById(req.params.id).populate({ path: 'product_partner_id', select: 'partner_name partner_company_name' });
        return res.status(200).json({ status: true, message: "ข้อมูลคำร้องขอฝากขายสินค้า", data: data });
    } catch (err) {
        return res.status(500).json({ status: false, message: err.message });
    }
}
//ดึงข้อมูลคำร้องขอฝากขายสินค้า by partner_id
module.exports.getByPartnerId = async (req, res) => {
    try {
        const data = await Requestproduct.find({ product_partner_id: req.params.id }).populate({ path: 'product_partner_id', select: 'partner_name partner_company_name' });
        return res.status(200).json({ status: true, message: "ข้อมูลคำร้องขอฝากขายสินค้า", data: data });
    } catch (err) {
        return res.status(500).json({ status: false, message: err.message });
    }
}

//อัพเดทข้อมูลคำร้องขอฝากขายสินค้า
module.exports.update = async (req, res) => {
    try {
        const checrequest = await Requestproduct.findById(req.params.id);
        if (checrequest) {
            const data = {
                product_name: req.body.product_name,
                product_status_type: req.body.product_status_type,
                product_category: req.body.product_category,
                product_costprice: req.body.product_costprice,
                product_price: req.body.product_price,
                product_store: req.body.product_store,
                product_partner_id: req.body.product_partner_id,
                product_detail: req.body.product_detail,
                product_stock: req.body.product_stock,
            }
            const edit = await Requestproduct.findByIdAndUpdate(req.params.id, data, { new: true });
            return res.status(200).json({ status: true, message: "อัพเดทข้อมูลคำร้องขอฝากขายสินค้าสำเร็จ", data: edit });
        }
        return res.status(400).json({ status: false, message: "ไม่พบข้อมูลคำร้องขอฝากขายสินค้า" });
    }
    catch (err) {
        return res.status(500).json({ status: false, message: err.message });
    }
}

//ลบข้อมูลคำร้องขอฝากขายสินค้า
module.exports.delete = async (req, res) => {
    try {
        const checkrequest = await Requestproduct.findById(req.params.id);
        if (!checkrequest) return res.status(400).json({ status: false, message: "ไม่พบข้อมูลคำร้องขอฝากขายสินค้า" });
        const data = await Requestproduct.findByIdAndDelete(req.params.id);
        return res.status(200).json({ status: true, message: "ลบข้อมูลคำร้องขอฝากขายสินค้าสำเร็จ", data: data });
    } catch (err) {
        return res.status(500).json({ status: false, message: err.message });
    }
}

//อนุมัติคำร้องขอฝากขายสินค้า
module.exports.approve = async (req, res) => {
    try {
        const checkrequest = await Requestproduct.findById(req.params.id);
        if (!checkrequest) return res.status(400).json({ status: false, message: "ไม่พบข้อมูลคำร้องขอฝากขายสินค้า" });

        //request_status_detail
        const request_status_detail = {
            status: "อนุมัติ",
            date: Date.now()
        }

        const office_id = req.body.office_id;
        const office_name = req.body.office_name;
        checkrequest.request_status_detail.push(request_status_detail);
        const data = await Requestproduct.findByIdAndUpdate(req.params.id, { request_status: true, request_status_detail: checkrequest.request_status_detail, office_id: office_id, office_name: office_name }, { new: true });
        // เพิ่มข้อมูลสินค้า จาก ข้อมูลฝากขายสินค้า
        const product = new Product({
            product_name: data.product_name,
            product_status_type: data.product_status_type,
            product_category: data.product_category,
            product_costprice: data.product_costprice,
            product_price: data.product_price,
            product_store: data.product_store,
            product_partner_id: data.product_partner_id,
            product_detail: data.product_detail,
            product_stock: data.product_stock,
            product_image: data.product_image,
            product_subimage1: data.product_subimage1,
            product_subimage2: data.product_subimage2,
            product_subimage3: data.product_subimage3,
            product_status: true
        });
        const add = await product.save();
        if (data && add) {
            return res.status(200).json({ status: true, message: "อนุมัติคำร้องขอฝากขายสินค้าสำเร็จ", data: data });
        } else {
            return res.status(400).json({ status: false, message: "ไม่สามารถอนุมัติคำร้องขอฝากขายสินค้าได้" });
        }

    } catch (err) {
        return res.status(500).json({ status: false, message: err.message });
    }
}

//ไม่อนุมัติคำร้องขอฝากขายสินค้า
module.exports.disapprove = async (req, res) => {
    try {
        const checkrequest = await Requestproduct.findById(req.params.id);
        if (!checkrequest) return res.status(400).json({ status: false, message: "ไม่พบข้อมูลคำร้องขอฝากขายสินค้า" });
        //request_status_detail
        const request_status_detail = {
            status: "ไม่อนุมัติ",
            date: Date.now()
        }
        const office_id = req.body.office_id;
        const office_name = req.body.office_name;
        checkrequest.request_status_detail.push(request_status_detail);
        const data = await Requestproduct.findByIdAndUpdate(req.params.id, { request_status: false, request_status_detail: checkrequest.request_status_detail, office_id: office_id, office_name: office_name }, { new: true });
        return res.status(200).json({ status: true, message: "ไม่อนุมัติคำร้องขอฝากขายสินค้าสำเร็จ", data: data });
    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, message: err.message });
    }
}

//เพิ่มรูปสินค้า
module.exports.addimgproduct = async (req, res) => {
    try {
        let upload = multer({ storage: storage }).array("image", 20);
        upload(req, res, async function (err) {
            const reqFiles = [];
            const result = [];
            if (err) {
                return res.status(500).send(err);
            }
           

            let image = '' // ตั้งตัวแปรรูป
            //ถ้ามีรูปให้ทำฟังก์ชั่นนี้ก่อน
            if (req.files) {
                const url = '/assets/image/emarket/';
                const reqFiles = [];
          
                req.files.forEach(file => {
                  reqFiles.push(url + file.filename);
                });
          
                image = reqFiles[0];
          
                const product = await Requestproduct.findById(req.params.id);
                if (product.product_image != '')
                {
                    deleteimage(product.product_image);
                }
              } else {
                return res.json({
                  message: "not found any files",
                  status: false
                })
              }

            const data = { product_image: image }
            const edit = await Requestproduct.findByIdAndUpdate(req.params.id, data, { new: true })
            return res.status(200).send({ status: true, message: "เพิ่มรูปภาพเรียบร้อย", data: edit });
        });
    } catch (error) {
        return res.status(500).send({ status: false, error: error.message });
    }

};

//เพิ่มรูปสินค้าย่อย1
module.exports.addsubimgproduct = async (req, res) => {
    try {
        let upload = multer({ storage: storage }).array("image", 20);
        upload(req, res, async function (err) {
            const reqFiles = [];
            const result = [];
            if (err) {
                return res.status(500).send(err);
            }
           

            let image = '' // ตั้งตัวแปรรูป
            //ถ้ามีรูปให้ทำฟังก์ชั่นนี้ก่อน
            if (req.files) {
                const url = '/assets/image/emarket/';
                const reqFiles = [];
          
                req.files.forEach(file => {
                  reqFiles.push(url + file.filename);
                });
          
                image = reqFiles[0];
          
                const product = await Requestproduct.findById(req.params.id);
                if (product.product_subimage1!= '')
                {
                    deleteimage(product.product_subimage1);
                }
              } else {
                return res.json({
                  message: "not found any files",
                  status: false
                })
              }
            const data = { product_subimage1: image }
            const edit = await Requestproduct.findByIdAndUpdate(req.params.id, data, { new: true })
            return res.status(200).send({ status: true, message: "เพิ่มรูปภาพเรียบร้อย", data: edit });
        });
    } catch (error) {
        return res.status(500).send({ status: false, error: error.message });
    }

};
//เพิ่มรูปสินค้าย่อย2
module.exports.addsubimgproduct2 = async (req, res) => {
    try {
        let upload = multer({ storage: storage }).array("image", 20);
        upload(req, res, async function (err) {
            const reqFiles = [];
            const result = [];
            if (err) {
                return res.status(500).send(err);
            }
           

            let image = '' // ตั้งตัวแปรรูป
            //ถ้ามีรูปให้ทำฟังก์ชั่นนี้ก่อน
            if (req.files) {
                const url = '/assets/image/emarket/';
                const reqFiles = [];
          
                req.files.forEach(file => {
                  reqFiles.push(url + file.filename);
                });
          
                image = reqFiles[0];
          
                const product = await Requestproduct.findById(req.params.id);
                if (product.product_subimage2!= '')
                {
                    deleteimage(product.product_subimage2);
                }
              } else {
                return res.json({
                  message: "not found any files",
                  status: false
                })
              }
            const data = { product_subimage2: image }
            const edit = await Requestproduct.findByIdAndUpdate(req.params.id, data, { new: true })
            return res.status(200).send({ status: true, message: "เพิ่มรูปภาพเรียบร้อย", data: edit });
        });
    } catch (error) {
        return res.status(500).send({ status: false, error: error.message });
    }

};
//เพิ่มรูปสินค้าย่อย3
module.exports.addsubimgproduct3 = async (req, res) => {
    try {
        let upload = multer({ storage: storage }).array("image", 20);
        upload(req, res, async function (err) {
            const reqFiles = [];
            const result = [];
            if (err) {
                return res.status(500).send(err);
            }
            const product = await Requestproduct.findById(req.params.id);
        

            let image = '' // ตั้งตัวแปรรูป
            //ถ้ามีรูปให้ทำฟังก์ชั่นนี้ก่อน
            if (req.files) {
                const url = '/assets/image/emarket/';
                const reqFiles = [];
          
                req.files.forEach(file => {
                  reqFiles.push(url + file.filename);
                });
          
                image = reqFiles[0];
          
                const product = await Requestproduct.findById(req.params.id);
                if (product.product_subimage3!= '')
                {
                    deleteimage(product.product_subimage3);
                }
              } else {
                return res.json({
                  message: "not found any files",
                  status: false
                })
              }
            const data = { product_subimage2: image }
            const edit = await Requestproduct.findByIdAndUpdate(req.params.id, data, { new: true })
            return res.status(200).send({ status: true, message: "เพิ่มรูปภาพเรียบร้อย", data: edit });
        });
    } catch (error) {
        return res.status(500).send({ status: false, error: error.message });
    }

};


module.exports.getbyapprove = async (req, res) => {
    try {
        //ดึงข้อมูลคำร้องขอฝากขายสินค้าที่รออนุมัติ เช็คจาก request_status:false และ  request_status_detail ตำแหน่งสุดท้าย status รอการอนุมัติ
        const data = await Requestproduct.find().populate({ path: 'product_partner_id', select: 'partner_name partner_company_name' });
        return res.status(200).json({ status: true, data: data });
    } catch (err) {
        return res.status(500).json({ status: false, message: err.message });
    }
}

//สร้าง token สำหรับการเข้าถึงข้อมูล
module.exports.getpublictoken = async (req, res) => {
    try {
        const typecode = req.body.typecode;
        let token
        if (typecode == "office") {
            token = jwt.sign({ code: "office", name: "office", key: "office" }, process.env.SHOP_SECRET_KET)
        }
        else {
            return res.status(400).json({ message: "ไม่พบ typecode ที่ต้องการ", status: false });
        }
        return res.status(200).json({ message: "สร้าง token สำเร็จ", data: token, status: true });
    } catch (error) {
        return res.status(500).json({ message: error.message, status: false });
    }
}

