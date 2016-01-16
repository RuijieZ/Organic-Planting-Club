var mysql = require("mysql");

var database = mysql.createConnection({
    port     : '3309',
    user     : 'allusers',
    password : 'pass1234',
    database : 'nodejs'
});
database.connect();

module.exports = database;