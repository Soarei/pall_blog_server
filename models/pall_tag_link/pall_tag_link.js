const {sequelize} = require('../init')
const {DataTypes,Sequelize } = require('sequelize')
const PALL_TAGLINK = sequelize.define('pall_tag_link',{
    id:{
      type:DataTypes.INTEGER,
      allowNull:false,
      primaryKey:true,
      autoIncrement:true
    },
    tid:{
      type:DataTypes.INTEGER,
      allowNull:false,
    },
    aid:{
      type:DataTypes.INTEGER,
      allowNull:false,
    }
},{timestamps:false})

PALL_TAGLINK.sync().then(()=>{
  console.log('PALL_TAGLINK CREATED!');
})

module.exports = PALL_TAGLINK