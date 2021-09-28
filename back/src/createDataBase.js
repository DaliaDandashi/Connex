let { connection } = require("./config");
const bcrypt = require("bcryptjs");

const createDataBase = async () => {

    //here we will write our query.


    var users = `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    role INTEGER NOT NULL DEFAULT 0,
    firstname TEXT, 
    lastname TEXT,
    username TEXT ,
    phonenumber TEXT , 
    password TEXT NOT NULL,
    token TEXT
    
    )`;


    var trip = `CREATE TABLE IF NOT EXISTS trip (
        id INTEGER PRIMARY KEY AUTO_INCREMENT,
        tripe_title TEXT,
       route TEXT 
        
        )`;




    var bus = `CREATE TABLE IF NOT EXISTS bus (
        id INTEGER PRIMARY KEY AUTO_INCREMENT,
        time TEXT NOT NULL ,
        date  TEXT,
        longitude TEXT, 
        laltitude TEXT,
        empty_place TEXT,
        total_place TEXT,
        id_trip INTEGER NOT NULL,
        id_users INTEGER NOT NULL,
        FOREIGN KEY (id_trip) REFERENCES trip(id),
        FOREIGN KEY (id_users) REFERENCES users(id)
          )`;



    var reservation = `CREATE TABLE IF NOT EXISTS reservation (
                id INTEGER PRIMARY KEY AUTO_INCREMENT,
                firstname TEXT,
                lastname TEXT,
                phonenumber TEXT,
                pickup_address TEXT,
                id_bus INTEGER NOT NULL,
                id_users INTEGER NOT NULL,
                FOREIGN KEY (id_bus) REFERENCES bus(id),
                FOREIGN KEY (id_users) REFERENCES users(id)
                   )`;

    var mssg = `CREATE TABLE IF NOT EXISTS mssg (
                    id INTEGER PRIMARY KEY AUTO_INCREMENT,
                    name TEXT,
                    email TEXT,
                    phonenumber TEXT,
                    message TEXT
                   
                 
                )`;

    let arr = [users, trip, bus, reservation, mssg];

    arr.map(sql => {
        connection.query(sql, function (err, result) {
            if (err) throw err;
        });
    });

    connection.query(`SELECT * FROM users`, async function (err, result) {
        if (err) throw err;

        if (!result.length) {
            let salt = await bcrypt.genSalt(10);
            let hashedPassword = await bcrypt.hash('admin', salt);

            let att = "firstname, lastname, username, phonenumber, password, role";
            let inValues = "?, ?, ?, ?, ?";
            let values = ['admin', 'admin', 'admin', '03000000', hashedPassword, 1];
            let sql = `INSERT INTO users (${att}) VALUES (${inValues})`;

            connection.query(sql, values, function (err, result) {
                if (err) throw err;
            });
        }
    });

}
module.exports = { createDataBase };