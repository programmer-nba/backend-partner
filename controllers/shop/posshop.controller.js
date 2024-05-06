const {Posorder} = require('../../models/shop/posorder.schema');
const dayjs = require('dayjs');


const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

// สร้างออเดอร์ pos 
exports.create = async (req, res) => {
    try {
        const posorder = new Posorder({...req.body,pos_ref:await runreferralcode(),
            pos_status:[{status:"รอออเดอร์",date:Date.now()}]});
        const add =  await posorder.save();
        if(add){
            return res.status(201).send({data:posorder,status:true,message:"เพิม่ข้อมูลสำเร็จ"});
        }else{
            return res.status(400).send({data:null,status:false,message:"เพิ่มข้อมูลไม่สำเร็จ"});
        }
    } catch (error) {
        return res.status(500).send({status:false,message:error.message});
    }
};


// แสดงข้อมูลออเดอร์ pos ทั้งหมด
exports.findAll = async (req, res) => {
    try {
       
        const posorder = await Posorder.find();
        if(posorder){
            return res.status(200).send({data:posorder,status:true,message:"แสดงข้อมูลสำเร็จ"});
        }else{
            return res.status(404).send({data:null,status:false,message:"ไม่พบข้อมูล"});
        }
    } catch (error) {
        return res.status(500).send({status:false,message:error.message});
    }
};


// แสดงข้อมูลออเดอร์ pos ตามรหัสออเดอร์
exports.findOne = async (req, res) => {
    try {
        const posorder = await Posorder.findById(req.params.id);
        if(posorder){
            return res.status(200).send({data:posorder,status:true,message:"แสดงข้อมูลสำเร็จ"});
        }else{
            return res.status(404).send({data:null,status:false,message:"ไม่พบข้อมูล"});
        }
    } catch (error) {
        return res.status(500).send({status:false,message:error.message});
    }
};

//แสดงออเดอร์ pos ตามร้านค้า
exports.findShop = async (req, res) => {
    try {
        const posorder = await Posorder.find({shop_id:req.params.id});
        if(posorder){
            return res.status(200).send({data:posorder,status:true,message:"แสดงข้อมูลสำเร็จ"});
        }else{
            return res.status(404).send({data:null,status:false,message:"ไม่พบข้อมูล"});
        }
    } catch (error) {
        return res.status(500).send({status:false,message:error.message});
    }
};
//แสดงออเดอร์ pos ตามร้านค้า แต่รอออเดอร์
exports.findShopWait = async (req, res) => {
    try {
         //ค้นหาข้อมูล ตามร้านค้า และ สถานะรอออเดอร์เป็นตำแหน่งสุดท้าย array ที่เป็น รอออเดอร์
         
        const posorder = await Posorder.find({shop_id:req.params.id});
        if(!posorder){
            return res.status(404).send({data:null,status:false,message:"ไม่พบข้อมูล"});
        }
        const posorderwait = posorder.filter((item) => item.pos_status[item.pos_status.length - 1].status == "รอออเดอร์");
        if(posorderwait){
            return res.status(200).send({data:posorderwait,status:true,message:"แสดงข้อมูลสำเร็จ"});
        }else{
            return res.status(404).send({data:null,status:false,message:"ไม่พบข้อมูล"});
        }
    } catch (error) {
        return res.status(500).send({status:false,message:error.message});
    }
};

//แสดงออเดอร์ pos ตามร้านค้า แต่ออเดอร์สำเร็จ
exports.findShopSuccess = async (req, res) => {
    try {
        //ค้นหาข้อมูล ตามร้านค้า และ สถานะรอออเดอร์เป็นตำแหน่งสุดท้าย array ที่เป็น ออเดอร์สำเร็จ
        const posorder = await Posorder.find({shop_id:req.params.id});
        if(!posorder){
            return res.status(404).send({data:null,status:false,message:"ไม่พบข้อมูล"});
        }
        const posordersuccess = posorder.filter((item) => item.pos_status[item.pos_status.length - 1].status == "ออเดอร์สำเร็จ");
        if(posordersuccess){
            return res.status(200).send({data:posordersuccess,status:true,message:"แสดงข้อมูลสำเร็จ"});
        }else{
            return res.status(404).send({data:null,status:false,message:"ไม่พบข้อมูล"});
        }
    } catch (error) {
        return res.status(500).send({status:false,message:error.message});
    }
};

