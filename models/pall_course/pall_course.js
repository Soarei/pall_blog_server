const { sequelize } = require('../init')
const { DataTypes } = require('sequelize')

const PALL_COURSE = sequelize.define('pall_course',{
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    picture:{
        type:DataTypes.STRING(255),
        allowNull:false
    },
    title:{
        type:DataTypes.STRING(255),
        allowNull:false
    },
    startTime:{
        type:DataTypes.DATE,
        allowNull:false
    },
    endTime:{
        type:DataTypes.DATE,
        allowNull:false
    },
    address:{
        type:DataTypes.STRING(255),
        allowNull:false
    },
    sort:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    enabled:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue:false
    }
},{timestamps:true})

PALL_COURSE.sync().then(() => {
    console.log('PALL_COURSE CREATED!');
  })
  
  module.exports = PALL_COURSE