var express = require('express')
const { sequelize } = require('../../models/init')
const PALL_COMMENT = require('../../models/pall_comment/pall_comment')
const PALL_USER = require('../../models/pall_user/pall_user')
const resJson = require('../../utils/logFun')
var jwtUtil = require('../../utils/jwt')
const router = express.Router()

router.post('/list', async (req, res) => {
  /*
      查询一级评论id
  */
  let sql = `select c.*,a.article_title from  pall_comments c,pall_articles a where c.article_id = a.article_id AND c.parent_id = 0 ORDER BY c.comment_id desc`
  const list = await sequelize.query(sql, { type: sequelize.QueryTypes.SELECT })
  if (list) {
    return resJson(req, res, 5200, list, 'Success!')
  }
})

// 根据id去查询 一级 评论下面的二级评论
router.post('/second/comment', async (req, res) => {
  const { comment_id } = req.body
  let sccondSql = `select c.*,a.article_title from pall_comments c ,pall_articles a where parent_id = ${comment_id} and  c.article_id = a.article_id ORDER BY comment_id asc`
  const resultList = await sequelize.query(sccondSql, { type: sequelize.QueryTypes.SELECT })
  if (resultList) {
    return resJson(req, res, 5200, resultList, 'Success!')
  }
})

router.post('/insetcomment', async (req, res) => {
  const user_id = new jwtUtil(req.headers.token).verifyToken()
  const { user_name } = await PALL_USER.findOne({ where: { user_id } })
  const { parent_id, comment_time, comment_avtar, comment_content, content_flag, article_id, reply_comment_id, reply_user_id, reply_user_name } = req.body
  const result = await PALL_COMMENT.create({
    parent_id,
    comment_time,
    comment_avtar,
    comment_content,
    content_flag,
    article_id,
    user_id,
    user_name,
    reply_comment_id,
    reply_user_id,
    reply_user_name
  })
  /*
      let insetSql = `INSERT INTO pall_comments (parent_id,comment_avtar,comment_content,content_flag,article_id,user_id,user_name) 
      VALUES ([${parent_id}],${comment_avtar},${comment_content},${content_flag},${article_id},${user_id},${user_name})`
      const list = await sequelize.query(insetSql,{ type: sequelize.QueryTypes.SELECT })
  */
  if (result.dataValues) return resJson(req, res, 5200, [], '评论成功')
})

module.exports = router
