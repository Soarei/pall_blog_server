var express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const { v4: uuidv4 } = require('uuid')
const { Op } = require('sequelize')
const PALLARTICLE = require('../../models/pall_article/pall_article')
const resJson = require('../../utils/logFun')
var jwtUtil = require('../../utils/jwt')
const moment = require('moment')
const PALL_LABEL = require('../../models/pall_label/pall_label')
const PALLPOSTLIKE = require('../../models/pall_postlike/pall_postlike')
const PALL_ARTICLE_LABEL = require('../../models/pall_article_label/pall_article_label')
const PALL_USER = require('../../models/pall_user/pall_user')
const PALL_CATEGORY = require('../../models/pall_category/pall_category')
const router = express.Router()
/*
  @params 添加文章
  1:查询user_id是否存在
*/

router.post('/add', async (req, res) => {
  try {
    console.log(PALLARTICLE);
    let { article_title, article_content, catgory_id, release_time, article_cover, tags, level } = req.body
    const create_time = moment().format('YYYY-MM-DD HH:mm:ss')
    const article_id = uuidv4()
    await PALLARTICLE.create({ article_id, article_title, article_cover, article_content, tags: tags.join(','), level: String(level), user_id: new jwtUtil(req.headers.token).verifyToken(), release_time, create_time, catgory_id, listing: '0' })
    let atags = tags.map(item => ({
      article_id: article_id,
      label_id: item
    }))
    await PALL_ARTICLE_LABEL.bulkCreate(atags)
    return resJson(req, res, 5200, [], '添加成功')
  } catch (error) {
    return resJson(req, res, 5500, null, error.message)
  }
})

/*
  @params获取用户发表文章
*/
// 
router.post('/list', async (req, res, next) => {
  try {
    const { page, size, article_title } = req.body
    let { rows, count } = await PALLARTICLE.findAndCountAll({
      where: {
        article_title: {
          [Op.like]: `%${article_title}%`
        },
      },
      order: [['create_time', 'DESC']],
      attributes: { exclude: ['user_id'] },
      offset: (page - 1) * size,
      limit: size,
      include: [
        {
          attributes: ['catgory_id', 'catgory_name'],
          model: PALL_CATEGORY,
        },
        {
          attributes: ['user_name', 'user_avatar'],
          model: PALL_USER
        },
        {
          attributes: ['label_name', 'id', 'color'],
          model: PALL_LABEL
        }
      ],
    })
    console.log(rows);
    const results = {
      rows: rows.map(item => (
        {
          labels: item.pall_labels.map(label => ({
            name: label.label_name,
            id: label.id,
            color: label.color
          })),
          article_content: item.article_content,
          article_id: item.article_id,
          article_cover: item.article_cover,
          article_title: item.article_title,
          browse_count: item.browse_count,
          catgory_id: item.catgory_id,
          level: Number(item.level),
          create_time: item.create_time,
          catgory_name: item.pall_category ? item.pall_category.catgory_name : '未找到分类',
          user_avatar: item.pall_user.user_avatar,
          user_name: item.pall_user.user_name,
          release_time: item.release_time,
          status: item.status,
          listing: item.listing,
          tags: item.tags,
          count,
        }))
    }
    return resJson(req, res, 5200, results, 'Success')
  } catch (error) {
    console.log(error);
    return resJson(req, res, 5500, null, error.message)
  }
})
/*
  @params编辑用户文章
*/

router.post('/edit', async (req, res) => {
  try {
    let { article_id, article_content, article_title, create_time, catgory_id, article_cover, tags, level } = req.body
    await PALLARTICLE.update({
      article_content, article_title, create_time, catgory_id, article_cover, tags: tags.join(','), level,
    }, { where: { article_id } })
    await PALL_ARTICLE_LABEL.destroy({
      where: {
        article_id
      }
    })
    let atags = tags.map(item => ({
      article_id: article_id,
      label_id: item
    }))
    await PALL_ARTICLE_LABEL.bulkCreate(atags)
    return resJson(req, res, 5200, null, '更新成功')
  } catch (error) {
    return resJson(req, res, 5500, null, error.message)
  }
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