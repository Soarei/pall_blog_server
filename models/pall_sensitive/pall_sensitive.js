const { sequelize } = require('../init')
const { DataTypes } = require('sequelize')

const PALL_SENSITIVE = sequelize.define('pall_sensitive', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  // 敏感词内容
  content: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  // 是否删除
  is_delete: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  create_time: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  // 是否开启
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
})

PALL_SENSITIVE.sync().then(() => {
  console.log('PALL_SENSITIVE CREATED!');
})

module.exports = PALL_SENSITIVE