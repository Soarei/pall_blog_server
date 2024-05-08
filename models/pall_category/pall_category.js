const {sequelize} = require('../init')
const {DataTypes,Sequelize } = require('sequelize')
const PALL_CATEGORY = sequelize.define('pall_category',{
    // 分类id
    catgory_id:{
      type:DataTypes.INTEGER,
      allowNull:false,
      primaryKey:true,
      autoIncrement: true,
    },
    catgory_name:{
      type:DataTypes.STRING,
      allowNull:false
    },
    catgory_icon:{
      type:DataTypes.STRING,
      allowNull:false
    },
    catgory_rank:{
      type:DataTypes.STRING,
      allowNull:false
    },
    create_time:{
      type:DataTypes.DATE,
      allowNull:false
    },
    update_time:{
      type:DataTypes.DATE,
      allowNull:true
    }
})

PALL_CATEGORY.sync().then(()=>{
  console.log('PALL_CATEGORY CREATED!');
})

module.exports = PALL_CATEGORY