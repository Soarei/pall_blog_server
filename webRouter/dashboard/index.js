var express = require('express')
var jwtUtil = require('../../utils/jwt')
const { Op } = require('sequelize')
const resJson = require('../../utils/logFun')
const PALLARTICLE = require('../../models/pall_article/pall_article')
const PALL_ARTICLE_LABEL = require('../../models/pall_article_label/pall_article_label')
const PALL_ARTICLE_COLLECT = require('../../models/pall_article_collect/pall_article_collect')
const PALL_USER = require('../../models/pall_user/pall_user')
const PALL_CATEGORY = require('../../models/pall_category/pall_category')
const PALL_LABEL = require('../../models/pall_label/pall_label')
const PALLPOSTLIKE = require('../../models/pall_postlike/pall_postlike')
const PALL_COMMENT = require('../../models/pall_comment/pall_comment')
const PALL_COURSE = require('../../models/pall_course/pall_course')
const moment = require('moment')
const router = express.Router()
router.get('/article/page', async (req, res) => {
  const { page, size, catgory_id } = req.query
  PALLARTICLE.belongsTo(PALL_USER, {
    foreignKey: 'user_id',
    targetKey: 'user_id'
  })
  // 关联表的文章、标签
  PALLARTICLE.belongsToMany(PALL_LABEL, {
    through: PALL_ARTICLE_LABEL,
    foreignKey: 'article_id',
  })
  PALL_LABEL.belongsToMany(PALLARTICLE, {
    through: PALL_ARTICLE_LABEL,
    foreignKey: 'label_id',
  })
  try {
    const { rows, count } = await PALLARTICLE.findAndCountAll({
      where: {
        catgory_id
      },
      attributes: { exclude: ['user_id'] },
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
          attributes: ['label_name', 'id', 'color'],
          model: PALL_LABEL
        }
      ],
    })
    return resJson(req, res, 5200, { rows, count }, 'success')
  } catch (error) {
    console.log(error, 'error');
  }
})
//获取轮播图接口
router.get('/article/platform/banner', async (req, res) => {
  try {
    const banner = await PALL_COURSE.findAll({
      order: [['sort', 'DESC']],
      limit: 5
    })
    return resJson(req, res, 5200, banner, 'Success')
  } catch (error) {
    return resJson(req, res, 5500, null, error.message)
  }
})
//获取浏览量很高的五篇文章
router.get('/article/top', async (req, res) => {
  try {
    const topArticle = await PALLARTICLE.findAll({
      order: [['browse_count', 'DESC']],
      limit: 10
    })
    const result = {
      data: topArticle.map(item => ({
        article_id: item.article_id,
        article_title: item.article_title
      }))
    }
    return resJson(req, res, 5200, result, 'Success')
  } catch (error) {
    return resJson(req, res, 5500, null, error.message)
  }
})
router.get('/article/page/detail', async (req, res) => {
  try {
    const { articleId } = req.query
    const data = await PALLARTICLE.findOne({
      where: {
        article_id: articleId,
      },
      attributes: { exclude: ['user_id'] }
    })
    //文章点赞数
    const thumbCount = await PALLPOSTLIKE.count({
      where: {
        aid: articleId
      }
    })
    //文章收藏数
    const collectCount = await PALL_ARTICLE_COLLECT.count({
      where: {
        article_id: articleId
      }
    })
    //获取文章标签
    const labels = await PALL_LABEL.findAll({
      where: {
        "id": {
          [Op.or]: data.tags.split(',')
        }
      },
      attributes: ['label_name', 'color']
    })
    const article = await PALLARTICLE.findByPk(articleId);
    //浏览量➕1
    if (article) {
      article.browse_count += 1
      await article.save();
    }
    //返回结果封装
    const results = {
      thumbCount,
      collectCount,
      labels,
      ...data.dataValues
    }
    return resJson(req, res, 5200, results, 'Success')
  } catch (error) {
    console.log(error);
  }
})
//获取作者信息
router.get('/article/page/detail/userinfo', async (req, res) => {
  try {
    const { articleId } = req.query
    const result = await PALLARTICLE.findOne({
      where: {
        article_id: articleId
      },
      attributes: ['user_id']
    })
    const userId = result.user_id
    //获取文章数
    const articleCount = await PALLARTICLE.count({
      where: {
        user_id: userId
      }
    })
    // 获取评论数
    const commentCount = await PALL_COMMENT.count({
      where: {
        user_id: userId
      }
    })
    // 获取收藏数
    const collectCount = 99
    // 获取作者信息
    const pallUserInfo = await PALL_USER.findOne({
      where: {
        user_id: userId
      },
      attributes: ['user_name', 'user_avatar', 'user_gender']
    })
    var results = {
      articleCount,
      commentCount,
      collectCount,
      userName: pallUserInfo.user_name,
      userAvatar: pallUserInfo.user_avatar,
      userGender: pallUserInfo.user_gender
    }
    return resJson(req, res, 5200, results, 'Success')
  } catch (error) {
    return resJson(req, res, 5500, results, error)
  }
})
// 获取点赞数量
router.get('/article/page/detail/count', async (req, res) => {
  try {
    const { articleId } = req.query
    console.log(articleId);
    const thumbCount = await PALLPOSTLIKE.count({
      where: {
        aid: articleId
      }
    })
    const commentCount = await PALL_COMMENT.count({
      where: {
        article_id: articleId
      }
    })
    const collectCount = await PALL_ARTICLE_COLLECT.count({
      where: {
        article_id: articleId
      }
    })
    const result = {
      thumbCount,
      commentCount,
      collectCount
    }
    return resJson(req, res, 5200, result, 'Success')
  } catch (error) {
    console.log(error);
  }
})
//获取文章评论
router.get('/article/page/detail/comments', async (req, res) => {
  try {
    const { articleId } = req.query
    // 获取评论内容
    let comments = await PALL_COMMENT.findAll({
      where: {
        article_id: articleId,
      },
      order: [['comment_time', 'DESC']],
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
        parent_id: comment.parent_id,
        content: comment.content,
        user: {
          id: comment.pall_user.user_id,
          username: comment.pall_user.user_name,
          avatar: comment.pall_user.user_avatar
        },
        createTime: comment.comment_time,
        children: comment.children,
        commentCount
      }))
    }
    return resJson(req, res, 5200, results, 'Success')

  } catch (error) {

  }
})
//添加用户评论
router.post('/article/page/detail/commentsadd', async (req, res) => {
  try {
    const { content, parentId, commentPic, comment_time } = req.body
    const data = await PALL_COMMENT.create({
      content,
      parent_id: parentId,
      comment_avtar: commentPic,
      user_id: 1,
      article_id: '50eb9701-0b86-4011-89ab-e4dca4556c6f',
      comment_time
    })
    return resJson(req, res, 5200, [], '添加成功')
  } catch (error) {
    return resJson(req, res, 5500, [], error)
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