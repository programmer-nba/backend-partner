const { Orderproduct } = require("../../models/product/orderproduct.schema");
const { Product } = require("../../models/product/product.schema");
const Partner = require("../../models/partner.schema");
const multer = require("multer");
const XLSX = require("xlsx");
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
    let upload = multer({ storage: storage }).array("image_slip", 20);
    upload(req, res, async function (err) {
      if (err) {
        return res.status(500).send(err);
      }

      let image_slip = ""; // ตั้งตัวแปรรูป
      //ถ้ามีรูปให้ทำฟังก์ชั่นนี้ก่อน
      if (req.files) {
        const url = "/assets/image/emarket/slippayment";
        const reqFiles = [];

        req.files.forEach((file) => {
          reqFiles.push(url + file.filename);
        });

        image_slip = reqFiles[0];

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
      const data = { slip_payment: image_slip };
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

exports.exportReportToExcel = async (req, res) => {
  try {
    const id = req.body.id;
    const partner_id = new ObjectId(req.body.partner_id);

    const { startDate, endDate, rangeDate, format_type } = getDateRange(id);

    // Generate the report data
    const reportData = await generateReport({
      startDate: rangeDate,
      endDate: endDate,
      format_type: "%Y/%m/%d",
      partner_id: partner_id,
    });

    const workbook = XLSX.utils.book_new();

    const worksheet = XLSX.utils.json_to_sheet(reportData);

    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

    const exportDir = path.join(
      __dirname,
      "../../assets/image/emarket/exports_report"
    );
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true });
    }

    const filePath = path.join(exportDir, `report_${Date.now()}.xlsx`);
    console.log("File path:", filePath);

    XLSX.writeFile(workbook, filePath);
    console.log("File written successfully!");

    res.download(filePath, (err) => {
      if (err) {
        console.error("File download error: ", err);
      }
    });
  } catch (error) {
    console.error("Error generating report: ", error);
    res.status(500).send({ message: "Error generating report", error });
  }
};

exports.report = async (req, res) => {
  try {
    const id = req.body.id;
    const partner_id = new ObjectId(req.params.partner_id);
    let startDate, endDate, rangeDate, format_type;

    if (id === "custom") {
      startDate = new Date(req.body.startDate);
      endDate = new Date(req.body.endDate);
      endDate.setHours(23, 59, 59, 999);
      rangeDate = dayjs(startDate).subtract(7, "day").toDate();
      format_type = "%Y/%m/%d";
    } else {
      ({ startDate, endDate, rangeDate, format_type } = getDateRange(id));
    }

    const reportorder = await generateReport({
      startDate,
      endDate,
      format_type,
      partner_id,
      id,
    });
    const reportproduct = await generateProductReport({
      startDate,
      endDate,
      partner_id,
    });
    const reportorderback = await generateReportBack({
      rangeDate,
      endDate,
      format_type,
      partner_id,
      id,
    });

    // if (!reportorder.length) {
    //   reportorder.push({
    //     _id: dayjs(startDate).format("YYYY/MM/DD"),
    //     total: 0,
    //     count: 0,
    //     total_basecost: 0,
    //     total_costprice: 0,
    //     total_price: 0,
    //     total_profit: 0,
    //     total_profit_partner: 0,
    //     total_profit_tossagun: 0,
    //     prepared_order: 0,
    //     delivered_order: 0,
    //     received_order: 0,
    //     cancelled_order: 0,
    //   });
    // }

    // if (!reportorderback.length) {
    //   reportorderback.push({
    //     _id: dayjs(rangeDate).format("YYYY/MM/DD"),
    //     total: 0,
    //     count: 0,
    //   });
    // }

    res.status(200).json({
      reportorder,
      reportproduct,
      reportorderback,
      status: true,
      message: "แสดงข้อมูลสำเร็จ",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "เกิดข้อผิดพลาด" });
  }
};

