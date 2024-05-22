const { sequelize } = require('../init')
const { DataTypes, Sequelize } = require('sequelize')
const PALL_COMMENT = sequelize.define('pall_comments', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  parent_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  content: {
    type: DataTypes.STRING,
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  article_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  comment_time: {
    type: DataTypes.DATE,
    allowNull: true
  },
  comment_avtar: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: false,

})

PALL_COMMENT.sync().then(() => {
  console.log('评论表初始化成功!');
}).catch(error => {
  console.log(error);
})

module.exports = PALL_COMMENT