//แสดงออเดอร์ pos ตามร้านค้า แต่ยกเลิกออเดอร์
exports.findShopCancel = async (req, res) => {
    try {
        //ค้นหาข้อมูล ตามร้านค้า และ สถานะรอออเดอร์เป็นตำแหน่งสุดท้าย array ที่เป็น ยกเลิก
        const posorder = await Posorder.find({shop_id:req.params.id});
        if(!posorder){
            return res.status(404).send({data:null,status:false,message:"ไม่พบข้อมูล"});
        }
        const posordercancel = posorder.filter((item) => item.pos_status[item.pos_status.length - 1].status == "ยกเลิก");
        if(posordercancel){
            return res.status(200).send({data:posordercancel,status:true,message:"แสดงข้อมูลสำเร็จ"});
        }
        else{
            return res.status(404).send({data:null,status:false,message:"ไม่พบข้อมูล"});
        }
    } catch (error) {
        return res.status(500).send({status:false,message:error.message});
    }
};


//เปลี่ยนสถานะ เป็น ออเดอร์สำเร็จ
exports.success = async (req, res) => {
    try{
        const posorder = await Posorder.findById(req.params.id);
        if(!posorder){
            return res.status(404).send({data:null,status:false,message:"ไม่พบข้อมูล"});
        }
        posorder.pos_status.push({status:"ออเดอร์สำเร็จ",date:Date.now()});
        const update = await posorder.save();
        if(update){
            return res.status(200).send({data:update,status:true,message:"แก้ไขข้อมูลสำเร็จ"});
        }else{
            return res.status(400).send({data:null,status:false,message:"แก้ไขข้อมูลไม่สำเร็จ"});
        }
    }catch(error){
        return res.status(500).send({status:false,message:error.message});
    }
}
//เปลี่ยนสถานะ เป็น ยกเลิกออเดอร์
exports.cancel = async (req, res) => {
    try{
        const posorder = await Posorder.findById(req.params.id);
        if(!posorder){
            return res.status(404).send({data:null,status:false,message:"ไม่พบข้อมูล"});
        }
        posorder.pos_status.push({status:"ยกเลิก",date:Date.now()});
        const update = await posorder.save();
        if(update){
            return res.status(200).send({data:update,status:true,message:"แก้ไขข้อมูลสำเร็จ"});
        }else{
            return res.status(400).send({data:null,status:false,message:"แก้ไขข้อมูลไม่สำเร็จ"});
        }
    }catch(error){
        return res.status(500).send({status:false,message:error.message});
    }
}


