var express = require('express')
var router = express.Router();
var multer = require('multer')
var path = require('path')
var fs = require('fs')
const upload = require('../../utils/upload')
const upload_file = require('../../utils/qiniu')
const qn = require('../../utils/qn');
const uploadPath = path.join(__dirname,'../../public/images')
const resJson = require('../../utils/logFun')
const storage = multer.diskStorage({
	// destination 是用来确定上传的文件应该存储在哪个文件夹中
	destination: function (req, file, cb) {
		cb(null, uploadPath);
	},
	// filename 用于确定文件夹中的文件名的确定。 如果没有设置 filename，每个文件将设置为一个随机文件名，并且是没有扩展名的。
	filename: function (req, file, cb) {
		cb(null, Date.now() + '-' + file.originalname);
	},
});
const uploadFile = multer({
	// 设置上传的文件存储位置
	storage: storage,
	// 文件上传限制:单位字节
	limits: { fileSize: 1024 * 1024 * 20 },
	// 文件过滤：决定哪些文件可以上传，哪些文件跳过
	fileFilter: function (req, file, cb) {
		if (file.mimetype.startsWith('image')) {
			cb(null, true); // 接收这个文件
		} else {
			cb(null, false); // 拒绝这个文件
		}
	},
});
/*
  七牛云存储
*/
router.post("/images",async (req, res, next) => {
  const promise = new Promise(resolve=>{
    qn.upImg(req,(resData)=>{
      resolve(resData)
    })
  }).catch((err)=>{
    throw err
  })
  promise.then(value=>{
   return res.send(value)
  })
})
/*
  本地文件存储
*/

router.post('/uploadImage',uploadFile.single('file'),async(req,res)=>{
   if(req.file){
     const imgUrl = `http://10.211.55.3:4000/public/images/${req.file.filename}`
     return resJson(req, res, 5200, {imgUrl}, '上传成功')
   }
   return resJson(req, res, 5500, null, '上传失败')
})

module.exports = router;