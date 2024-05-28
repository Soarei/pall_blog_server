const { sequelize } = require('../init')
const { DataTypes, Sequelize } = require('sequelize')

const PALL_ARTICLE_COLLECT = sequelize.define('pall_article_collect', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 200,
    primaryKey: true,
    autoIncrement: true
  },
  article_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  create_time: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, { tableName: 'pall_article_collect', freezeTableName: true, timestamps: false })

PALL_ARTICLE_COLLECT.sync().then(() => {
  console.log('收藏文章表创建成功');
})

module.exports = PALL_ARTICLE_COLLECT