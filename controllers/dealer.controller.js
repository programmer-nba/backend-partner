
const multer = require("multer");
const {
  uploadFileCreate,
  deleteFile,
} = require("../functions/uploadfilecreate");

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
    //console.log(file.originalname);
  },
});


module.exports.adddealer = async (req, res) => {
    try {
    let upload = multer({ storage: storage }).array("image", 20);
    upload(req, res, async function (err) {
      const reqFiles = [];
      const result = [];
      if (err) {
        return res.status(500).send(err);
      }
      let image = ""; // ตั้งตัวแปรรูป
      //ถ้ามีรูปให้ทำฟังก์ชั่นนี้ก่อน
      if (req.files) {
        const url = req.protocol + "://" + req.get("host");
        for (var i = 0; i < req.files.length; i++) {
          const src = await uploadFileCreate(req.files, res, { i, reqFiles });
          result.push(src);

          //   reqFiles.push(url + "/public/" + req.files[i].filename);
        }

        //ไฟล์รูป
        image = reqFiles[0];
      }
      const data = {

      }
      res.status(200).send({
          status: true,
          message: "คุณได้ลงทะเบียนคู่ค้าสำเร็จแล้ว",
          data: add,
        });
   
    });
       
    } catch (error) {
        res.status(400).send(error.message);
    }
}

module.exports.get = async (req, res) =>{
    try {}
    catch (error) {
        res.status(400).send(error.message);
    }
}