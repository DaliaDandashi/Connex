var mysql = require('mysql');

let connection = mysql.createConnection({
    host: "localhost",
    user: "dd",
    password: "dalia123",
    database: "connex"
});


connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected!")
});

module.exports = { connection }