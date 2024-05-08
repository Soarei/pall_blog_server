const { sequelize } = require('../init')
const { DataTypes } = require('sequelize')

const PALL_SYSTEM_ROLE = sequelize.define('pall_system_role',{
  id:{
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  name:{
    type:DataTypes.STRING(200),
    allowNull:false
  },
  code:{
    type:DataTypes.STRING(200),
    allowNull:false
  },
  create_time:{
    type:DataTypes.DATE,
    allowNull:true
  },
  update_time:{
    type:DataTypes.DATE,
    allowNull:true
  }
})

PALL_SYSTEM_ROLE.sync().then(()=>{
  console.log('PALL_SYSTEM_ROLE CREATED!');
})

module.exports = PALL_SYSTEM_ROLE