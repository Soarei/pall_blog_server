var express = require('express')
const PALL_LABEL = require('../../models/pall_label/pall_label')
// 引入生成和验证token的类
const { sequelize } = require('../../models/init')
const moment = require('moment')
const resJson = require('../../utils/logFun')
const router = express.Router()

// 添加标签接口
router.post('/add', async (req, res) => {
  try {
    const { label_name, color } = req.body
    await PALL_LABEL.create({ label_name, color, create_time: moment().format('YYYY-MM-DD HH:mm:ss') })
    return resJson(req, res, 5200, [], '添加成功')
  } catch (error) {
    console.log(error);
    return resJson(req, res, 5500, null, error.message)
  }
})

// 获取接口数据
router.post('/list', async (req, res) => {

  const { page, size } = req.body
  let sql = `select * from pall_labels a ORDER BY a.id DESC LIMIT ${page - 1},${size}`
  let count = 'select count(*) from pall_labels'
  const list = await sequelize.query(sql, { type: sequelize.QueryTypes.SELECT })
  const total = await sequelize.query(count, { type: sequelize.QueryTypes.SELECT })
  for (let item of list) {
    item.create_time = moment(item.create_time).format('YYYY-MM-DD HH:mm:ss')
  }
  let obj = { rows: list, count: total[0]['count(*)'] }
  return resJson(req, res, 5200, obj, 'Success')
})
// 编辑接口
router.post('/editlabel', async (req, res) => {
  try {
    const { label_name, id, color } = req.body
    const result = await PALL_LABEL.update({ label_name, color }, { where: { id } })
    return resJson(req, res, 5200, [], `编辑成功`)
  } catch (error) {
    return resJson(req, res, 5500, [], error.message)
  }
})
// 删除接口
router.post('/deletelabel', async (req, res) => {
  const { id } = req.body
  const result = await PALL_LABEL.destroy({ where: { id } })
  if (result == 1) return resJson(req, res, 5200, 'Success')
  return resJson(req, res, 5500, '删除失败')
})
// 获取全部标签
router.post('/alllist', async (req, res) => {
  const list = await PALL_LABEL.findAll({
    where: {},
  }).catch(err => {
    return resJson(req, res, 5500, null, err.message)
  })
  return resJson(req, res, 5200, list, 'Success')
})

module.exports = router