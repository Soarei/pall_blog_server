// 先引入需要用到的依赖
const multer = require('multer')
// const mkdirp = require('mkdirp')
const moment = require('moment')
// 获取当前时间
const nowDate = moment().format('YYYY-MM-DD')
const axios = require('axios')
const path = require('path')
let fs = require('fs')
// 封装上传文件的功能
const upload = async (content) => {
  const cutToken = 'ghp_xUdANrhcFgeXerH'
  const tailToken = 'W3QKws6vGDqrpTQ3qKKnT'
  const repo = 'Soareia/file'
  const filename = content.filename
  content = await getBase64(content)
  // const pathl = `${d.getFullYear()}/${d.getMonth()}/${d.getTime()}${file.name?.split('.').pop() || '.png'}`
  const imageUrl = 'https://api.github.com/repos/' + repo + '/contents/' + filename
  const body = { branch: 'main', message: 'upload', content, filename }
  const headers = {
    Authorization: `token ${cutToken}${tailToken}`,
    'Content-Type': 'application/json; charset=utf-8',
  }
  const res = await axios.put(imageUrl, body, { headers })
  // 直接取得返回的图片地址
  return res?.data.content?.download_url
}


async function getBase64(file) {
  file = path.resolve(file.path)
  let data = fs.readFileSync(file);
  data = Buffer.from(data).toString('base64');
  return data
  // let data = fs.readFileSync(file);
  // data = Buffer.from(data).toString('base64');
  // return data
  // const reader = new FileReader()
  // return new Promise((resolve) => {
  //   reader.onload = function (event) {
  //     const fileContent = event.target.result
  //     resolve(fileContent.split(',')[1])
  //   }
  //   reader.readAsDataURL(file)
  // })

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
const uploaBase64 = (req, res) => {
  return new Promise(function (resolve, reject) {
    let fs = require('fs')
    let { imgData } = req.body //前端以application/json形式传递
    let base64Data = imgData.replace(/^data:image\/png;base64,/, "");
    let dataBuffer = new Buffer(base64Data, 'base64');
    let uuid = nowDate
    let filePath = "static/files/" + uuid + ".png";//定义文件路径及名称,无论是jpg还是png的都可以保存成png
    fs.writeFile(filePath, dataBuffer, function (err) {
      if (err) {
        console.log(err);
        reject({ success: false })
      } else {
        resolve({ success: true, path: filePath })
      }
    });
  })
}
module.exports = {
  upload
}