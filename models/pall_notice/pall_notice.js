const { sequelize } = require('../init')
const { DataTypes } = require('sequelize')

const PALL_NOTICE = sequelize.define('pall_notice', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  content: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  }
})

PALL_NOTICE.sync().then(() => {
  console.log('PALL_NOTICE CREATED!');
})

module.exports = PALL_NOTICE