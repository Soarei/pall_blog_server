var express = require('express')
var jwtUtil = require('../../utils/jwt')
const resJson = require('../../utils/logFun')
const PALLARTICLE = require('../../models/pall_article/pall_article')
const PALL_ARTICLE_LABEL = require('../../models/pall_article_label/pall_article_label')
const PALL_USER = require('../../models/pall_user/pall_user')
const PALL_CATEGORY = require('../../models/pall_category/pall_category')
const PALL_LABEL = require('../../models/pall_label/pall_label')
const PALLPOSTLIKE = require('../../models/pall_postlike/pall_postlike')
const PALL_COMMENT = require('../../models/pall_comment/pall_comment')
const moment = require('moment')
const router = express.Router()
router.get('/article/page', async (req, res) => {
  const { page, size, catgory_id } = req.query
  PALLARTICLE.belongsTo(PALL_USER, {
    foreignKey: 'user_id',
    targetKey: 'user_id'
  })
  PALLARTICLE.hasOne(PALL_CATEGORY, {
    foreignKey: 'catgory_id',
    targetKey: 'catgory_id'
  })
  // PALL_CATEGORY.hasMany(PALLARTICLE, {
  //   foreignKey: 'catgory_id',
  //   targetKey: 'catgory_id'
  // })
  try {
    const { rows, count } = await PALLARTICLE.findAndCountAll({
      where: {
        catgory_id
      },
      attributes: { exclude: ['user_id'] },
      // [sequelize.fn('COUNT', sequelize.col('pall_postlike.aid')), 'likeCount']
      offset: (Number(page) - 1) * Number(size),
      limit: Number(size),
      include: [
        {
          attributes: ['user_name', 'user_avatar'],
          model: PALL_USER
        }, {
          attributes: ['catgory_id', 'catgory_name'],
          model: PALL_CATEGORY,
        }, {
          attributes: ['label_name', 'id'],
          model: PALL_LABEL,
        }
      ],
    })
    // 查询文章是否被当前用户点赞
    const isThumbs = aid => new Promise(async (resolve, reject) => {
      console.log(aid);
      const uid = new jwtUtil(req.headers.token).verifyToken()
      const is_thumbs = await PALLPOSTLIKE.findOne({
        where: {
          aid,
          uid: 1
        }
      })
      const { count } = await PALLPOSTLIKE.findAndCountAll({
        where: {
          aid
        }
      })
      resolve({ is_thumbs, count })
    })
    async function formatRows() {
      let list = JSON.parse(JSON.stringify(rows))
      console.log(list);
      for (let i = 0; i < list.length; i++) {
        const { is_thumbs, count } = await isThumbs(list[i].article_id)
        list[i].is_thumbs = is_thumbs != null ? true : false
        list[i].thumbsCount = count
      }
      return list
    }
    const result = await formatRows()
    return resJson(req, res, 5200, { rows: result, count }, 'success')
  } catch (error) {
    console.log(error, 'error');
  }
})
router.get('/article/page/detail', async (req, res) => {
  try {
    const { articleId } = req.query
    const data = await PALLARTICLE.findOne({
      where: {
        article_id: articleId,
      }
    })
    return resJson(req, res, 5200, data, 'Success')
  } catch (error) {
    console.log(error);
  }
})
//获取文章评论
router.get('/article/page/detail/comments', async (req, res) => {
  try {
    const { articleId } = req.query
    // 获取评论内容
    const comments = await PALL_COMMENT.findAll({
      where: {
        article_id: articleId,
      },
      include: {
        attribute: ['user_id', 'user_name', 'user_avatar'],
        model: PALL_USER,
      }
    })
    // 获取评论数量
    const commentCount = await PALL_COMMENT.count({
      where: { article_id: articleId }
    });
    const results = {
      comments: comments.map(comment => ({
        id: comment.id,
        content: comment.content,
        user: {
          id: comment.pall_user.user_id,
          username: comment.pall_user.user_name,
          avatar: comment.pall_user.user_avatar
        },
        createTime: comment.comment_time,
        commentCount
      }))
    }
    return resJson(req, res, 5200, results, 'Success')

  } catch (error) {

  }
})
/*
  @params点赞功能 aid uid
*/
router.post('/postlike', async (req, res) => {
  // 判断当前用户是否已经点赞
  console.log(req.body);
  const { article_id } = req.body
  const uid = new jwtUtil(req.headers.token).verifyToken()
  const result = await PALLPOSTLIKE.findOne({
    where: {
      uid: 1,
      aid: article_id
    }
  })
  if (result !== null) return resJson(req, res, 5500, null, '该用户已经点赞了')
  // 在点赞表新增一条记录
  const addresult = await PALLPOSTLIKE.create({ aid: article_id, uid: 1, thumsTime: moment().format('YYYY-MM-DD HH:mm:ss') })
  if (addresult) return resJson(req, res, 5200, [], 'Success')
})
// 获取分类
router.post('/category/list', async (req, res) => {
  const list = await PALL_CATEGORY.findAll()
  return resJson(req, res, 5200, list, 'Success')
})
module.exports = router