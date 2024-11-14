const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('pallblog', 'pallblog', 'xBRmdpPpKxZ3s64x', {
  host: '123.60.59.147',
  port: '3306',
  dialect: 'mysql',
  timezone: '+08:00',
  define: {
    timestamps: false
  },
  dialectOptions: {
    dateStrings: true,
    typeCast: true
  }
});

sequelize.authenticate().then(() => {
  console.log('Connect has been established successfully');
}).catch(err => {
  console.log(err);
})


module.exports = { Sequelize, sequelize }