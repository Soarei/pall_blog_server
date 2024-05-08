// 先引入需要用到的依赖
const multer = require('multer')
// const mkdirp = require('mkdirp')
const moment = require('moment')
const path = require('path')
// 获取当前时间
const nowDate = moment().format('YYYY-MM-DD')

// 封装上传文件的功能
const upload = ()=>{
  
}

/*

const storage = multer.diskStorage({
    destination: async(req,file,cb)=>{
      await mkdirp(`./public/images/${nowDate}`)
      cb(null,`public/images/${nowDate}`)
    },
    filename:(req,file,cb)=>{ // 给保存的文件命名
      let extname = path.extname(file.originalname); // 获取后缀名

      let fileName = path.parse(file.originalname).name // 获取上传的文件名
      cb(null,`${fileName}-${Date.now()}${extname}`)
    },
  })
  return multer({storage,fileFilter(req, file, callback){
    file.originalname = Buffer.from(file.originalname, "latin1").toString(
      "utf8"
    );
    callback(null, true);
  }})
*/

// 封装base64上传图片的方法
const uploaBase64 = (req,res)=>{
  return new Promise(function(resolve, reject){
    let fs =require('fs')
    let {imgData}=req.body //前端以application/json形式传递
    let base64Data = imgData.replace(/^data:image\/png;base64,/,"");
    let dataBuffer = new Buffer(base64Data, 'base64');
    let uuid = nowDate
    let filePath = "static/files/"+uuid+".png";//定义文件路径及名称,无论是jpg还是png的都可以保存成png
    fs.writeFile(filePath, dataBuffer, function(err) {
        if(err){
            console.log(err);
            reject({success:false})
        }else{
            resolve({success:true,path:filePath})
        }
    });
})
}
module.exports = {
  upload
}