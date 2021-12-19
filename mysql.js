const mysql = require("promise-mysql");

module.exports = mysql.createConnection({
    user: 'loopback',
    password: 'loopback',
    database: 'backend_course'
});
