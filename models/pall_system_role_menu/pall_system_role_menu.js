const { sequelize } = require('../init')
const { DataTypes } = require('sequelize')

const PALL_SYSTEM_ROLE_MENU = sequelize.define('pall_system_role_menu',{
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
  menu_id:{
    type:DataTypes.INTEGER,
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

PALL_SYSTEM_ROLE_MENU.sync().then(()=>{
  console.log('PALL_SYSTEM_ROLE_MENU CREATED!');
})

module.exports = PALL_SYSTEM_ROLE_MENU