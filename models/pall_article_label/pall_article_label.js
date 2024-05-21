const { sequelize } = require('../init')
const { DataTypes } = require('sequelize')
const PALL_LABEL = require('../pall_label/pall_label')
const PALLARTICLE = require('../pall_article/pall_article')

const PALL_ARTICLE_LABEL = sequelize.define('pall_article_label', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  article_id: {
    type: DataTypes.UUID,
    allowNull: false
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
