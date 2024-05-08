const {sequelize} = require('../init')
const {DataTypes,Sequelize } = require('sequelize')
const PALL_COMMENT = sequelize.define('pall_comment',{
  comment_id:{
    type:DataTypes.INTEGER,
    allowNull:false,
    primaryKey:true,
    autoIncrement:true
  },
  parent_id:{
    type:DataTypes.STRING,
    allowNull:false
  },
  comment_content:{
    type:DataTypes.STRING,
    allowNull:false
  },
  user_id:{
    type:DataTypes.STRING,
    allowNull:false
  },
  user_name:{
    type:DataTypes.STRING,
    allowNull:false
  },
  reply_comment_id:{
    type:DataTypes.STRING,
    allowNull:true
  },
  article_id:{
    type:DataTypes.STRING,
    allowNull:false
  },
  content_flag:{
    type:DataTypes.STRING,
    allowNull:false
  },
  reply_user_id:{
    type:DataTypes.STRING,
    allowNull:true
  },
  reply_user_name:{
    type:DataTypes.STRING,
    allowNull:true
  },
  comment_time:{
    type:DataTypes.DATE,
    allowNull:true
  },
  comment_avtar:{
    type:DataTypes.STRING,
    allowNull:true
  }   
},{
  timestamps:false
})

PALL_COMMENT.sync().then(()=>{
  console.log('PALL_COMMENT CREATED!');
})

module.exports = PALL_COMMENT