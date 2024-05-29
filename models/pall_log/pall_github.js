const { sequelize } = require('../init')
const { DataTypes, Sequelize } = require('sequelize')

const PALL_GIHUB = sequelize.define('pall_github', {
  sha: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  commit_time: {
    type: DataTypes.DATE,
    allowNull: false
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, { timestamps: false })

PALL_GIHUB.sync().then(() => {
  console.log('更新日志模型');
})

module.exports = PALL_GIHUB