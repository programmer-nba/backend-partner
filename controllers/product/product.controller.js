const jwt = require("jsonwebtoken");
const { Product, validateproduct } = require("../../models/product/product.schema");
const multer = require("multer");
const {
    uploadFileCreate,
    deleteFile,
} = require("../../functions/uploadfilecreate");

const fs = require('fs');
const path = require('path');
// const uploadFolder = path.join(__dirname, '../../assets/image/emarket');
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
    
    const fullPath = path.join(__dirname, '../../', filePath);
    console.log(fullPath)
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

//เพิ่มข้อมูลสินค้า
module.exports.add = async (req, res) => {
    try {
        //เช็คข้อมูลที่กรอกเข้ามา
        const error = validateproduct(req.body);
        if (error.status == false) {
            return res.status(400).send({ message: error.details[0].message, status: false });
        }

        const add = new Product({
            product_name: req.body.product_name,
            product_status_type: req.body.product_status_type,
            product_category: req.body.product_category,
            product_subcategory: req.body.product_subcategory,
            product_provider: req.body.product_provider,
            product_basecost: req.body.product_basecost,
            product_costprice: req.body.product_costprice,
            product_price: req.body.product_price,
            product_store: req.body.product_store,
            product_partner_id: (req.body.product_partner_id == undefined || req.body.product_partner_id == '') ? null : req.body.product_partner_id,
            product_detail: req.body.product_detail,
            product_stock: req.body.product_stock,
            product_package_options: req.body.product_package_options,
            product_status: false
        });

        const save = await add.save();
        if (save) {
            return res.status(200).json({ message: "เพิ่มสินค้าสำเร็จ", data: save, status: true });
        } else {
            return res.status(400).json({ message: "เพิ่มสินค้าไม่สำเร็จ", status: false });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message, status: false });
    }
}

//ดึงข้อมูลสินค้าทั้งหมด 
module.exports.getall = async (req, res) => {
    try {
        const get = await Product.find().populate({ path: 'product_partner_id', select: 'partner_name partner_company_name' });
        if (get) {
            return res.status(200).json({ message: "ดึงข้อมูลสินค้าสำเร็จ", data: get, status: true });
        } else {
            return res.status(400).json({ message: "ดึงข้อมูลสินค้าไม่สำเร็จ", status: false });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message, status: false });
    }
}


//ดึงข้อมูลสินค้าตามไอดี
module.exports.getbyid = async (req, res) => {
    try {
        const get = await Product.findById(req.params.id).populate({ path: 'product_partner_id', select: 'partner_name partner_company_name' });
        if (get) {
            return res.status(200).json({ message: "ดึงข้อมูลสินค้าสำเร็จ", data: get, status: true });
        } else {
            return res.status(400).json({ message: "ดึงข้อมูลสินค้าไม่สำเร็จ", status: false });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message, status: false });
    }
}


//ค้นหาสินค้าตามที่กรอกเข้ามา
module.exports.search = async (req, res) => {
    try {
        //เวลาใส่ชื่อเต็มมันค้นหาไม่เจอ แก้ไง
        const get = await Product.find({
            $or: [
                { product_name: { $regex: req.params.name, $options: 'i' } },
                { product_name: req.params.name }
            ]
        }).populate({ path: 'product_partner_id', select: 'partner_name partner_company_name' })
        if (get) {
            return res.status(200).json({ message: "ค้นหาสินค้าสำเร็จ", data: get, status: true });
        } else {
            return res.status(400).json({ message: "ค้นหาสินค้าไม่สำเร็จ", status: false });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message, status: false });
    }
}



//แก้ไขข้อมูลสินค้า
module.exports.edit = async (req, res) => {
    try {

        //เช็คข้อมูลที่กรอกเข้ามา
        const error = validateproduct(req.body);
        if (error.status == false) {
            return res.status(400).send({ message: error.details[0].message, status: false });
        }
        //เช็คว่ามีไอดีนี้หรือไม่
        const check = await Product.findById(req.params.id);
        if (!check) {
            return res.status(400).json({ message: "ไม่พบข้อมูลสินค้า", status: false });
        }

        const edit = await Product.findByIdAndUpdate(req.params.id, {
            ...req.body
        }, { new: true });

        if (edit) {
            return res.status(200).json({ message: "แก้ไขสินค้าสำเร็จ", data: edit, status: true });
        } else {
            return res.status(400).json({ message: "แก้ไขสินค้าไม่สำเร็จ", status: false });
        }

    } catch (error) {
        return res.status(500).json({ message: error.message, status: false });
    }
}


//ลบข้อมูลสินค้า
module.exports.delete = async (req, res) => {
    try {
        const check = await Product.findById(req.params.id);
        if (!check) {
            return res.status(400).json({ message: "ไม่พบข้อมูลสินค้า", status: false });
        }
        const del = await Product.findByIdAndDelete(req.params.id);
        if (del) {
            check.product_image != '' ? deleteFile(check.product_image) : null
            return res.status(200).json({ message: "ลบสินค้าสำเร็จ", status: true });
        } else {
            return res.status(400).json({ message: "ลบสินค้าไม่สำเร็จ", status: false });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message, status: false });
    }
}


