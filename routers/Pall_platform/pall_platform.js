var express = require('express')
const PALL_NOTICE = require('../../models/pall_notice/pall_notice')
const PALL_COURSE = require('../../models/pall_course/pall_course')
const resJson = require('../../utils/logFun')
const { sequelize } = require('../../models/init')
const router = express.Router()

// 公告信息相关接口
router.post('/noticeList', async (req, res) => {
  const { page, size } = req.body
  let sql = `select * from pall_notices order by id desc limit ${page - 1},${size}`
  let count = `select count(*) from pall_notices`
  const list = await sequelize.query(sql, { type: sequelize.QueryTypes.SELECT })
  const total = await sequelize.query(count, { type: sequelize.QueryTypes.SELECT })
  if (list) {
    return resJson(req, res, 5200, { list, total: total[0]['count(*)'] }, 'Success')
  }
})

// 添加公告信息

router.post('/insertNotice', async (req, res) => {
  const { content, startTime, endTime, status } = req.body
  const result = await PALL_NOTICE.create({ content, startTime, endTime, status })
  if (result) {
    return resJson(req, res, 5200, [], '添加成功')
  } 
})

// 编辑公告接口

router.post('/updateNotice', async (req, res) => {
  const { content, startTime, endTime, status, id } = req.body
  const result = await PALL_NOTICE.update({ content, startTime, endTime, status }, { where: { id } })
  if (result) {
    return resJson(req, res, 5200, [], '更新成功')
  } else {
    return resJson(req, res, 5500, null, 'System Error')
  }
})

// 删除公告接口
router.post('/delNotice', async (req, res) => {
  const { id } = req.body
  const result = await PALL_NOTICE.destroy({
    where: { id }
  })
  if (result === 1) {
    return resJson(req, res, 5200, [], '删除成功')
  } 
})
// 轮播图列表
router.get('/course/list',async(req,res)=>{
  const {page,size} = req.query
  let sql = `select * from pall_courses order by id desc limit ${page - 1},${size}`
  let count = `select count(*) from pall_courses`
  const list = await sequelize.query(sql, { type: sequelize.QueryTypes.SELECT })
  const total = await sequelize.query(count, { type: sequelize.QueryTypes.SELECT })
  if (list) {
    return resJson(req, res, 5200, { list, total: total[0]['count(*)'] }, 'Success')
  }
})
// 更新轮播图
router.post('/course/update',async(req,res)=>{
  const {title,picture,address,endTime,startTime,sort,enabled,id} = req.body
  const result = await PALL_COURSE.update({title,picture,address,endTime,startTime,sort,enabled},{where:{id}})
  if(result){
    return resJson(req,res,5200,[],'更新成功')
  }
})
// 添加轮播图
router.post('/course/insert',async(req,res)=>{
  const {title,picture,address,endTime,startTime,sort,enabled} = req.body
  const result = await PALL_COURSE.create({title,picture,address,endTime,startTime,sort,enabled})
  if(result){
    return resJson(req,res,5200,[],'添加成功')
  }
})

/*
 *@description:删除轮播图接口
 *@author: pf
 *@date: 2022-12-28 19:01:53
 *@version: V1.0.5
*/
router.post('/course/del',async(req,res)=>{
  const {id} = req.body
  const result = await PALL_COURSE.destroy({where:{id}})
  if(result){
    return resJson(req,res,5200,[],'删除成功')
  }
})
module.exports = router