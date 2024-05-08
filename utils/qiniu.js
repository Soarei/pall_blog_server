const qiniu_sdk = require('qiniu')
const fs = require('fs');
qiniu_sdk.conf.ACCESS_KEY = 'ubcXyKQWyJ88g-ks0SWxc-Ev-Bye24PD5iGhoQJB'

qiniu_sdk.conf.SECRET_KEY = 'R-2WsRj8YJOSQ690mq_I5wYv1QMebx0oveJ3GZ64'

// 要上传的空间
const bucket = "me-jd" 
// 文件前缀
const prefix = 'image/pall/' 

const token = (bucket, key) => {    
  const policy = new qiniu_sdk.rs.PutPolicy({isPrefixalScope: 1, scope: bucket + ':' + key })//scope: "me-jd" + ':' + 'image/activity/nianhuo'  
  return policy.uploadToken()
} 

const config = new qiniu_sdk.conf.Config() ;
//设置空间位置为华南
config.zone=qiniu_sdk.zone.Zone_z2;

const upload_file = (file_name, file_path) => {
// 保存到七牛的地址
const file_save_path = prefix + file_name 
// 七牛上传的token
const up_token = token(bucket, file_save_path) //把'me-jd','image/activity/nianhuo' 传入
console.log(up_token);
const extra = new qiniu_sdk.form_up.PutExtra() 
const formUploader = new qiniu_sdk.form_up.FormUploader(config) 
// 上传文件
formUploader.putFile(up_token, file_save_path, file_path, extra, (err, ret) => { 
      //参数为 1：上传凭证，2：目标文件名 ，3：本机文件路径 ，4：额外选项
    if (!err) {
        // 上传成功， 处理返回值
        console.log(ret);
    } else {
        // 上传失败， 处理返回代码
        console.error(err);
    }
});
}

module.exports = upload_file