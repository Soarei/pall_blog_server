var express = require('express')
const { sequelize } = require('../../models/init')
const jwtUtil = require('../../utils/jwt')
const router = express.Router()
const resJson = require('../../utils/logFun')
const PALL_USER = require('../../models/pall_user/pall_user')
const PALLARTICLE = require('../../models/pall_article/pall_article')
// 引入生成和验证token的类

const validUser = (req, res) => {
  const { user_account, password } = req.body
  if (!user_account) {
    resJson(req, res, 5500, null, '请输入用户名')
  }
  if (!password) {
    resJson(req, res, 5500, null, '请输入密码')
  }
}

// 注册用户
router.post('/admin/register', async (req, res) => {
  const { user_account, password } = req.body
  // 判断账户密码是否输入
  validUser(req, res)
  const model = await PALL_USER.findOne({ where: { user_account } })
  if (model) {
    return resJson(req, res, 5500, null, '用户名已存在')
  }
  await PALL_USER.create({ user_account, password })
  return resJson(req, res, 5200, [], '注册成功')
})

// 登录
router.post('/admin/login', async (req, res) => {
  //  登录日志IP console.log(req.headers['x-forwarded-for']);
  var start = new Date();
  const { user_account, password } = req.body
  // 判断账户密码是否输入
  validUser(req, res)
  const model = await PALL_USER.findOne({ where: { user_account } })
  if (!model) {
    return resJson(req, res, 5500, null, '用户名错误')
  }
  if (model.password !== password) {
    return resJson(req, res, 5500, null, '密码错误')
  }
  let sql = `select u.status from pall_users u where u.user_account = ` + `'${user_account}'`
  // 查询当前用户的角色ID
  let roleSql = `SELECT sm.* FROM  pall_system_menus sm, pall_system_role_menus srm WHERE sm.id = srm.menu_id AND srm.role_id = (select sru.role_id from pall_system_role_users sru where sru.user_id = ${model.user_id})`
  // 当前用户所拥有的菜单列表
  const user = await sequelize.query(sql, { type: sequelize.QueryTypes.SELECT })
  if (user[0].status === 1) {
    return resJson(req, res, 5500, null, '用户账号被冻结,请联系管理员', 1)
  } else {
    const user_info = await PALL_USER.findOne({
      attributes: [
        'user_id',
        "user_account",
        "user_name",
        "user_avatar",
        "user_age",
        "user_gender",
        "createdAt",
        "status",
        "updatedAt"],
      where: { user_account }
    })
    const perission = await sequelize.query(roleSql, { type: sequelize.QueryTypes.SELECT })
    req.requestTime = new Date() - start
    // 对token加密处理 登录成功
    let jwt = new jwtUtil(model.user_id)
    // 生成token
    let token = jwt.generateToken()
    const setAcccessToken = await PALL_USER.update({
      accesstoken: token
    }, { where: { user_account } })
    console.log(setAcccessToken);
    // token值加密后存入user表
    // await PALL_USER.create({user_account,password,user_id:user_account})
    return resJson(req, res, 5200, { jwt: token, user_info, perission }, '登录成功!', 1)
  }
})

// 用户主页数据
router.post('/admin/authorinfo', async (req, res) => {
  let staticinfo = {
    artile_count: 0,
    thumbs_count: 0,
    comment_count: 0,
    browse_count: 0
  }
  //查询文章表该用户数据的综合
  staticinfo.artile_count = await PALLARTICLE.sum('comment_count', {
    where: {
      user_id: 1
    }
  })
  staticinfo.comment_count = await PALLARTICLE.sum('comment_count', {
    where: {
      user_id: 1
    }
  })
  // 点赞
  staticinfo.thumbs_count = await PALLARTICLE.sum('thumbs_count', {
    where: {
      user_id: 1
    }
  })
  staticinfo.browse_count = await PALLARTICLE.sum('browse_count', {
    where: {
      user_id: 1
    }
  })
  return resJson(req, res, 5200, staticinfo, '注册成功')
})
// 
module.exports = router