const generateReport = async ({
  startDate,
  endDate,
  format_type,
  partner_id,
  id,
}) => {
  const dateGroup =
    id === "week"
      ? {
          _id: {
            $dateToString: {
              format: "%Y/%m/%d",
              date: {
                $dateTrunc: {
                  unit: "week",
                  date: "$createdAt",
                  startOfWeek: "sunday",
                },
              },
            },
          },
        }
      : id === "custom"
      ? {
          _id: {
            $concat: [
              {
                $dateToString: {
                  format: "%Y/%m/%d",
                  date: startDate,
                },
              },
              " - ",
              {
                $dateToString: {
                  format: "%Y/%m/%d",
                  date: endDate,
                },
              },
            ],
          },
        }
      : {
          _id: {
            $dateToString: {
              format: format_type,
              date: "$createdAt",
            },
          },
        };

  return Orderproduct.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lt: endDate },
        partner_id: partner_id,
      },
    },
    { $unwind: "$product" },
    {
      $lookup: {
        from: "products",
        localField: "product.product_id",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    { $unwind: "$productDetails" },
    {
      $group: {
        _id: "$_id",
        orderTotal: { $first: "$alltotal" },
        createdAt: { $first: "$createdAt" },
        statusdetail: { $first: "$statusdetail" },
        productTotals: {
          $push: {
            baseCost: {
              $multiply: [
                "$productDetails.product_basecost",
                "$product.product_qty",
              ],
            },
            costPrice: {
              $multiply: [
                "$productDetails.product_costprice",
                "$product.product_qty",
              ],
            },
            price: {
              $multiply: [
                "$productDetails.product_price",
                "$product.product_qty",
              ],
            },
            profit: {
              $multiply: [
                {
                  $subtract: [
                    "$productDetails.product_costprice",
                    { $ifNull: ["$productDetails.product_basecost", 0] },
                  ],
                },
                "$product.product_qty",
              ],
            },
          },
        },
      },
    },
    {
      $addFields: {
        total_basecost: { $sum: "$productTotals.baseCost" },
        total_costprice: { $sum: "$productTotals.costPrice" },
        total_price: { $sum: "$productTotals.price" },
        total_profit: { $sum: "$productTotals.profit" },
        latestStatus: {
          $arrayElemAt: [
            {
              $filter: {
                input: "$statusdetail",
                as: "status",
                cond: { $ne: ["$$status.status", ""] },
              },
            },
            -1,
          ],
        },
      },
    },
    {
      $group: {
        ...dateGroup,
        total: { $sum: "$orderTotal" },
        count: { $sum: 1 },
        total_basecost: { $sum: "$total_basecost" },
        total_costprice: { $sum: "$total_costprice" },
        total_price: { $sum: "$total_price" },
        total_profit: { $sum: "$total_profit" },
        total_profit_partner: { $sum: { $divide: ["$total_profit", 2] } },
        total_profit_tossagun: { $sum: { $divide: ["$total_profit", 2] } },
        prepared_order: {
          $sum: {
            $cond: [
              { $eq: ["$latestStatus.status", "กำลังเตรียมจัดส่ง"] },
              1,
              0,
            ],
          },
        },
        delivered_order: {
          $sum: {
            $cond: [{ $eq: ["$latestStatus.status", "จัดส่งแล้ว"] }, 1, 0],
          },
        },
        received_order: {
          $sum: {
            $cond: [{ $eq: ["$latestStatus.status", "รับสินค้าแล้ว"] }, 1, 0],
          },
        },
        cancelled_order: {
          $sum: {
            $cond: [{ $eq: ["$latestStatus.status", "ยกเลิกออเดอร์"] }, 1, 0],
          },
        },
      },
    },
  ]).then((results) => {
    if (!results.length) {
      return [
        {
          _id: id === "custom"
            ? `${dayjs(startDate).format("YYYY/MM/DD")} - ${dayjs(endDate).format("YYYY/MM/DD")}`
            : dayjs(startDate).format("YYYY/MM/DD"),
          total: 0,
          count: 0,
          total_basecost: 0,
          total_costprice: 0,
          total_price: 0,
          total_profit: 0,
          total_profit_partner: 0,
          total_profit_tossagun: 0,
          prepared_order: 0,
          delivered_order: 0,
          received_order: 0,
          cancelled_order: 0,
        },
      ];
    }
    return results;
  });
};

const generateReportBack = async ({
  rangeDate,
  endDate,
  partner_id,
  format_type,
  id,
}) => {
  const dateGroup =
    id === "week"
      ? {
          _id: {
            $dateToString: {
              format: "%Y/%m/%d",
              date: {
                $dateTrunc: {
                  unit: "week",
                  date: "$createdAt",
                  startOfWeek: "sunday",
                },
              },
            },
          },
        }
      : id === "custom"
      ? {
          _id: {
            $dateToString: {
              format: "%Y/%m/%d",
              date: "$createdAt",
            },
          },
        }
      : {
          _id: {
            $dateToString: {
              format: format_type,
              date: "$createdAt",
            },
          },
        };

  return Orderproduct.aggregate([
    {
      $match: {
        createdAt: { $gte: rangeDate, $lt: endDate },
        "statusdetail.status": "กำลังเตรียมจัดส่ง",
        partner_id: partner_id,
      },
    },
    {
      $group: {
        ...dateGroup,
        total: { $sum: "$alltotal" },
        count: { $sum: 1 },
      },
    },
  ]).then((results) => {
    if (!results.length) {
      return [
        {
          _id: dayjs(rangeDate).format("YYYY/MM/DD"),
          total: 0,
          count: 0,
        },
      ];
    }
    return results;
  });
};

const generateProductReport = async ({ startDate, endDate, partner_id }) => {
  return Orderproduct.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lt: endDate },
        "statusdetail.status": "กำลังเตรียมจัดส่ง",
        partner_id: partner_id,
      },
    },
    { $unwind: "$product" },
    {
      $group: {
        _id: "$product.product_id",
        product_name: { $first: "$product.product_name" },
        count: { $sum: "$product.product_qty" },
      },
    },
  ]);
};

const getDateRange = (id) => {
  switch (id) {
    case "day":
      return {
        startDate: dayjs().startOf("day").toDate(),
        endDate: dayjs().endOf("day").toDate(),
        rangeDate: dayjs().startOf("day").subtract(7, "day").toDate(),
        format_type: "%Y/%m/%d",
      };
    case "week":
      return {
        startDate: dayjs().startOf("week").toDate(),
        endDate: dayjs().endOf("week").toDate(),
        rangeDate: dayjs().startOf("week").subtract(4, "week").toDate(),
        format_type: "%Y/%m/%d",
      };
    case "month":
      return {
        startDate: dayjs().startOf("month").toDate(),
        endDate: dayjs().endOf("month").toDate(),
        rangeDate: dayjs().startOf("month").subtract(12, "month").toDate(),
        format_type: "%Y/%m/01",
      };
    case "year":
      return {
        startDate: dayjs().startOf("year").toDate(),
        endDate: dayjs().endOf("year").toDate(),
        rangeDate: dayjs().startOf("year").subtract(7, "year").toDate(),
        format_type: "%Y/01/01",
      };
    default:
      throw new Error("Invalid report type");
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
