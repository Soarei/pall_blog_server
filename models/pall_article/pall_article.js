const { sequelize } = require('../init')
const { DataTypes, Sequelize } = require('sequelize')
const PALLARTICLE = sequelize.define('pall_article', {
  /**
      
   */
  // 文章标题
  article_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  // 作者id
  user_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  // 分类id
  catgory_id: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 1
  },
  // 创建时间
  create_time: {
    type: DataTypes.DATE,
    allowNull: true
  },
  release_time: {
    type: DataTypes.DATE,
    allowNull: false
  },
  // tags标签
  tags: {
    type: DataTypes.STRING,
    allowNull: true
  },
  // 推荐等级 枚举
  level: {
    type: DataTypes.ENUM('0', '1', '2', '3'),
    allowNull: true,
    defaultValue: '0'
  },
  // 文章标题
  article_title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  // 文章封面
  article_cover: {
    type: DataTypes.STRING,
    allowNull: false
  },
  // 文章内容
  article_content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  // 点赞次数
  thumbs_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: true
  },
  // 评论次数
  comment_count: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  // 浏览次数
  browse_count: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('1', '2', '3', '4'),
    allowNull: false,
    defaultValue: '1'
  },
}, { tableName: 'pall_articles', freezeTableName: true, timestamps: false })
// {define:{freezeTableName:true}}
PALLARTICLE.sync().then(() => {
  console.log('PALL_ARTICLE CREATED!');
})

module.exports = PALLARTICLE