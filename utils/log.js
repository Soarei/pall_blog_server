let log4js = require('log4js')
var parser = require('ua-parser-js')
const moment = require('moment')
const PALL_LOG = require('../models/pall_log/pall_log')
const jwtUtil = require('../utils/jwt')
const axios = require('axios')

// 生成file的默认配置

log4js.configure({
  appenders: {
    ruleConsole: { type: 'console' },
    ruleFile: {
      type: 'dateFile',
      filename: 'log/server',
      pattern: 'yyyy-MM-dd.log',
      maxLogSize: 10 * 1000 * 1000,
      numBackups: 3,
      alwaysIncludePattern: true
    },
    // layout:{type:'pattern'}
    'out': {
      type: 'stdout',
      layout: {
        type: "colored"
      }
    }
  },
  categories: {
    default: { appenders: ['ruleConsole', 'ruleFile'], level: 'info' }
  },
})
const logFun = async (req, res) => {
  const logger = log4js.getLogger()
  const logInfo = {
    req,
    res
  }
  // 接口 方法 IP IP来源 平台 浏览器 用户行为 请求时间 状态 操作人 请求耗时
  const { originalUrl } = logInfo.req
  // const host = logInfo.req.headers.host
  const method = logInfo.req.method
  const { os, browser } = parser(logInfo.req.headers['user-agent'])
  const asctime = moment().format('YYYY-MM-DD HH:mm:ss')
  const getipAddress = data => new Promise((reslove, reject) => {
    const result = axios.get(data)
    reslove(result)
  })
  var host = logInfo.req.ip
  host = host.substring(host.lastIndexOf("\:") + 1, host.length)
  var urlquer = "https://sp0.baidu.com/8aQDcjqpAAV3otqbppnN2DJv/api.php?query=" + host + "&co=&resource_id=6006&t=1555898284898&ie=utf8&oe=utf8&format=json&tn=baidu"
  const {data:{data}} = await getipAddress(urlquer)
  const location = data.length ? data[0].location : '本地局域网'
  // const location = data != 0 ? IPlist.location : '本地局域网'
  const { type } = res
  // 查询账户
  await PALL_LOG.create({
    type,
    interlink: originalUrl,
    host,
    hostorigin: location,
    requestTime: req.requestTime || 0,
    asctime,
    plateform: os.name,
    method,
    browser_name: browser.name,
    browser_version: browser.version,
    operation: logInfo.req.body ? logInfo.req.body.user_account : new jwtUtil(req.headers.token).verifyToken(),
    errorMessage: res.code === 5500 ? res.message : ''
  })
  // console.log(result);
}

const logDefault = () => {
  return log4js.connectLogger(log4js.getLogger('access'), { level: log4js.levels.INFO })
}

module.exports = {
  logFun,
  logDefault,
}
