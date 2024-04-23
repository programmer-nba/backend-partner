var express = require('express');
var router = express.Router();


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



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post("/upload", async (req, res) => {
  try{
    let upload = multer({ storage: storage }).array("image", 20);
    upload(req, res, async function (err) {
      const reqFiles = [];
      const result = [];
      if (err) {
          return res.status(500).send(err);
      }
      let image = "";
      if (req.files) {
        const url = req.protocol + "://" + req.get("host");
        for (var i = 0; i < req.files.length; i++) {
            const src = await uploadFileCreate(req.files, res, { i, reqFiles });
            result.push(src);
            //   reqFiles.push(url + "/public/" + req.files[i].filename);
        }
        image = reqFiles[0]
      }
      return res.status(200).send({ status: true, data: image });
    });
  }catch(error){
    return res.status(500).send({ status: false, error: error.message });
  }
});


module.exports = router;
