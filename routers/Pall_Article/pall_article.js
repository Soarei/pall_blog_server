var express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const { v4: uuidv4 } = require('uuid')
const { sequelize } = require('../../models/init')
const PALLARTICLE = require('../../models/pall_article/pall_article')
const resJson = require('../../utils/logFun')
var jwtUtil = require('../../utils/jwt')
const moment = require('moment')
const PALL_LABEL = require('../../models/pall_label/pall_label')
const PALLPOSTLIKE = require('../../models/pall_postlike/pall_postlike')
const router = express.Router()
/*
  @params 添加文章
  1:查询user_id是否存在

*/

router.post('/add', async (req, res) => {
  let { article_title, article_content, catgory_id, release_time, article_cover, tags, level } = req.body
  if (!article_title) {
    return resJson(req, res, 5500, null, '请输入文章标题')
  }
  if (!article_content) {
    return resJson(req, res, 5500, null, '请输入文章内容')
  }
  if (!release_time) {
    return resJson(req, res, 5500, null, '请输入发布时间')
  }
  const create_time = moment().format('YYYY-MM-DD HH:mm:ss')
  const article_id = uuidv4()
  await PALLARTICLE.create({ article_id, article_title, article_cover, article_content, tags, level: String(level), user_id: new jwtUtil(req.headers.token).verifyToken(), release_time, create_time, catgory_id })
  return resJson(req, res, 5200, [], '添加成功')
})

/*
  @params获取用户发表文章
*/
// 
router.post('/list', async (req, res, next) => {
  const { page, size } = req.body
  let newSql = `select a.*,u.user_name,c.catgory_name from pall_articles a, pall_users u ,pall_categories c where a.user_id = u.user_id and a.catgory_id=c.catgory_id order by a.article_id ASC LIMIT ${page - 1},${size} ;`
  // let sql  = `select article_id,catgory_name,article_title,article_content,a.article_cover,a.catgory_id,create_time from pall_categories c RIGHT JOIN pall_articles a on c.catgory_id = a.catgory_id LIMIT ${page-1},${size}`
  let count = 'select count(*) from pall_articles'
  const list = await sequelize.query(newSql, { type: sequelize.QueryTypes.SELECT })
  const total = await sequelize.query(count, { type: sequelize.QueryTypes.SELECT })
  const fun = item => new Promise((resolve, reject) => {
    const result = PALL_LABEL.findOne({
      where: {
        id: item
      }
    })
    resolve(result)
  })
  const postlikeTotal = aid => new Promise((resolve, reject) => {
    const thumtotal = PALLPOSTLIKE.findAndCountAll({
      where: {
        aid: aid
      }
    })
    resolve(thumtotal)
  })
  for (let item of list) {
    let tagList = !item.tags ? [] : item.tags.split(',')
    item.tags = item.tags.split(',')
    item.release_time = moment(item.release_time).format('YYYY-MM-DD HH:mm:ss')
    item.labels = []
    item.thumbs_count = (await postlikeTotal(item.article_id)).count
    for (let tags of tagList) {
      let res = await fun(tags)
      item.labels.push(res.label_name || '')
    }
  }

  let obj = { rows: list, count: total[0]['count(*)'] }
  return resJson(req, res, 5200, obj, 'Success')
})
/*
  @params编辑用户文章
*/

router.post('/edit', async (req, res) => {
  const { article_id, article_content, article_title, create_time, catgory_id, article_cover, tags, level } = req.body
  const list = await PALLARTICLE.update({
    article_content, article_title, create_time, catgory_id, article_cover, tags, level,
  }, { where: { article_id } })
  if (list[0] < 0) {
    return resJson(req, res, 5500, null, '更新失败')
  }
  return resJson(req, res, 5200, null, '更新成功')
})

/*
  @params删除用户文章 article_id
*/

router.post('/del', async (req, res) => {
  const { article_id } = req.body
  const result = await PALLARTICLE.destroy({
    where: { article_id }
  })
  if (result == 1) return resJson(req, res, 5200, [], '删除成功')
  return resJson(req, res, 5500, null, '删除失败')
})
/*
  @params删除用户文章 爬取文章接口
*/

router.post('/getweb', async (req, res) => {
  let httpUrl = "https://www.douban.com/note/809971804/?_i=02460251yAKZ-T"
  getArticleInfo(httpUrl, req)

})



async function getArticleInfo(href, req) {
  let res = await axios.get(href)
  let $ = cheerio.load(res.data)
  let content = $('.note-container')
  const article_title = '测试1'
  const article_content = $.html(content)
  const release_time = new Date()
  const create_time = new Date()
  const article_cover = 'httdsada'
  const catId = 2
  await PALLARTICLE.create({ article_title, article_content, user_id: new jwtUtil(req.headers.token).verifyToken(), create_time, category_id: catId, release_time, article_cover })
}
module.exports = router