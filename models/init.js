const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('pall_blog', 'root', '', {
  host: 'localhost',
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