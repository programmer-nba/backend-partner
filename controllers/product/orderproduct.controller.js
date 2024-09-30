const { Orderproduct } = require("../../models/product/orderproduct.schema");
const { Product } = require("../../models/product/product.schema");
const Partner = require("../../models/partner.schema");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const dayjs = require("dayjs");

const uploadFolder = path.join(
  __dirname,
  "../../assets/image/emarket/slippayment"
);
fs.mkdirSync(uploadFolder, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadFolder);
  },
  filename: function (req, file, cb) {
    const orderId = req.params.id;
    const extension = path.extname(file.originalname);
    const filename = `slip_order${orderId}${extension}`;
    cb(null, filename);
    console.log(`File saved as: ${filename}`);
  },
});

//สร้างออเดอร์ e-market
module.exports.create = async (req, res) => {
  try {
    //เช็คว่ามี partner ไหม
    const partner = await Partner.findById(req.body.partner_id);
    if (!partner) {
      return res.status(400).json({ message: "ไม่พบ partner", status: false });
    }

    //เช็คว่าของพอสั่งหรือเปล่า
    const product = req.body.product;
    product.forEach(async (element) => {
      const checkproduct = await Product.findById(element.product_id);
      if (checkproduct.product_stock <= element.product_qty) {
        return res.status(400).json({
          message: "สินค้า" + checkproduct.product_name + " มีไม่พอสั่ง",
          status: false,
        });
      }
      element.product_image = checkproduct.product_image;
      element.product_subimage1 = checkproduct.product_subimage1;
      element.product_subimage2 = checkproduct.product_subimage2;
      element.product_subimage3 = checkproduct.product_subimage3;
    });
    //ถ้าพอให้หักสต็อกสินค้าเลย
    product.forEach(async (element) => {
      const checkproduct = await Product.findById(element.product_id);

      checkproduct.product_stock =
        checkproduct.product_stock - element.product_qty;
      await checkproduct.save();
    });
    //สร้างออเดอร์
    const orderproduct = new Orderproduct({
      ...req.body,
      orderref: await runreforder(),
      partner_name: partner.partner_name,
      statusdetail: [{ status: "กำลังเตรียมจัดส่ง", date: Date.now() }],
    });
    const add = await orderproduct.save();
    return res
      .status(200)
      .json({ message: "สร้างออเดอร์สำเร็จ", status: true, data: add });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};

//แสดงออเดอร์ e-market ทั้งหมด
module.exports.getall = async (req, res) => {
  try {
    const orderproduct = await Orderproduct.find();
    return res
      .status(200)
      .json({ message: "แสดงออเดอร์สำเร็จ", status: true, data: orderproduct });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};

//แสดงออเดอร์ e-market ตามไอดี
module.exports.getbyid = async (req, res) => {
  try {
    const orderproduct = await Orderproduct.findById(req.params.id);
    return res
      .status(200)
      .json({ message: "แสดงออเดอร์สำเร็จ", status: true, data: orderproduct });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};

//แสดงออเดอร์ e-market ตามไอดี partner
module.exports.getbyidpartner = async (req, res) => {
  try {
    const orderproduct = await Orderproduct.find({ partner_id: req.params.id });
    return res
      .status(200)
      .json({ message: "แสดงออเดอร์สำเร็จ", status: true, data: orderproduct });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};

module.exports.getbyidcustomer = async (req, res) => {
  try {
    const orderproduct = await Orderproduct.find({
      customer_id: req.params.customer_id,
    });
    return res
      .status(200)
      .json({ message: "แสดงออเดอร์สำเร็จ", status: true, data: orderproduct });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};

//แก้ไขออเดอร์ e-market ตามไอดี
module.exports.update = async (req, res) => {
  try {
    const orderproduct = await Orderproduct.findById(req.params.id);
    if (!orderproduct) {
      return res.status(400).json({ message: "ไม่พบ order", status: false });
    }
    const update = await Orderproduct.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    return res
      .status(200)
      .json({ message: "แก้ไขออเดอร์สำเร็จ", status: true, data: update });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};

//ลบออเดอร์ e-market ตามไอดี
module.exports.delete = async (req, res) => {
  try {
    const orderproduct = await Orderproduct.findById(req.params.id);
    if (!orderproduct) {
      return res.status(400).json({ message: "ไม่พบ order", status: false });
    }
    const del = await Orderproduct.findByIdAndDelete(req.params.id);
    return res
      .status(200)
      .json({ message: "ลบออเดอร์สำเร็จ", status: true, data: del });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};

// จัดส่งออเดอร์แล้ว
module.exports.delivery = async (req, res) => {
  try {
    const orderproduct = await Orderproduct.findById(req.params.id);
    if (!orderproduct) {
      return res.status(400).json({ message: "ไม่พบ order", status: false });
    }

    orderproduct.statusdetail.push({ status: "จัดส่งแล้ว", date: Date.now() });
    const data = {
      statusdetail: orderproduct.statusdetail,
      tracking: req.body.tracking,
    };
    const update = await Orderproduct.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });
    return res
      .status(200)
      .json({ message: "จัดส่งออเดอร์สำเร็จ", status: true, data: update });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};

//ได้รับออเดอร์แล้ว
module.exports.receive = async (req, res) => {
  try {
    const orderproduct = await Orderproduct.findById(req.params.id);
    if (!orderproduct) {
      return res.status(400).json({ message: "ไม่พบ order", status: false });
    }
    orderproduct.statusdetail.push({
      status: "รับสินค้าแล้ว",
      date: Date.now(),
    });
    const update = await Orderproduct.findByIdAndUpdate(
      req.params.id,
      orderproduct,
      { new: true }
    );
    return res
      .status(200)
      .json({ message: "รับสินค้าสำเร็จ", status: true, data: update });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};

// ยกเลิกออเดอร์
module.exports.cancel = async (req, res) => {
  try {
    const orderproduct = await Orderproduct.findById(req.params.id);
    if (!orderproduct) {
      return res.status(400).json({ message: "ไม่พบ order", status: false });
    }
    orderproduct.statusdetail.push({
      status: "ยกเลิกออเดอร์",
      date: Date.now(),
    });
    const update = await Orderproduct.findByIdAndUpdate(
      req.params.id,
      orderproduct,
      { new: true }
    );
    return res
      .status(200)
      .json({ message: "ยกเลิกออเดอร์สำเร็จ", status: true, data: update });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};

module.exports.addSlippayment = async (req, res) => {
  try {
    let upload = multer({ storage: storage }).array("image", 20);
    upload(req, res, async function (err) {
      if (err) {
        return res.status(500).send(err);
      }

      let image = ""; // ตั้งตัวแปรรูป
      //ถ้ามีรูปให้ทำฟังก์ชั่นนี้ก่อน
      if (req.files) {
        const url = "/assets/image/emarket/slippayment";
        const reqFiles = [];

        req.files.forEach((file) => {
          reqFiles.push(url + file.filename);
        });

        image = reqFiles[0];

        const order = await Orderproduct.findById(req.params.id);
        if (order.slip_payment != "") {
          deleteimage(order.slip_payment);
        }
      } else {
        return res.json({
          message: "not found any files",
          status: false,
        });
      }
      const data = { slip_payment: image };
      const edit = await Orderproduct.findByIdAndUpdate(req.params.id, data, {
        new: true,
      });
      return res
        .status(200)
        .send({ status: true, message: "เพิ่มรูปภาพเรียบร้อย", data: edit });
    });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

const deleteimage = (filePath) => {
  console.log(__dirname, "..", filePath);
  const fullPath = path.join(__dirname, "..", filePath);
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

exports.report = async (req, res) => {
  try {
    const id = req.body.id;
    const partner_id = new ObjectId(req.params.partner_id);

    if (id === "day") {
      // Aggregation pipeline to get the daily report with the new calculations
      let reportorder = await Orderproduct.aggregate([
        {
          $match: {
            createdAt: {
              $gte: dayjs().startOf("day").toDate(),
              $lt: dayjs().endOf("day").toDate(),
            },
            "statusdetail.status": "กำลังเตรียมจัดส่ง",
            partner_id: partner_id,
          },
        },
        {
          $unwind: "$product",
        },
        {
          $lookup: {
            from: "products", // Ensure this collection name is correct
            localField: "product.product_id", // Make sure 'product_id' is the correct field to match with
            foreignField: "_id", // Ensure '_id' in products matches the field in 'Orderproduct'
            as: "productDetails",
          },
        },
        {
          $unwind: "$productDetails", // This breaks if productDetails is empty
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y/%m/%d", date: "$createdAt" } },
            total: { $sum: "$alltotal" }, // Total sales (already calculated in Orderproduct)
            count: { $sum: 1 }, // Count of orders
            total_costprice: {
              $sum: {
                $multiply: [
                  "$productDetails.product_costprice",
                  "$product.product_total_qty",
                ],
              },
            }, // Sum of cost prices for all products, accounting for quantities
            total_price: {
              $sum: {
                $multiply: [
                  "$productDetails.product_price",
                  "$product.product_total_qty",
                ],
              },
            }, // Sum of product prices (actual selling prices)
            total_profit: {
              $sum: {
                $multiply: [
                  {
                    $subtract: [
                      { $multiply: ["$productDetails.product_price", 0.93] }, // Sale price * margin
                      "$productDetails.product_costprice", // Cost price
                    ],
                  },
                  "$product.product_total_qty", // Multiply profit per product by quantity
                ],
              },
            },
            total_profit_partnet: {
              $sum: {
                $divide: [
                  {
                    $multiply: [
                      {
                        $subtract: [
                          {
                            $multiply: ["$productDetails.product_price", 0.93],
                          },
                          "$productDetails.product_costprice",
                        ],
                      },
                      "$product.product_total_qty",
                    ],
                  },
                  2,
                ],
              },
            },
            total_profit_tossagun: {
              $sum: {
                $divide: [
                  {
                    $multiply: [
                      {
                        $subtract: [
                          {
                            $multiply: ["$productDetails.product_price", 0.93],
                          },
                          "$productDetails.product_costprice",
                        ],
                      },
                      "$product.product_total_qty",
                    ],
                  },
                  2,
                ],
              },
            },
          },
        },
      ]);

      // If no data, return default values for the day
      if (reportorder.length == 0) {
        reportorder = [
          {
            _id: dayjs().startOf("day").format("YYYY/MM/DD"),
            total: 0,
            count: 0,
            total_costprice: 0,
            total_price: 0,
            total_profit: 0,
            total_profit_partnet: 0,
            total_profit_tossagun: 0,
          },
        ];
      }

      //สินค้าขายดี ประจำวัน
      let reportproduct = await Orderproduct.aggregate([
        {
          $match: {
            createdAt: {
              //เช็ควันที่เริ่มต้น ถึง วันที่สิ้นสุด
              $gte: dayjs().startOf("day").toDate(),
              $lt: dayjs().endOf("day").toDate(),
            },
            "statusdetail.status": "กำลังเตรียมจัดส่ง",
            partner_id: partner_id,
          },
        },
        {
          $unwind: "$product",
        },
        {
          $group: {
            _id: "$product.product_id",
            product_name: { $first: "$product.product_name" },
            count: { $sum: "$product.product_qty" },
          },
        },
      ]);

      //ยอดขายย้อนหลัง ประจำวัน  แสดง มา 7 วัน
      let reportorderback = await Orderproduct.aggregate([
        {
          $match: {
            createdAt: {
              //เช็ควันที่เริ่มต้น ถึง วันที่สิ้นสุด
              $gte: dayjs().startOf("day").subtract(7, "day").toDate(),
              $lt: dayjs().endOf("day").toDate(),
            },
            "statusdetail.status": "กำลังเตรียมจัดส่ง",
            partner_id: partner_id,
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y/%m/%d", date: "$createdAt" } },
            //ยอดขาย
            total: { $sum: "$alltotal" },
            //จำนวนออเดอร์
            count: { $sum: 1 },
            //ยอดขายที่ผ่านแพลต์ฟอร์ม
            platform: {
              $sum: {
                $cond: {
                  if: { $ne: ["$payment", "จ่ายเงินสด"] },
                  then: "$alltotal",
                  else: 0,
                },
              },
            },
            //ยอดขายที่ไม่ผ่านแพลต์ฟอร์ม
            notplatform: {
              $sum: {
                $cond: {
                  if: { $eq: ["$payment", "จ่ายเงินสด"] },
                  then: "$alltotal",
                  else: 0,
                },
              },
            },
          },
        },
      ]);
      if (reportorderback.length == 0) {
        reportorderback = [
          {
            _id: dayjs().startOf("day").format("YYYY/MM/DD"),
            total: 0,
            count: 0,
            platform: 0,
            notplatform: 0,
          },
        ];
      }

      return res.status(200).send({
        reportorder: reportorder,
        reportproduct: reportproduct,
        reportorderback: reportorderback,
        status: true,
        message: "แสดงข้อมูลสำเร็จ",
      });
    } else if (id == "month") {
      //ยอดขายประจำเดือน และ  //จำนวนออเดอร์ต่อเดือน
      let reportorder = await Orderproduct.aggregate([
        {
          $match: {
            createdAt: {
              //เช็ควันที่เริ่มต้น ถึง วันที่สิ้นสุด
              $gte: dayjs().startOf("month").toDate(),
              $lt: dayjs().endOf("month").toDate(),
            },
            "statusdetail.status": "กำลังเตรียมจัดส่ง",
            partner_id: partner_id,
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y/%m/01", date: "$createdAt" } },
            //ยอดขาย
            total: { $sum: "$alltotal" },
            //จำนวนออเดอร์
            count: { $sum: 1 },
            //ยอดขายที่ผ่านแพลต์ฟอร์ม
            platform: {
              $sum: {
                $cond: {
                  if: { $ne: ["$payment", "จ่ายเงินสด"] },
                  then: "$alltotal",
                  else: 0,
                },
              },
            },
            //ยอดขายที่ไม่ผ่านแพลต์ฟอร์ม
            notplatform: {
              $sum: {
                $cond: {
                  if: { $eq: ["$payment", "จ่ายเงินสด"] },
                  then: "$alltotal",
                  else: 0,
                },
              },
            },
          },
        },
      ]);
      if (reportorder.length == 0) {
        reportorder = [
          {
            _id: dayjs().startOf("month").format("YYYY/MM/01"),
            total: 0,
            count: 0,
            platform: 0,
            notplatform: 0,
          },
        ];
      } else {
        reportorder[0].gettoplatform = reportorder[0].total * (25 / 100);
      }

      //สินค้าขายดี ประจำเดือน
      let reportproduct = await Orderproduct.aggregate([
        {
          $match: {
            createdAt: {
              //เช็ควันที่เริ่มต้น ถึง วันที่สิ้นสุด
              $gte: dayjs().startOf("month").toDate(),
              $lt: dayjs().endOf("month").toDate(),
            },
            "statusdetail.status": "กำลังเตรียมจัดส่ง",
            partner_id: partner_id,
          },
        },
        {
          $unwind: "$product",
        },
        {
          $group: {
            _id: "$product.product_id",
            product_name: { $first: "$product.product_name" },
            count: { $sum: "$product.product_qty" },
          },
        },
      ]);

      //ยอดขายย้อนหลัง ประจำเดือน  แสดง มา 12 เดือน
      let reportorderback = await Orderproduct.aggregate([
        {
          $match: {
            createdAt: {
              //เช็ควันที่เริ่มต้น ถึง วันที่สิ้นสุด
              $gte: dayjs().startOf("month").subtract(12, "month").toDate(),
              $lt: dayjs().endOf("month").toDate(),
            },
            "statusdetail.status": "กำลังเตรียมจัดส่ง",
            partner_id: partner_id,
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y/%m/01", date: "$createdAt" } },
            //ยอดขาย
            total: { $sum: "$alltotal" },
            //จำนวนออเดอร์
            count: { $sum: 1 },
            //ยอดขายที่ผ่านแพลต์ฟอร์ม
            platform: {
              $sum: {
                $cond: {
                  if: { $ne: ["$payment", "จ่ายเงินสด"] },
                  then: "$alltotal",
                  else: 0,
                },
              },
            },
            //ยอดขายที่ไม่ผ่านแพลต์ฟอร์ม
            notplatform: {
              $sum: {
                $cond: {
                  if: { $eq: ["$payment", "จ่ายเงินสด"] },
                  then: "$alltotal",
                  else: 0,
                },
              },
            },
          },
        },
      ]);
      if (reportorderback.length == 0) {
        reportorderback = [
          {
            _id: dayjs().startOf("month").format("YYYY/MM/01"),
            total: 0,
            count: 0,
            platform: 0,
            notplatform: 0,
          },
        ];
      }

      return res.status(200).send({
        reportorder: reportorder,
        reportproduct: reportproduct,
        reportorderback: reportorderback,
        status: true,
        message: "แสดงข้อมูลสำเร็จ",
      });
    } else if (id == "year") {
      //ยอดขายประจำปี และ  //จำนวนออเดอร์ต่อปี
      let reportorder = await Orderproduct.aggregate([
        {
          $match: {
            createdAt: {
              //เช็ควันที่เริ่มต้น ถึง วันที่สิ้นสุด
              $gte: dayjs().startOf("year").toDate(),
              $lt: dayjs().endOf("year").toDate(),
            },
            "statusdetail.status": "กำลังเตรียมจัดส่ง",
            partner_id: partner_id,
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y/01/01", date: "$createdAt" } },
            //ยอดขาย
            total: { $sum: "$alltotal" },
            //จำนวนออเดอร์
            count: { $sum: 1 },
            //ยอดขายที่ผ่านแพลต์ฟอร์ม
            platform: {
              $sum: {
                $cond: {
                  if: { $ne: ["$payment", "จ่ายเงินสด"] },
                  then: "$alltotal",
                  else: 0,
                },
              },
            },
            //ยอดขายที่ไม่ผ่านแพลต์ฟอร์ม
            notplatform: {
              $sum: {
                $cond: {
                  if: { $eq: ["$payment", "จ่ายเงินสด"] },
                  then: "$alltotal",
                  else: 0,
                },
              },
            },
          },
        },
      ]);

      if (reportorder.length == 0) {
        reportorder = [
          {
            _id: dayjs().startOf("year").format("YYYY-01-01"),
            total: 0,
            count: 0,
            platform: 0,
            notplatform: 0,
          },
        ];
      } else {
        reportorder[0].gettoplatform = reportorder[0].total * (25 / 100);
      }
      //สินค้าขายดี ประจำปี
      let reportproduct = await Orderproduct.aggregate([
        {
          $match: {
            createdAt: {
              //เช็ควันที่เริ่มต้น ถึง วันที่สิ้นสุด
              $gte: dayjs().startOf("year").toDate(),
              $lt: dayjs().endOf("year").toDate(),
            },
            "statusdetail.status": "กำลังเตรียมจัดส่ง",
            partner_id: partner_id,
          },
        },
        {
          $unwind: "$product",
        },
        {
          $group: {
            _id: "$product.product_id",
            product_name: { $first: "$product.product_name" },
            count: { $sum: "$product.product_qty" },
          },
        },
      ]);

      //ยอดขายย้อนหลัง ประจำปี  แสดง มา 7 ปี
      let reportorderback = await Orderproduct.aggregate([
        {
          $match: {
            createdAt: {
              //เช็ควันที่เริ่มต้น ถึง วันที่สิ้นสุด
              $gte: dayjs().startOf("year").subtract(7, "year").toDate(),
              $lt: dayjs().endOf("year").toDate(),
            },
            "statusdetail.status": "กำลังเตรียมจัดส่ง",
            partner_id: partner_id,
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y/01/01", date: "$createdAt" } },
            //ยอดขาย
            total: { $sum: "$alltotal" },
            //จำนวนออเดอร์
            count: { $sum: 1 },
            //ยอดขายที่ผ่านแพลต์ฟอร์ม
            platform: {
              $sum: {
                $cond: {
                  if: { $ne: ["$payment", "จ่ายเงินสด"] },
                  then: "$alltotal",
                  else: 0,
                },
              },
            },
            //ยอดขายที่ไม่ผ่านแพลต์ฟอร์ม
            notplatform: {
              $sum: {
                $cond: {
                  if: { $eq: ["$payment", "จ่ายเงินสด"] },
                  then: "$alltotal",
                  else: 0,
                },
              },
            },
          },
        },
      ]);
      if (reportorderback.length == 0) {
        reportorderback = [
          {
            _id: dayjs().startOf("year").format("YYYY-01-01"),
            total: 0,
            count: 0,
            platform: 0,
            notplatform: 0,
          },
        ];
      }

      return res.status(200).send({
        reportorder: reportorder,
        reportproduct: reportproduct,
        reportorderback: reportorderback,
        status: true,
        message: "แสดงข้อมูลสำเร็จ",
      });
    } else {
      return res
        .status(400)
        .send({ status: false, message: "กรุณาข้อมูลประเภทไม่ถูกต้อง" });
    }
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

//ฟังก์ชั่น สร้างเลขอ้างอิง order
async function runreforder() {
  const startDate = new Date(new Date().setHours(0, 0, 0, 0)); // เริ่มต้นของวันนี้
  const endDate = new Date(new Date().setHours(23, 59, 59, 999)); // สิ้นสุดของวันนี้
  const number = await Orderproduct.find({
    createdAt: { $gte: startDate, $lte: endDate },
  }).countDocuments();
  const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  let referenceNumber = String(number).padStart(5, "0");
  let ref = `Order${currentDate}${referenceNumber}`;
  let loopnum = 0;
  let check = await Orderproduct.find({ orderref: ref }).countDocuments();
  if (check !== 0) {
    do {
      check = await Orderproduct.find({ orderref: ref }).countDocuments();
      if (check != 0) {
        loopnum++;
        referenceNumber = String(number + loopnum).padStart(5, "0");
        ref = `Order${currentDate}${referenceNumber}`;
      }
    } while (check !== 0);
  }

  return ref;
}
