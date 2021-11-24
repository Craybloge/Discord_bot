const mysql = require("promise-mysql");

module.exports = mysql.createConnection({
    user: 'root',
    password: 'notSecureChangeMe',
    database: 'loopback'
});
