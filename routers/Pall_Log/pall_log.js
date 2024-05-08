var express = require('express')
const PALL_LOG = require('../../models/pall_log/pall_log')
// 引入生成和验证token的类
const resJson = require('../../utils/logFun')
const { sequelize } = require('../../models/init')
const moment = require('moment')
const router = express.Router()
// 登录日志查询
router.post('/getloglist', async (req, res) => {
  const { page, size } = req.body
  let sql = `select * from pall_logs a where a.type = 1 ORDER BY a.id DESC LIMIT ${page - 1},${size}`
  let count = 'select count(*) from pall_logs'
  const list = await sequelize.query(sql, { type: sequelize.QueryTypes.SELECT })
  const total = await sequelize.query(count, { type: sequelize.QueryTypes.SELECT })
  for (let item of list) {
    item.asctime = moment(item.asctime).format('YYYY-MM-DD HH:mm:ss')
  }
  if (list) {
    let obj = { rows: list, count: total[0]['count(*)'] }
    return resJson(req, res, 5200, obj, 'Success')
  }
  return resJson(req, res, 5500, null, 'System Error', 4)

})

// 用户日志 (包含用户行为)



module.exports = router