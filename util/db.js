const db = require('knex')({
    client: 'mysql',
    connection: {
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: 'password',
        database: 'name-exchange',
    },
});

module.exports = db;