// report รายได้ร้านค้า
exports.report = async (req, res) => {
    try{
        
        const id = req.body.id;
        const shop_id = new ObjectId(req.params.shop_id);
        if(id =='day')
        {
            
            //ยอดขายประจำวัน และ  //จำนวนออเดอร์ต่อวัน
            let reportorder = await Posorder.aggregate([
                {
                    $match: {
                        createdAt: {
                            //เช็ควันที่เริ่มต้น ถึง วันที่สิ้นสุด
                            $gte: dayjs().startOf('day').toDate(),
                            $lt: dayjs().endOf('day').toDate()
                        },
                        "pos_status.status": "ออเดอร์สำเร็จ",
                        shop_id: shop_id

                    }
                },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y/%m/%d", date: "$createdAt" }},
                        //ยอดขาย
                        total: { $sum: "$pos_alltotal" },
                        //จำนวนออเดอร์
                        count: { $sum: 1 },
                        //ยอดขายที่ผ่านแพลต์ฟอร์ม
                        platform: { $sum: { $cond: { if: { $ne: ["$pos_payment", "จ่ายเงินสด"] }, then: "$pos_alltotal", else: 0 } } },
                        //ยอดขายที่ไม่ผ่านแพลต์ฟอร์ม
                        notplatform: { $sum: { $cond: { if: { $eq: ["$pos_payment", "จ่ายเงินสด"]  }, then: "$pos_alltotal", else: 0 } } }

                    }
                }
            ])

            if(reportorder.length == 0){
                reportorder =[{
                    _id: dayjs().startOf('day').format("YYYY/MM/DD"),
                    total: 0,
                    count: 0,
                    platform: 0,
                    notplatform: 0
                }]
            }

            //สินค้าขายดี ประจำวัน
            let reportproduct = await Posorder.aggregate([
                {
                    $match: {
                        createdAt: {
                            //เช็ควันที่เริ่มต้น ถึง วันที่สิ้นสุด
                            $gte: dayjs().startOf('day').toDate(),
                            $lt: dayjs().endOf('day').toDate()
                        },
                        "pos_status.status": "ออเดอร์สำเร็จ",
                        shop_id: shop_id
                    }
                },
                {
                    $unwind: "$pos_order"
                },
                {
                    $group: {
                        _id: "$pos_order.productshop_id",
                        productshop_name: { $first: "$pos_order.productshop_name" },
                        count: { $sum: "$pos_order.productshop_qty" }
                    }
                }
            ])
           
            //ยอดขายย้อนหลัง ประจำวัน  แสดง มา 7 วัน 
            let reportorderback = await Posorder.aggregate([
                {
                    $match: {
                        createdAt: {
                            //เช็ควันที่เริ่มต้น ถึง วันที่สิ้นสุด
                            $gte: dayjs().startOf('day').subtract(7, 'day').toDate(),
                            $lt: dayjs().endOf('day').toDate()
                        },
                        "pos_status.status": "ออเดอร์สำเร็จ",
                        shop_id: shop_id
                    }
                },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y/%m/%d", date: "$createdAt" } },
                        //ยอดขาย
                        total: { $sum: "$pos_alltotal" },
                        //จำนวนออเดอร์
                        count: { $sum: 1 },
                        //ยอดขายที่ผ่านแพลต์ฟอร์ม
                        platform: { $sum: { $cond: { if: { $ne: ["$pos_payment", "จ่ายเงินสด"] }, then: "$pos_alltotal", else: 0 } } },
                        //ยอดขายที่ไม่ผ่านแพลต์ฟอร์ม
                        notplatform: { $sum: { $cond: { if: { $eq: ["$pos_payment", "จ่ายเงินสด"]  }, then: "$pos_alltotal", else: 0 } } }

                    }
                }
            ])
            if(reportorderback.length == 0){
                reportorderback =[{
                    _id: dayjs().startOf('day').format("YYYY/MM/DD"),
                    total: 0,
                    count: 0,
                    platform: 0,
                    notplatform: 0
                }]
            }

            return res.status(200).send({reportorder:reportorder,reportproduct:reportproduct,reportorderback:reportorderback,status:true,message:"แสดงข้อมูลสำเร็จ"});

        }
        else if(id =='month')
        {
            //ยอดขายประจำเดือน และ  //จำนวนออเดอร์ต่อเดือน
            let reportorder = await Posorder.aggregate([
                {
                    $match: {
                        createdAt: {
                            //เช็ควันที่เริ่มต้น ถึง วันที่สิ้นสุด
                            $gte: dayjs().startOf('month').toDate(),
                            $lt: dayjs().endOf('month').toDate()
                        },
                        "pos_status.status": "ออเดอร์สำเร็จ",
                        shop_id: shop_id

                    }
                },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y/%m/01", date: "$createdAt" }} ,
                        //ยอดขาย
                        total: { $sum: "$pos_alltotal" },
                        //จำนวนออเดอร์
                        count: { $sum: 1 },
                        //ยอดขายที่ผ่านแพลต์ฟอร์ม
                        platform: { $sum: { $cond: { if: { $ne: ["$pos_payment", "จ่ายเงินสด"] }, then: "$pos_alltotal", else: 0 } } },
                        //ยอดขายที่ไม่ผ่านแพลต์ฟอร์ม
                        notplatform: { $sum: { $cond: { if: { $eq: ["$pos_payment", "จ่ายเงินสด"]  }, then: "$pos_alltotal", else: 0 } } }

                    }
                }
            ])
            if(reportorder.length == 0){
                reportorder =[{
                    _id: dayjs().startOf('month').format("YYYY/MM/01"),
                    total: 0,
                    count: 0,
                    platform: 0,
                    notplatform: 0
                }]
            }

            //สินค้าขายดี ประจำเดือน
            let reportproduct = await Posorder.aggregate([
                {
                    $match: {
                        createdAt: {
                            //เช็ควันที่เริ่มต้น ถึง วันที่สิ้นสุด
                            $gte: dayjs().startOf('month').toDate(),
                            $lt: dayjs().endOf('month').toDate()
                        },
                        "pos_status.status": "ออเดอร์สำเร็จ",
                        shop_id: shop_id
                    }
                },
                {
                    $unwind: "$pos_order"
                },
                {
                    $group: {
                        _id: "$pos_order.productshop_id",
                        productshop_name: { $first: "$pos_order.productshop_name" },
                        count: { $sum: "$pos_order.productshop_qty" }
                    }
                }
            ])
            
           
            //ยอดขายย้อนหลัง ประจำเดือน  แสดง มา 12 เดือน
            let reportorderback = await Posorder.aggregate([
                {
                    $match: {
                        createdAt: {
                            //เช็ควันที่เริ่มต้น ถึง วันที่สิ้นสุด
                            $gte: dayjs().startOf('month').subtract(12, 'month').toDate(),
                            $lt: dayjs().endOf('month').toDate()
                        },
                        "pos_status.status": "ออเดอร์สำเร็จ",
                        shop_id: shop_id
                    }
                },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y/%m/01", date: "$createdAt" } },
                        //ยอดขาย
                        total: { $sum: "$pos_alltotal" },
                        //จำนวนออเดอร์
                        count: { $sum: 1 },
                        //ยอดขายที่ผ่านแพลต์ฟอร์ม
                        platform: { $sum: { $cond: { if: { $ne: ["$pos_payment", "จ่ายเงินสด"] }, then: "$pos_alltotal", else: 0 } } },
                        //ยอดขายที่ไม่ผ่านแพลต์ฟอร์ม
                        notplatform: { $sum: { $cond: { if: { $eq: ["$pos_payment", "จ่ายเงินสด"]  }, then: "$pos_alltotal", else: 0 } } }

                    }
                }
            ])
            if(reportorderback.length == 0){
                reportorderback =[{
                    _id: dayjs().startOf('month').format("YYYY/MM/01"),
                    total: 0,
                    count: 0,
                    platform: 0,
                    notplatform: 0
                }]
            }

            return res.status(200).send({reportorder:reportorder,reportproduct:reportproduct,reportorderback:reportorderback,status:true,message:"แสดงข้อมูลสำเร็จ"});

        }
        else if(id =='year'){

            //ยอดขายประจำปี และ  //จำนวนออเดอร์ต่อปี
            let reportorder = await Posorder.aggregate([
                {
                    $match: {
                        createdAt: {
                            //เช็ควันที่เริ่มต้น ถึง วันที่สิ้นสุด
                            $gte: dayjs().startOf('year').toDate(),
                            $lt: dayjs().endOf('year').toDate()
                        },
                        "pos_status.status": "ออเดอร์สำเร็จ",
                        shop_id: shop_id

                    }
                },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y/01/01", date: "$createdAt" }},
                        //ยอดขาย
                        total: { $sum: "$pos_alltotal" },
                        //จำนวนออเดอร์
                        count: { $sum: 1 },
                        //ยอดขายที่ผ่านแพลต์ฟอร์ม
                        platform: { $sum: { $cond: { if: { $ne: ["$pos_payment", "จ่ายเงินสด"] }, then: "$pos_alltotal", else: 0 } } },
                        //ยอดขายที่ไม่ผ่านแพลต์ฟอร์ม
                        notplatform: { $sum: { $cond: { if: { $eq: ["$pos_payment", "จ่ายเงินสด"]  }, then: "$pos_alltotal", else: 0 } } }

                    }
                }
            ])

            if(reportorder.length == 0){
                reportorder = [{
                    _id: dayjs().startOf('year').format("YYYY-01-01"),
                    total: 0,
                    count: 0,
                    platform: 0,
                    notplatform: 0
                }]
            }

            //สินค้าขายดี ประจำปี
            let reportproduct = await Posorder.aggregate([
                {
                    $match: {
                        createdAt: {
                            //เช็ควันที่เริ่มต้น ถึง วันที่สิ้นสุด
                            $gte: dayjs().startOf('year').toDate(),
                            $lt: dayjs().endOf('year').toDate()
                        },
                        "pos_status.status": "ออเดอร์สำเร็จ",
                        shop_id: shop_id
                    }
                },
                {
                    $unwind: "$pos_order"
                },
                {
                    $group: {
                        _id: "$pos_order.productshop_id",
                        productshop_name: { $first: "$pos_order.productshop_name" },
                        count: { $sum: "$pos_order.productshop_qty" }
                    }
                }
            ])
           

            //ยอดขายย้อนหลัง ประจำปี  แสดง มา 7 ปี
            let reportorderback = await Posorder.aggregate([
                {
                    $match: {
                        createdAt: {
                            //เช็ควันที่เริ่มต้น ถึง วันที่สิ้นสุด
                            $gte: dayjs().startOf('year').subtract(7, 'year').toDate(),
                            $lt: dayjs().endOf('year').toDate()
                        },
                        "pos_status.status": "ออเดอร์สำเร็จ",
                        shop_id: shop_id
                    }
                },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y/01/01", date: "$createdAt" } },
                        //ยอดขาย
                        total: { $sum: "$pos_alltotal" },
                        //จำนวนออเดอร์
                        count: { $sum: 1 },
                        //ยอดขายที่ผ่านแพลต์ฟอร์ม
                        platform: { $sum: { $cond: { if: { $ne: ["$pos_payment", "จ่ายเงินสด"] }, then: "$pos_alltotal", else: 0 } } },
                        //ยอดขายที่ไม่ผ่านแพลต์ฟอร์ม
                        notplatform: { $sum: { $cond: { if: { $eq: ["$pos_payment", "จ่ายเงินสด"]  }, then: "$pos_alltotal", else: 0 } } }

                    }
                }
            ])
            if(reportorderback.length == 0){
                reportorderback =[{
                    _id: dayjs().startOf('year').format("YYYY-01-01"),
                    total: 0,
                    count: 0,
                    platform: 0,
                    notplatform: 0
                }]
            }

            return res.status(200).send({reportorder:reportorder,reportproduct:reportproduct,reportorderback:reportorderback,status:true,message:"แสดงข้อมูลสำเร็จ"});
        }else{
            return res.status(400).send({status:false,message:"กรุณาข้อมูลประเภทไม่ถูกต้อง"});
        }
    
    }catch(error){

        return res.status(500).send({status:false,message:error.message}); 
    }
}

async function runreferralcode() {

    const startDate = new Date(new Date().setHours(0, 0, 0, 0)); // เริ่มต้นของวันนี้
    const endDate = new Date(new Date().setHours(23, 59, 59, 999)); // สิ้นสุดของวันนี้
    const number = await Posorder.find({ createdAt: { $gte: startDate, $lte: endDate } }).countDocuments()
    const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    let referenceNumber = String(number).padStart(5, '0');
    let ref = `Order${currentDate}${referenceNumber}`;
    let loopnum  = 0
    let check = await Posorder.find({ pos_ref: ref }).countDocuments();
    if (check!== 0) {
    
    do{
        check = await Posorder.find({ pos_ref: ref }).countDocuments()
        if(check != 0)
        {
        loopnum++;
        referenceNumber = String(number+loopnum).padStart(5, '0');
        ref = `Order${currentDate}${referenceNumber}`;
        }

    }while(check !== 0)

    }
    
    return ref;

    
}