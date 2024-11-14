const { sequelize } = require('../init')
const { DataTypes, Sequelize } = require('sequelize')
const PALL_COLLECTION = sequelize.define('pall_collection', {
  // 分类id
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  goodsName: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  goodsPicture: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  collectUrl: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  // 0代表初始化 1代表采集成功,2代表采集失败
  status: {
    type: DataTypes.ENUM('0', '1', '2', '3'),
    allowNull: true
  },
  // 采集时间
  createTime: {
    type: DataTypes.DATE,
    allowNull: true
  },
}, { timestamps: false })

PALL_COLLECTION.sync().then(() => {
  console.log('PALL_COLLECTION CREATED!');
})

module.exports = PALL_COLLECTION