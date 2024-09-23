const mongoose = require("mongoose");
const Joi = require("joi");

const ConsignmentProductSchema = new mongoose.Schema({
	product_partner_id: { type: String, require: true },
	product_name: { type: String, require: true },
	product_barcode: { type: String, require: false, default: "" },
	product_category: { type: String, require: true },
	product_cost: { type: Number, require: true },
	product_price: { type: Number, require: true },
	product_detail: { type: String, require: true },
	product_stock: { type: Number, require: true },
	product_status: { type: Boolean, require: false, default: false },
	product_timestamps: { type: Array, required: false, default: [] },
	product_employee: { type: String, required: false, default: "ไม่มี" },
});

const ConsignmentProducts = mongoose.model("consignment_product", ConsignmentProductSchema);

const validate = (data) => {
	const schema = Joi.object({
		product_partner_id: Joi.string().required().label("กรุณากรอกไอดีพาร์ทเนอร์"),
		product_name: Joi.string().required().label("กรุณากรอกชื่อสินค้า"),
		product_category: Joi.string().required().label("กรุณากรอกไอดีประเภทสินค้า"),
		product_barcode: Joi.string().default(""),
		product_cost: Joi.number().required().label("กรุณากรอกราคาต้นทุน"),
		product_price: Joi.number().required().label("กรุณากรอกราคาขาย"),
		product_detail: Joi.string().required().label("กรุณากรอกรายละเอียดสินค้า"),
		product_stock: Joi.number().required().label("กรุณากรอกจำนวนสินค้า"),
		product_status: Joi.boolean().default(false),
		product_timestamps: Joi.array().default([]),
		product_employee: Joi.string().default("ไม่มี"),
	});
	return schema.validate(data);
};

module.exports = { ConsignmentProducts, validate };