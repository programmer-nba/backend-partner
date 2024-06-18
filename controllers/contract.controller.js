const Partner = require("../models/partner.schema");
const axios = require("axios");

// ดึงสัญญาทตาม partner id
module.exports.getcontractbypartnerid = async (req, res) => {
    try{
        const apiResponse = await axios.get(`${process.env.API_OFFICE}/lawyer/${req.params.id}/userterms`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if(apiResponse.data.status == true){
            return res.status(200).send({ status: true, data: apiResponse.data.data });
        }else{
            return res.status(404).send({ status: false, message: "ไม่พบข้อมูล" });
        }
    }catch(error){
        return res.status(500).send({ status: false, error: error.message });
    
    }
}


//ดึงสัญญาตามประเภทมาแสดง
module.exports.getcontractbycode = async (req, res) => {
    try{
        const apiResponse = await axios.get(`${process.env.API_OFFICE}/lawyer/${req.params.id}/one`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if(apiResponse.data.status == true){
            return res.status(200).send({ status: true, data: apiResponse.data.data });
        }else{
            return res.status(404).send({ status: false, message: "ไม่พบข้อมูล" });
        }

    }catch(error){
        return res.status(500).send({ status: false, error: error.message });
    }
}

//ยอมรับสัญญา เข้าใช้งานระบบ partner
module.exports.acceptcontractpartner = async (req, res) => {
    try{
        const partner = await Partner.findById(req.params.id);
        if (!partner) return res.status(404).send({ status: false, message: "ไม่พบข้อมูล" });
        const update = await Partner.findByIdAndUpdate(req.params.id, { contract_partner: true }, { new: true });
        const apiResponse = await axios.post(`${process.env.API_OFFICE}/lawyer/accepted`,{
            term_id: req.body.term_id,
            user_ip: req.ip,
            fromUrl: req.body.fromUrl,
            user_id: req.params.id,
            user_type: ""

        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if(update && apiResponse.data.status == true)
        {
            return res.status(200).send({ status: true,data:apiResponse?.data?.data, message: "ยอมรับสัญญาเข้าใช้งานระบบ partner สำเร็จ" });
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
        const apiResponse = await axios.post(`${process.env.API_OFFICE}/lawyer/accepted`,{
            term_id: req.body.term_id,
            user_ip: req.ip,
            fromUrl: req.body.fromUrl,
            user_id: req.params.id,
            user_type: ""

        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if(update && apiResponse.data.status == true)
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
        const apiResponse = await axios.post(`${process.env.API_OFFICE}/lawyer/accepted`,{
            term_id: req.body.term_id,
            user_ip: req.ip,
            fromUrl: req.body.fromUrl,
            user_id: req.params.id,
            user_type: ""

        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if(update && apiResponse.data.status == true)
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
        const apiResponse = await axios.post(`${process.env.API_OFFICE}/lawyer/accepted`,{
            term_id: req.body.term_id,
            user_ip: req.ip,
            fromUrl: req.body.fromUrl,
            user_id: req.params.id,
            user_type: ""

        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if(update && apiResponse.data.status == true)
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
        const apiResponse = await axios.post(`${process.env.API_OFFICE}/lawyer/accepted`,{
            term_id: req.body.term_id,
            user_ip: req.ip,
            fromUrl: req.body.fromUrl,
            user_id: req.params.id,
            user_type: ""

        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if(update && apiResponse.data.status == true)
        {
            return res.status(200).send({ status: true, message: "ยอมรับสัญญาเข้าใช้งานระบบ onestopshop สำเร็จ" });
        }else{
            return res.status(404).send({ status: false, message: "ยอมรับสัญญาเข้าใช้งานระบบ onestopshop ไม่สำเร็จ" });
        }

    }catch(error){
        return res.status(500).send({ status: false, error: error.message });
    }

}

// ดึงสัญญา แบบ เซ็นเอกสาร
module.exports.getcontractsign = async (req, res) => {
    try{
        const apiResponse = await axios.get(`${process.env.API_OFFICE}/lawyer/${req.params.id}/userterms-main`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if(apiResponse.data.status == true){
            return res.status(200).send({ status: true, data: apiResponse.data.data });
        }else{
            return res.status(404).send({ status: false, message: "ไม่พบข้อมูล" });
        }

    }catch(error){
        return res.status(500).send({ status: false, error: error.message });
    }
}
// ยอมรับสัญญา แบบ เซ็นเอกสาร
module.exports.acceptcontractsign = async (req, res) => {
    try{
        const signatures = req.body.signatures;
        const apiResponse = await axios.put(`${process.env.API_OFFICE}/lawyer/${req.params.id}`,{
            signatures: signatures,
            status:"ลงนามแล้ว"

        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if(apiResponse.data.status == true){
            return res.status(200).send({ status: true, data: apiResponse.data.data });
        }else{
            return res.status(404).send({ status: false, message: "ไม่สามารถลงนามได้" });
        }
    }catch(error){
        return res.status(500).send({ status: false, error: error.message });
    }

}
