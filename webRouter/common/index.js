var express = require('express')
const jwtUtil = require('../../utils/jwt')
const resJson = require('../../utils/logFun')
const multer = require('multer')
var path = require('path')
const router = express.Router()
const { upload } = require('../../utils/upload')
const uploadPath = path.join(__dirname, '../../public/images')
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
router.post('/upload/image', uploadFile.single('file'), async (req, res) => {
  const result = await upload(req.file)
  // return resJson(req, res, 5200, { url: result }, '上传成功')
  return res.json({ errno: 0, data: { url: result, alt: '', href: '' }, message: 'Success' })
})

module.exports = router