var express = require('express')
var jwtUtil = require('../../utils/jwt')
const resJson = require('../../utils/logFun')
const PALLARTICLE = require('../../models/pall_article/pall_article')
const PALL_USER = require('../../models/pall_user/pall_user')
const PALL_CATEGORY = require('../../models/pall_category/pall_category')
const PALL_LABEL = require('../../models/pall_label/pall_label')
const PALLPOSTLIKE = require('../../models/pall_postlike/pall_postlike')
const router = express.Router()
router.get('/article/page', async (req, res) => {

  PALLARTICLE.belongsTo(PALL_USER,{
    foreignKey:'user_id',
    targetKey:'user_id'
  })
  PALLARTICLE.hasOne(PALL_CATEGORY,{
    foreignKey:'catgory_id',
    targetKey:'catgory_id'
  })
  const { rows, count } = await PALLARTICLE.findAndCountAll({
    attributes: { exclude: ['user_id'] },
    
    include:[
      {
        attributes:['user_name'],
        model:PALL_USER
      },{
        attributes:['catgory_name'],
        model:PALL_CATEGORY
      }
    ],
  })
  // 查询标签名
  const fun = item => new Promise((resolve, reject) => {
    const result =  PALL_LABEL.findOne({
      where: {
        id: item
      }
    })
    resolve(result)
  })
  // 查询文章是否被当前用户点赞
  const isThumbs = aid => new Promise(async(resolve,reject)=>{
    const uid = new jwtUtil(req.headers.token).verifyToken()
    const is_thumbs = await PALLPOSTLIKE.findOne({
      where:{
        aid,
        uid:1
      }
    })
    resolve(is_thumbs)
  })
  async function formatRows(){
    let list = rows
    for (let i =0;i<list.length;i++) {
      console.log(list[i]);
      let tagList = !list[i].tags ? [] : list[i].tags.split(',')
      list[i].labels = []
      for (let tags of tagList) {
        let res = await fun(tags)
        list[i].labels.push(res.label_name || '')
      }
    }
    return list
  }
  const result = await formatRows()
  console.log(result,'result');
  return resJson(req, res, 5200, {rows:result,count} , 'success')
})

// 用户点赞
/*
  @params点赞功能 aid uid
*/
router.post('/postlike',async(req,res)=>{
  // 判断当前用户是否已经点赞
  const { article_id } = req.body
  const uid = new jwtUtil(req.headers.token).verifyToken()
  const result = await PALLPOSTLIKE.findOne({where:{
      uid,
      aid:article_id
    }
  })
  if(result !== null) return resJson(req,res,5500,null,'该用户已经点赞了')
  // 在点赞表新增一条记录
  const addresult = await PALLPOSTLIKE.create({aid:article_id,uid,thumsTime:moment().format('YYYY-MM-DD HH:mm:ss')})
  if(addresult) return resJson(req,res,5200,[],'Success')
})

module.exports = router