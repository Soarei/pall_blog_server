const { sequelize } = require('../init')
const { DataTypes } = require('sequelize')

const PALL_TASK = sequelize.define('pall_task', {
  id: {
    type: DataTypes.UUID,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  taskname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('1', '2', '3'),
    allowNull: false,
    defaultValue: '1'
  },
  startdate: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: '2022-09-09 00:00:00'
  },
  duedate: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: '2022-09-09 00:00:00'
  },
  clockhabit: {
    type: DataTypes.ENUM('周一', '周二', '周三', '周四', '周五', '周六', '周日'),
    allowNull: false,
    defaultValue: '周一'
  },
  taskicon: {
    type: DataTypes.STRING,
    allowNull: true
  },
  taskcolor: {
    type: DataTypes.STRING,
    allowNull: true
  },
  completed: {
    type: DataTypes.ENUM('0', '1'),
    allowNull: true,
    defaultValue: '0'
  }
}, { timestamps: false })


PALL_TASK.sync().then(() => {
  console.log('创建任务表成功');
})

module.exports = PALL_TASK