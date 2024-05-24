const axios = require("axios");

//เพิ่มสินค้า producttg
module.exports.addProducttg = async (req, res) => {
    try{
        const apiResponse = await axios.post(`${process.env.API_TOSSAGUNSHOP}/product/tossagun/partner`, req.body, {
            headers: {
                "Content-Type": "application/json",
            },
        });
       
        if(apiResponse?.data?.status == true){
            return res.status(200).json({ message: "เพิ่มสินค้าสำเร็จ", status: true });
        }else{
            return res.status(400).json({ message: "เพิ่มสินค้าไม่สำเร็จ", status: false });
        }

    }catch(error){
       
        if(error.response.status == 409)
        {
            return res.status(409).send({ status: false, error: "ชื่อสินค้าซ้ำกัน" });
        }
        else{
            return res.status(500).send({ status: false, error: error.message });
        }
        
    }
}

// ดึงข้อมูลสินค้า producttg by partnerid
module.exports.getProducttg = async (req, res) => {
    try{
        const apiResponse = await axios.get(`${process.env.API_TOSSAGUNSHOP}/product/tossagun/bypartner/${req.params.partnerid}`,{
            headers: {
                "Content-Type": "application/json",
            },
        });
        if(apiResponse?.data?.status == true){
            return res.status(200).json({ message: "ดึงข้อมูลสินค้าสำเร็จ", data: apiResponse.data.data, status: true });
        }else{
            return res.status(400).json({ message: "ดึงข้อมูลสินค้าไม่สำเร็จ", status: false });
        }

    }catch(error){
        return res.status(500).send({ status: false, error: error.message });
    }
}

// แก้ไขข้อมูล producttg
module.exports.editProducttg = async (req, res) => {
    try{
        const apiResponse = await axios.put(`${process.env.API_TOSSAGUNSHOP}/product/tossagun/partner/${req.params.id}`, req.body, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        if(apiResponse?.data?.status == true){
            return res.status(200).json({ message: "แก้ไขสินค้าสำเร็จ", status: true });
        }else{
            return res.status(400).json({ message: "แก้ไขสินค้าไม่สำเร็จ", status: false });
        }

    }catch(error){
        return res.status(500).send({ status: false, error: error.message });
    }
}


// ลบข้อมูล producttg
module.exports.deleteProducttg = async (req, res) => {
    try{
        const apiResponse = await axios.delete(`${process.env.API_TOSSAGUNSHOP}/product/tossagun/partner/${req.params.id}`,{
            headers: {
                "Content-Type": "application/json",
            },
        });
        if(apiResponse?.data?.status == true){
            return res.status(200).json({ message: "ลบสินค้าสำเร็จ", status: true });
        }else{
            return res.status(400).json({ message: "ลบสินค้าไม่สำเร็จ", status: false });
        }

    }catch(error){
        return res.status(500).send({ status: false, error: error.message });
    }
}

// ดึงหมวดหมู่สินค้า
module.exports.getCategory = async (req, res) => {
    try{
        const apiResponse = await axios.get(`${process.env.API_TOSSAGUNSHOP}/product/tossagun/partner/category/all`,{
            headers: {
                "Content-Type": "application/json",
            },
        });
        if(apiResponse?.data?.status == true){
            return res.status(200).json({ message: "ดึงหมวดหมู่สินค้าสำเร็จ", data: apiResponse.data.data, status: true });
        }else{
            return res.status(400).json({ message: "ดึงหมวดหมู่สินค้าไม่สำเร็จ", status: false });
        }

    }catch(error){
        return res.status(500).send({ status: false, error: error.message });
    }
}
