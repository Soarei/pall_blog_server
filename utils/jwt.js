const jwt = require('jsonwebtoken')

// 创建一个token类

class Jwt {
  constructor(data) {
    this.data = data
  }
  // 生成token的方法
  generateToken() {
    let data = this.data
    let created = Math.floor(Date.now() / 1000)
    let token = jwt.sign({ data, exp: created + 60 * 60 * 30 }, "yyjkn")
    return token
  }
  // 校验token的方法
  verifyToken() {
    let token = this.data
    let res
    try {
      let result = jwt.verify(token, "yyjkn")
      let { exp = 0 } = result
      let current = Math.floor(Date.now() / 1000)
      if (current <= exp) {
        res = result.data || {}
      }
    } catch (error) {
      res = 'err'
    }
    return res
  }
}

module.exports = Jwt