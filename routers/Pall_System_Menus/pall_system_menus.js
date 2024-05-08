var express = require('express')
const resJson = require('../../utils/logFun')
const { sequelize } = require('../../models/init')
const moment = require('moment')
const router = express.Router()
var jwtUtil = require('../../utils/jwt')
const PALL_SYSTEM_MENUS = require('../../models/pall_menus/pall_menus')
const Pall_Blog = require('../../models/pall_user/pall_user')
router.post('/list',async(req,res)=>{
    let sql = `select * from pall_system_menus m order by m.id desc`
    const list =  await sequelize.query(sql,{ type: sequelize.QueryTypes.SELECT })
    if(list) return resJson(req,res,5200,list,'Success')
    return resJson(req,res,5500,null,'System Error')
})

router.post('/add',async(req,res)=>{
  const {user_name} = await Pall_Blog.findOne({where:{
    user_id:new jwtUtil(req.headers.token).verifyToken()
  }})
  const {name,parentId,routeUrl,url,note,sort,icon,type} = req.body
  const create_time = moment().format('YYYY-MM-DD HH:mm:ss')
  const update_time = moment().format('YYYY-MM-DD HH:mm:ss')
  const create_user = user_name
  const result = await PALL_SYSTEM_MENUS.create({name,parentId,routeUrl,url,note,sort,icon,create_time,create_user,type,update_time})
  if(result){
    return resJson(req,res,5200,null,'Success')
  }
  return resJson(req,res,5500,null,'System Error')
})
router.post('/edit',async(req,res)=>{
  const {user_name} = await Pall_Blog.findOne({where:{
    user_id:new jwtUtil(req.headers.token).verifyToken()
  }})
  const {name,routeUrl,url,note,sort,icon,type,id} = req.body
  const update_time = moment().format('YYYY-MM-DD HH:mm:ss')
  const modify_user = user_name
  const result = await PALL_SYSTEM_MENUS.update({name,routeUrl,url,note,sort,icon,type,update_time,modify_user},{where:{
    id
  }})
  if(result[0]===1){
    return resJson(req,res,5200,null,'更新成功')
  }
  return resJson(req,res,5500,null,'系统错误')
})
router.post('/delete',async(req,res)=>{
  const { id,parentId } = req.body
  
  // 如果parentId ==0 说明删除的主菜单 需要把对应的子菜单也要删除
  if(parentId===0){
    const result = await PALL_SYSTEM_MENUS.destroy({where:{id}})
    const allchild = await PALL_SYSTEM_MENUS.destroy({
      where:{parentId:id}
    })
    if(result==1 && allchild==1)  return resJson(req,res,5200,null,'删除成功')
    return resJson(req,res,5500,null,'系统错误')
  }
  const result = await PALL_SYSTEM_MENUS.destroy({where:{id}})
  if(result===1) return resJson(req,res,5200,null,'删除成功')
  return resJson(req,res,5500,null,'系统错误')
})


module.exports = router