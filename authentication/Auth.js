const jwt = require('jsonwebtoken');

const partner = async(req, res, next)=>{
    try{

        let token = req.headers["token"]
        const secretKey = "i#ngikanei;#aooldkhfa'"
      
        //เช็ค token
        if(!token){
            return res.status(403).send({status:false,message:'token หมดอายุ'});
        }

        // ทำการยืนยันสิทธิ์ token
        const decoded =  jwt.verify(token,secretKey)

        // console.log(decoded)
        if(decoded.position ==="partner"){
            req.users = decoded.data
            next();
        }else{
           return  res.status(400).send({status:false,message:"คุณไม่มีสิทธิ่ในการใช้งาน"})
        }
        
        
    }catch (err){
        return res.status(500).send({error:err})
    }

}



const all = async(req, res, next)=>{
    try{

        let token = req.headers["token"]
        const secretKey = "i#ngikanei;#aooldkhfa'"
        //เช็ค token
        if(!token){
            return res.status(403).send({status:false,message:'token หมดอายุ'});
        }

        // ทำการยืนยันสิทธิ์ token
        const decoded =  jwt.verify(token,secretKey)
        req.users = decoded.data
        next();
        
        
    }catch (err){
        return res.status(500).send({error:err})
    }

}

//token สำหรับต่อด้านนอก
const public = async(req, res, next)=>{
    try{

        let token = req.headers["token"]
        const secretKey = process.env.SHOP_SECRET_KET;
        //เช็ค token
        if(!token){
            return res.status(403).send({status:false,message:'token หมดอายุ'});
        }
        // ทำการยืนยันสิทธิ์ token
        const decoded =  jwt.verify(token,secretKey)
        // console.log(decoded)
        if(decoded.code =="shop" || decoded.code =="service" || decoded.code =="office" || decoded.code =="contract"){
            
            req.users = decoded.data
            next();

        }else{
           return res.status(400).send({status:false,message:"คุณไม่มีสิทธิ่ในการใช้งาน"})
        }
    }catch (err){
        return res.status(500).send({error:err})
    }
}



module.exports = {partner,public,all};