const Partner = require("../models/partner.schema");


// ดึงสัญญาทั้งหมด


//ดึงสัญญาตามประเภทมาแสดง

//ยอมรับสัญญา เข้าใช้งานระบบ partner
module.exports.acceptcontractpartner = async (req, res) => {
    try{
        const partner = await Partner.findById(req.params.id);
        if (!partner) return res.status(404).send({ status: false, message: "ไม่พบข้อมูล" });
        const update = await Partner.findByIdAndUpdate(req.params.id, { contract_partner: true }, { new: true });
        if(update)
        {
            return res.status(200).send({ status: true, message: "ยอมรับสัญญาเข้าใช้งานระบบ partner สำเร็จ" });
        }else{
            return res.status(404).send({ status: false, message: "ยอมรับสัญญาเข้าใช้งานระบบ partner ไม่สำเร็จ" });
        }

    }catch(error){
        return res.status(500).send({ status: false, error: error.message });
    }
}
// ยอมรับสัญญาเข้าใช้งานระบบ  emakert
module.exports.acceptcontractemakert = async (req, res) => {
    try{
        const partner = await Partner.findById(req.params.id);
        if (!partner) return res.status(404).send({ status: false, message: "ไม่พบข้อมูล" });
        const update = await Partner.findByIdAndUpdate(req.params.id, { contract_emakert: true }, { new: true });
        if(update)
        {
            return res.status(200).send({ status: true, message: "ยอมรับสัญญาเข้าใช้งานระบบ emakert สำเร็จ" });
        }else{
            return res.status(404).send({ status: false, message: "ยอมรับสัญญาเข้าใช้งานระบบ emakert ไม่สำเร็จ" });
        }

    }catch(error){
        return res.status(500).send({ status: false, error: error.message });
    }

}
// ยอมรับสัญญาเข้าใช้งานระบบ  pospartner
module.exports.acceptcontractpospartner = async (req, res) => {
    try{
        const partner = await Partner.findById(req.params.id);
        if (!partner) return res.status(404).send({ status: false, message: "ไม่พบข้อมูล" });
        const update = await Partner.findByIdAndUpdate(req.params.id, { contract_pospartner: true }, { new: true });
        if(update)
        {
            return res.status(200).send({ status: true, message: "ยอมรับสัญญาเข้าใช้งานระบบ pospartner สำเร็จ" });
        }else{
            return res.status(404).send({ status: false, message: "ยอมรับสัญญาเข้าใช้งานระบบ pospartner ไม่สำเร็จ" });
        }

    }catch(error){
        return res.status(500).send({ status: false, error: error.message });
    }


}

// ยอมรับสัญญาเข้าใช้งานระบบ  onestopservice
module.exports.acceptcontractonestopservice = async (req, res) => {
    try{
        const partner = await Partner.findById(req.params.id);
        if (!partner) return res.status(404).send({ status: false, message: "ไม่พบข้อมูล" });
        const update = await Partner.findByIdAndUpdate(req.params.id, { contract_onestopservice: true }, { new: true });
        if(update)
        {
            return res.status(200).send({ status: true, message: "ยอมรับสัญญาเข้าใช้งานระบบ onestopservice สำเร็จ" });
        }else{
            return res.status(404).send({ status: false, message: "ยอมรับสัญญาเข้าใช้งานระบบ onestopservice ไม่สำเร็จ" });
        }

    }catch(error){
        return res.status(500).send({ status: false, error: error.message });
    }

}

// ยอมรับสัญญาเข้าใช้งานระบบ  onestopshop
module.exports.acceptcontractonestopshop = async (req, res) => {
    try{
        const partner = await Partner.findById(req.params.id);
        if (!partner) return res.status(404).send({ status: false, message: "ไม่พบข้อมูล" });
        const update = await Partner.findByIdAndUpdate(req.params.id, { contract_onestopshop: true }, { new: true });
        if(update)
        {
            return res.status(200).send({ status: true, message: "ยอมรับสัญญาเข้าใช้งานระบบ onestopshop สำเร็จ" });
        }else{
            return res.status(404).send({ status: false, message: "ยอมรับสัญญาเข้าใช้งานระบบ onestopshop ไม่สำเร็จ" });
        }

    }catch(error){
        return res.status(500).send({ status: false, error: error.message });
    }

}