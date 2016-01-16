var mysql = require("mysql");

var database = mysql.createConnection({
    port     : '3309',
    user     : 'root',
    password : 'root',
    database : 'nodejs'
});
database.connect();

module.exports = database;