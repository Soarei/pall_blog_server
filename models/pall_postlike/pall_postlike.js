const {sequelize} = require('../init')
const {DataTypes,Sequelize } = require('sequelize')
const PALLPOSTLIKE = sequelize.define('pall_postlike',{
    id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement: true,
    },
    aid:{
        type:DataTypes.INTEGER,
        allowNull:false 
    },
    uid:{
        type:DataTypes.INTEGER,
        allowNull:false 
    },
    thumsTime:{
        type:DataTypes.DATE,
        allowNull:true
    }
},{
    timestamps:false
})

PALLPOSTLIKE.sync().then(()=>{
    console.log('PALLPOSTLIKE CREATED!');
})

module.exports = PALLPOSTLIKE