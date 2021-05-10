const Sequelize = require('sequelize');

const connection = new Sequelize('mysql_nodejs', 'docker', 'docker', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = connection;