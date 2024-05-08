var express = require('express')
var moment = require('moment')
const PALL_SENSITIVE = require('../../models/pall_sensitive/pall_sensitive')
const resJson = require('../../utils/logFun')
const { sequelize } = require('../../models/init')
const router = express.Router()

router.get('/list', async (req, res) => {
  const { page, size, content } = req.query
  let sql = `select IF(sen.status,'false' ,'true') as status,sen.content as content,sen.id as id,sen.create_time as create_time from pall_sensitives sen where sen.content like "%${content || ''}%" order by sen.id limit ${page - 1},${size}`
  let count = `select count(*) from pall_sensitives`
  const list = await sequelize.query(sql, { type: sequelize.QueryTypes.SELECT })
  console.log(list);
  const total = await sequelize.query(count, { type: sequelize.QueryTypes.SELECT })
  if (list) return resJson(req, res, 5200, { list, total: total[0]['count(*)'] }, 'Success')
})

// 添加敏感词
router.post('/insert', async (req, res) => {
  const { content, status } = req.body
  const create_time = moment().format('YYYY-MM-DD HH:mm:ss')
  const result = await PALL_SENSITIVE.create({ content, status, create_time })
  if (result) {
    return resJson(req, res, 5200, [], '添加敏感词成功')
  }
})
module.exports = router

