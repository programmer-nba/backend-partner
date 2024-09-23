const axios = require("axios");
const dayjs = require("dayjs");
const { ConsignmentProducts, validate } = require("../../models/consignment/consignment.product.model")

//เพิ่มสินค้า producttg
module.exports.addProducttg = async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error) {
            return res.status(400).send({ message: error.details[0].message, status: false });
        } else {
            const product = await ConsignmentProducts.findOne({
                product_name: req.body.product_name
            });
            if (product) {
                return res.status(405).send({
                    status: false,
                    message: "มีสินค้านี้ในระบบแล้ว",
                });
            } else {
                const status = {
                    name: "รอตรวจสอบ",
                    timestamp: dayjs(Date.now()).format(""),
                };
                await new ConsignmentProducts({
                    ...req.body,
                    product_timestamps: status,
                }).save();
                return res.status(201).send({ message: "เพิ่มรายการฝากขายสินค้าสำเร็จ", status: true });
            }
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, error: error.message });
    }
}

module.exports.getCosignmentByPartner = async (req, res) => {
    try {
        const id = req.params.partnerid;

        const pipeling = [
            {
                $match: {
                    product_partner_id: id
                }
            }
        ];

        const results = await ConsignmentProducts.aggregate(pipeling);
        return res.status(200).send({ status: true, message: 'ดึงข้อมูลสำเร็จ', data: results })
    } catch (error) {
        return res.status(500).send({ status: false, error: error.message });
    }
}

module.exports.cancel = async (req, res) => {
    try {
        const id = req.params.id;
        console.log(id)
    } catch (error) {
        return res.status(500).send({ status: false, error: error.message });
    }
}

// ดึงข้อมูลสินค้า producttg by partnerid
module.exports.getProducttg = async (req, res) => {
    try {
        const apiResponse = await axios.get(`${process.env.API_TOSSAGUNSHOP}/product/tossagun/bypartner/${req.params.partnerid}`, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (apiResponse?.data?.status == true) {
            return res.status(200).json({ message: "ดึงข้อมูลสินค้าสำเร็จ", data: apiResponse.data.data, status: true });
        } else {
            return res.status(400).json({ message: "ดึงข้อมูลสินค้าไม่สำเร็จ", status: false });
        }

    } catch (error) {
        return res.status(500).send({ status: false, error: error.message });
    }
}

// แก้ไขข้อมูล producttg
module.exports.editProducttg = async (req, res) => {
    try {
        const apiResponse = await axios.put(`${process.env.API_TOSSAGUNSHOP}/product/tossagun/partner/${req.params.id}`, req.body, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (apiResponse?.data?.status == true) {
            return res.status(200).json({ message: "แก้ไขสินค้าสำเร็จ", status: true });
        } else {
            return res.status(400).json({ message: "แก้ไขสินค้าไม่สำเร็จ", status: false });
        }

    } catch (error) {
        return res.status(500).send({ status: false, error: error.message });
    }
}


// ลบข้อมูล producttg
module.exports.deleteProducttg = async (req, res) => {
    try {
        const apiResponse = await axios.delete(`${process.env.API_TOSSAGUNSHOP}/product/tossagun/partner/${req.params.id}`, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (apiResponse?.data?.status == true) {
            return res.status(200).json({ message: "ลบสินค้าสำเร็จ", status: true });
        } else {
            return res.status(400).json({ message: "ลบสินค้าไม่สำเร็จ", status: false });
        }

    } catch (error) {
        return res.status(500).send({ status: false, error: error.message });
    }
}

// ดึงหมวดหมู่สินค้า
module.exports.getCategory = async (req, res) => {
    try {
        const apiResponse = await axios.get(`${process.env.API_TOSSAGUNSHOP}/product/tossagun/partner/category/all`, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (apiResponse?.data?.status == true) {
            return res.status(200).json({ message: "ดึงหมวดหมู่สินค้าสำเร็จ", data: apiResponse.data.data, status: true });
        } else {
            return res.status(400).json({ message: "ดึงหมวดหมู่สินค้าไม่สำเร็จ", status: false });
        }

    } catch (error) {
        return res.status(500).send({ status: false, error: error.message });
    }
}
