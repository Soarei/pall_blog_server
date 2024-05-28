const { sequelize } = require('../init')
const { DataTypes, Sequelize } = require('sequelize')
const PALL_LABEL = require('../pall_label/pall_label')
const PALL_ARTICLE_LABEL = require('../pall_article_label/pall_article_label')
const PALL_POSTLIKE = require('../pall_postlike/pall_postlike')
const PALL_COMMENT = require('../pall_comment/pall_comment')
const PALL_USER = require('../pall_user/pall_user')
const PALL_CATEGORY = require('../pall_category/pall_category')
const PALLARTICLE = sequelize.define('pall_article', {
  /**
   */
  // 文章标题
  article_id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  // 作者id
  user_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  // 分类id
  catgory_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
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
    // ‘’是全部 1是审核中、2是审核成功、3是审核失败
    type: DataTypes.ENUM('1', '2', '3', '4'),
    allowNull: false,
    defaultValue: '1'
  },
  listing: {
    // 0是上架状态、1是下架状态，且需要审核通过后才能操作上下架
    type: DataTypes.ENUM(0, 1),
    allowNull: false,
    defaultValue: 0
  }
}, { tableName: 'pall_articles', freezeTableName: true, timestamps: false })
PALLARTICLE.belongsTo(PALL_USER, {
  foreignKey: 'user_id',
  targetKey: 'user_id'
})
//分类表的关联
PALLARTICLE.belongsTo(PALL_CATEGORY, {
  foreignKey: 'catgory_id',
  targetKey: 'catgory_id'
})
PALL_CATEGORY.hasMany(PALLARTICLE, {
  foreignKey: 'catgory_id',
  targetKey: 'catgory_id'
})
// 关联表的文章、标签
PALLARTICLE.belongsToMany(PALL_LABEL, {
  through: PALL_ARTICLE_LABEL,
  foreignKey: 'article_id'
})
PALL_LABEL.belongsToMany(PALLARTICLE, {
  through: PALL_ARTICLE_LABEL,
  foreignKey: 'label_id'
})
// 关联表点赞表、用户表、文章表
PALLARTICLE.hasMany(PALL_POSTLIKE, {
  foreignKey: 'aid'
})
PALL_POSTLIKE.belongsTo(PALLARTICLE, {
  foreignKey: 'aid'
})
// 评论表、用户表、文章表
PALLARTICLE.hasMany(PALL_COMMENT, { foreignKey: 'article_id' })
PALL_COMMENT.belongsTo(PALLARTICLE, { foreignKey: 'article_id' })
PALL_USER.hasMany(PALL_COMMENT, { foreignKey: 'user_id' })
PALL_COMMENT.belongsTo(PALL_USER, { foreignKey: 'user_id' })

PALLARTICLE.sync().then(() => {
  console.log('PALL_ARTICLE CREATED!');
})
module.exports = PALLARTICLE