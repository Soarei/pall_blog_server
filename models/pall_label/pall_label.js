const { sequelize } = require('../init')
const { DataTypes, Sequelize } = require('sequelize')
const { v4: uuidv4 } = require('uuid')
const { formatUUIDV4 } = require('../../utils/index')

const PALL_LABEL = sequelize.define('pall_label', {
  id: {
    type: DataTypes.UUID,
    allowNull: false,
    defaultValue: formatUUIDV4('LB', uuidv4()),
    primaryKey: true,
  },
  label_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  create_time: {
    type: DataTypes.DATE,
    allowNull: true
  },
  update_time: {
    type: DataTypes.DATE,
    allowNull: true
  },
  color: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  thumbs_count: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 0
  }
}, {
  timestamps: false
}
)
PALL_LABEL.sync().then(() => {
  console.log('PALL_LABEL CREATED!');
})
module.exports = PALL_LABEL