//เปิด-ปิดขายสินค้า
module.exports.status = async (req, res) => {
    try {
        const check = await Product.findById(req.params.id);
        if (!check) {
            return res.status(400).json({ message: "ไม่พบข้อมูลสินค้า", status: false });
        }
        const status = await Product.findByIdAndUpdate(req.params.id, { product_status: req.body.product_status }, { new: true });
        if (status) {
            return res.status(200).json({ message: "เปลี่ยนสถานะสินค้าสำเร็จ", data: status, status: true });
        } else {
            return res.status(400).json({ message: "เปลี่ยนสถานะสินค้าไม่สำเร็จ", status: false });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message, status: false });
    }
}





//เพิ่มรูปสินค้า
module.exports.addimgproduct = async (req, res) => {
    try {
        let upload = multer({ storage: storage }).array("image", 20);
        upload(req, res, async function (err) {
            console.log(req.file)
            const reqFiles = [];
            const result = [];
            if (err) {
                return res.status(500).send(err);
            }

            console.log("อัพโหลดรูปสินค้า")

            let image = '' // ตั้งตัวแปรรูป
            // ถ้ามีรูปให้ทำฟังก์ชั่นนี้ก่อน
            if (req.files) {
                const url = '/assets/image/emarket/';
                const reqFiles = [];

                req.files.forEach(file => {
                reqFiles.push(url + file.filename);
                });

                image = reqFiles[0];

                const product = await Product.findById(req.params.id);
                if (product.product_image != '') {
                    deleteimage(product.product_image);
                }
            } else {
               
                return res.json({
                    message: "not found any file",
                    status: false
                })
            }
            const data = { product_image: image }
            const edit = await Product.findByIdAndUpdate(req.params.id, data, { new: true })
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

                const product = await Product.findById(req.params.id);
                if (product.product_subimage1 != '') {
                    deleteimage(product.product_subimage1);
                }
            } else {
                return res.json({
                    message: "not found any files",
                    status: false
                })
            }
            

            const data = { product_subimage1: image }
            
            const edit = await Product.findByIdAndUpdate(req.params.id, data, { new: true })
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

                const product = await Product.findById(req.params.id);
                if (product.product_subimage2 != '') {
                    deleteimage(product.product_subimage2);
                }
            } else {
                return res.json({
                    message: "not found any files",
                    status: false
                })
            }
            const data = { product_subimage2: image }
            const edit = await Product.findByIdAndUpdate(req.params.id, data, { new: true })
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


            let image = '' // ตั้งตัวแปรรูป
            //ถ้ามีรูปให้ทำฟังก์ชั่นนี้ก่อน
            if (req.files) {
                const url = '/assets/image/emarket/';
                const reqFiles = [];

                req.files.forEach(file => {
                    reqFiles.push(url + file.filename);
                });

                image = reqFiles[0];

                const product = await Product.findById(req.params.id);
                if (product.product_subimage3 != '') {
                    deleteimage(product.product_subimage3);
                }
            } else {
                return res.json({
                    message: "not found any files",
                    status: false
                })
            }
            const data = { product_subimage3: image }
            const edit = await Product.findByIdAndUpdate(req.params.id, data, { new: true })
            return res.status(200).send({ status: true, message: "เพิ่มรูปภาพเรียบร้อย", data: edit });
        });
    } catch (error) {
        return res.status(500).send({ status: false, error: error.message });
    }

};


//ค้นหาตาม partner ตาม id
module.exports.getbypartner = async (req, res) => {
    try {
        const get = await Product.find({ product_partner_id: req.params.id }).populate({ path: 'product_partner_id', select: 'partner_name partner_company_name' });
        if (get) {
            return res.status(200).json({ message: "ดึงข้อมูลสินค้าสำเร็จ", data: get, status: true });
        } else {
            return res.status(400).json({ message: "ดึงข้อมูลสินค้าไม่สำเร็จ", status: false });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message, status: false });
    }
}



//สร้าง token สำหรับการเข้าถึงข้อมูล
module.exports.getpublictoken = async (req, res) => {
    try {
        const typecode = req.body.typecode;
        let token
        if (typecode == "shop") {
            token = jwt.sign({ code: "shop", name: "shop", key: "shop_tossagun" }, process.env.SHOP_SECRET_KET)
        } else if (typecode == "service") {
            token = jwt.sign({ code: "service", name: "service", key: "service" }, process.env.SHOP_SECRET_KET)

        } else if (typecode == "office") {
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
// ดึงข้อมูลสินค้าทั้งหมด ที่เปิดขาย
module.exports.gettruestatus = async (req, res) => {
    try {
        const get = await Product.find({ product_status: true }).populate({ path: 'product_partner_id', select: 'partner_name partner_company_name' });
        if (get) {
            return res.status(200).json({ message: "ดึงข้อมูลสินค้าสำเร็จ", data: get, status: true });
        } else {
            return res.status(400).json({ message: "ดึงข้อมูลสินค้าไม่สำเร็จ", status: false });
        }
    } catch (error) {

        return res.status(500).json({ message: error.message, status: false });
    }
}