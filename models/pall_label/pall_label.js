const {sequelize} = require('../init')
const {DataTypes,Sequelize } = require('sequelize')
const PALL_LABEL = sequelize.define('pall_label',{
    id:{
      type:DataTypes.INTEGER,
      allowNull:false,
      primaryKey:true,
      autoIncrement:true
    },
    label_name:{
      type:DataTypes.STRING,
      allowNull:false
    },
    create_time:{
      type:DataTypes.DATE,
      allowNull:true
    },
    update_time:{
      type:DataTypes.DATE,
      allowNull:true
    },
    status:{
      type:DataTypes.BOOLEAN,
      allowNull:false,
      defaultValue:false
    },
    thumbs_count:{
      type:DataTypes.STRING,
      allowNull:false,
      defaultValue:0
    }
  },{
    timestamps:false
  }
)
PALL_LABEL.sync().then(()=>{
  console.log('PALL_LABEL CREATED!');
})
module.exports = PALL_LABEL