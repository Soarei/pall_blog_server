var express = require('express')
const PALL_LOG = require('../../models/pall_log/pall_log')
const PALL_GITHUB = require('../../models/pall_log/pall_github')
// 引入生成和验证token的类
const resJson = require('../../utils/logFun')
const config = require('../../utils/config')
const { sequelize } = require('../../models/init')
const moment = require('moment')
const axios = require('axios')
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

// github更新日志
router.post('/updategit', async (req, res) => {
  try {
    axios.get(
      'https://api.github.com/repos/Soarei/pall_blog_server/commits',
      {
        headers: {
          "Authorization": `token ${config.githubUrl}${config.gitsecret}`
        }
      }
    ).then(async res => {
      const result = res.data.map(item => ({
        sha: item.sha,
        author: item.commit.author.name,
        email: item.commit.author.email,
        commit_time: item.commit.author.date,
        message: item.commit.message
      }))
      await PALL_GITHUB.bulkCreate(result, { updateOnDuplicate: ['author'] })
      return resJson(req, res, 5200, [], '同步成功')
    })
  } catch (error) {
    return resJson(req, res, 5500, null, error.message)
  }
})
router.post('/githublist', async (req, res) => {
  try {
    const { page, size } = req.body
    const { rows, count } = await PALL_GITHUB.findAndCountAll({
      order: [['commit_time', 'DESC']],
      offset: (Number(page) - 1) * Number(size),
      limit: Number(size),
    })
    return resJson(req, res, 5200, { rows, count }, 'Success')
  } catch (error) {
    return resJson(req, res, 5500, null, error.message)
  }
})

module.exports = router