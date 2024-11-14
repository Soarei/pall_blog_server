const { sequelize } = require('../init')
const { DataTypes } = require('sequelize')

const PALL_VOICE = sequelize.define('pall_voice', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  voiceCode: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  voiceName: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  stylelist: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: true
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: true
  },
  type: {
    type: DataTypes.ENUM('男生', '女生', '儿童', '老人'),
    allowNull: true,
    defaultValue: '男生'
  },
  enabled: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, { timestamps: false })

PALL_VOICE.sync().then(() => {
  console.log('PALL_VOICE CREATED!');
})

module.exports = PALL_VOICE