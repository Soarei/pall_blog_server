const { sequelize } = require('../init')
const { DataTypes } = require('sequelize')

const PALL_SYSTEM_ROLE_USER = sequelize.define('pall_system_role_user',{
  id:{
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  role_id:{
    type:DataTypes.INTEGER,
    allowNull:false
  },
  user_id:{
    type:DataTypes.INTEGER,
    allowNull:false
  },
  create_time:{
    type:DataTypes.DATE,
    allowNull:false
  },
  update_time:{
    type:DataTypes.DATE,
    allowNull:false
  }
})

PALL_SYSTEM_ROLE_USER.sync().then(()=>{
  console.log('PALL_SYSTEM_ROLE_USER CREATED!');
})

module.exports = PALL_SYSTEM_ROLE_USER