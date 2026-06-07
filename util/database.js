const Sequelize = require('sequelize');

// Create a new Sequelize instance (manages a connection pool automatically)
const sequelize = new Sequelize('node-complete', 'root', 'Bijay@1995', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;