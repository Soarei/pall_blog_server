const { sequelize } = require('../init')
const { DataTypes, Sequelize } = require('sequelize')

const PALL_LOG = sequelize.define('pall_log', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  /*
  unknow,login,info,admin,cron,manual
*/
  // tag:{
  //   type:DataTypes.ENUM('unknow','login','info','admin','cron','manual'),
  //   allowNull:false,
  //   defaultValue:'unknow'
  // },
  // 日志类型
  type: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 2
  },
  // 接口
  interlink: {
    type: DataTypes.STRING,
    allowNull: false
  },
  // ip地址
  host: {
    type: DataTypes.STRING,
    allowNull: false
  },
  hostorigin: {
    type: DataTypes.STRING,
    allowNull: false
  },
  // 请求方式
  method: {
    type: DataTypes.STRING,
    allowNull: false
  },
  // 请求耗时
  requestTime: {
    type: DataTypes.STRING,
    allowNull: false
  },
  // 请求时间
  asctime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  // 操作人
  operation: {
    type: DataTypes.STRING,
    allowNull: true
  },
  // 平台
  plateform: {
    type: DataTypes.STRING,
    allowNull: true
  },
  // 浏览器
  browser_name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  // 浏览器版本
  browser_version: {
    type: DataTypes.STRING,
    allowNull: true
  },
  // 异常信息
  errorMessage: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, { timestamps: false })

PALL_LOG.sync().then(() => {
  console.log('PALL_LOG CREATED!');
})

module.exports = PALL_LOG