var express = require('express')
var fs = require('fs')
// 映射路由
const { getRouterName } = require('./utils/routerMap')
require('express-async-errors')
const PALL_USER = require('./models/pall_user/pall_user')
var app = express()
/*
  1.读取routers下文件下的文件
  2.循环所有的文件
*/

var router = require('./routers/Pall_Blog/pall_blog')
var jwtUtil = require('./utils/jwt')
const resJson = require('./utils/logFun')
require('./models/init')
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(async (req, res, next) => {
  // 判断如果是web接口 直接走next()
  if (req.url.substring(0, 6) !== '/admin') {
    next()
  }
  else if (req.url === '/admin/register' || req.url === '/admin/login') {
    next()
  } else {
    /*1. 其他接口校验都是需要token(注册和登录是不需要token校验)
      2.如果校验通过就next 否则就返回登录信息不正确
      3.校验token和user表是否相等
    */
    let token = req.headers.token
    const isEval = await PALL_USER.findOne({ attributes: ["user_id"], where: { accesstoken: token } })
    let jwt = new jwtUtil(token)
    let result = jwt.verifyToken()
    if (!isEval || result === 'err') {
      return res.send({ code: 1001, data: null, message: '登录信息过期,请重新登录' })
    }
    next()
  }
})
// 后台路由
var routerFiles = fs.readdirSync('./routers')
// web接口路由
var webRouterFiles = fs.readdirSync('./webRouter')
routerFiles.forEach(v => {
  app.use('/admin' + '/' + getRouterName()[v], require('./routers' + '/' + v + '/' + (v.toLocaleLowerCase() || 'index')))
})
webRouterFiles.forEach(w => {
  app.use('/' + w, require('./webRouter' + '/' + w + '/' + 'index'))
})
app.use(router)
app.use(function (err, req, res, next) {
  if (err) {
    console.log(err);

    const { message } = err
    return resJson(req, res, 5500, null, message, 3)
  }
})
app.listen(4001, () => {
  console.log('http://localhost:4001');
})



