const { logFun } = require('./log')

const resJson = (req, res, code, data, msg, type) => {
  /*
    type， 1:登录注册日志  2:用户日志 3:异常日志 4: 日志列表(不记录)
  */
  data = data || null
  code = code || 200
  message = msg || '',
    type = type || 4
  logFun(req, { code, data, message, type })
  // console.log(res,'res');
  return res.json({ code, data, message })
}

module.exports = resJson