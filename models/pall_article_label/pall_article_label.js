const { sequelize } = require('../init')
const { DataTypes } = require('sequelize')

const PALL_ARTICLE_LABEL = sequelize.define('pall_article_label', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  article_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  label_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
}, { timestamps: false })
PALL_ARTICLE_LABEL.sync().then(() => {
  console.log('PALL_ARTICLE_LABEL CREATED!');
})

module.exports = PALL_ARTICLE_LABEL
