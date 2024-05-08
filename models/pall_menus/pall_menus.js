const { sequelize } = require('../init')
const { DataTypes } = require('sequelize')
const PALL_SYSTEM_MENUS = sequelize.define('pall_system_menus', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type:DataTypes.STRING(50),
        allowNull:false
    },
    routeUrl:{
        type:DataTypes.STRING(200),
        allowNull:false
    },
    url:{
        type:DataTypes.STRING(200),
        allowNull:false
    },
    icon:{
        type:DataTypes.STRING(200),
        allowNull:false
    },
    type:{
        type: DataTypes.INTEGER(11),
        allowNull: false,
    },
    sort:{
        type: DataTypes.INTEGER(11),
        allowNull: false,
    },
    note:{
        type:DataTypes.STRING(100),
        allowNull:false
    },
    parentId:{
        type:DataTypes.INTEGER(11),
        allowNulll:true
    },
    permission:{
        type:DataTypes.STRING(500),
        allowNull:true
    },
    create_time:{
        type:DataTypes.DATE,
        allowNull:false
    },
    update_time:{
        type:DataTypes.DATE,
        allowNull:true
    },
    create_user:{
        type:DataTypes.STRING(20),
        allowNull:true
    },
    modify_user:{
        type:DataTypes.STRING(20),
        allowNull:true
    }
}, { timestamps: false })

PALL_SYSTEM_MENUS.sync().then(()=>{
    console.log('PALL_SYSTEM_MENUS CREATED!');
  })

module.exports = PALL_SYSTEM_MENUS