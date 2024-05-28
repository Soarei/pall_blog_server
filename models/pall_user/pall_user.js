const { sequelize } = require('../init')
const { DataTypes, Sequelize } = require('sequelize')
const PALL_SYSTEM_ROLE = require('../pall_system_role/pall_system_role')
const PALL_SYSTEM_ROLE_USER = require('../pall_system_role_user/pall_system_role_user')
const PALL_USER = sequelize.define('pall_user', {
  /**
      
   */
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  user_account: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  user_name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  user_avatar: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  user_age: {
    type: DataTypes.STRING,
    allowNull: true
  },
  user_gender: {
    // 0:未知, 1:男,2:女
    type: DataTypes.BIGINT,
    allowNull: true
  },
  // status 0 是正常 1是异常
  status: {
    type: DataTypes.BIGINT,
    allowNull: false,
    defaultValue: 0
  },
  accesstoken: {
    type: DataTypes.STRING(255),
    allowNull: false,
    defaultValue: '0'
  }

}, { timestamps: true })

PALL_USER.belongsToMany(PALL_SYSTEM_ROLE, { through: PALL_SYSTEM_ROLE_USER })
PALL_SYSTEM_ROLE.belongsToMany(PALL_USER, { through: PALL_SYSTEM_ROLE_USER })
PALL_USER.sync().then(() => {
  console.log('用户表初始化成功');
})

module.exports = PALL_USER