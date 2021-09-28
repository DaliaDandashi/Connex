import auth from './auth/controller';
auth.auth();

const app = require('./app');
const data = require('./createDataBase');

let { connection } = require("./config");
data.createDataBase();

const start = async () => {

    //////////////////// USER ///////////////////
    // CREATE user
    app.post('/user', async (req, res, next) => {
        const { firstname, lastname, username, phonenumber, password } = req.body;
        let att = "firstname, lastname,username, phonenumber,password ";
        let values = [firstname, lastname, username, phonenumber, password];
        let inValues = "?,?,?,?,?";
        try {
            let sql = `INSERT INTO users (${att}) VALUES (${inValues})`;
            connection.query(sql, values, function (err, result) {
                if (err) throw err;
                res.json({ success: true, result });
            });
        } catch (e) {
            next(e);
        }
    });

    //get one user by id
    app.get('/user/:id', async (req, res, next) => {
        const { id } = req.params;
        try {
            let sql = `SELECT * FROM users WHERE id = ${id} LIMIT 1`;
            connection.query(sql, function (err, result) {
                if (err) throw err;
                res.json({ success: true, result: result[0] });
            });
        } catch (e) {
            next(e);
        }
    });

    //get all the users
    app.get('/user', async (req, res, next) => {
        try {
            let sql = `SELECT * FROM users`;
            connection.query(sql, function (err, result) {
                if (!result) {
                    res.json({ error: err });
                };

                res.json({ success: true, result });

            });
        } catch (e) {
            next(e);
        }
    });





    app.get('/driversss', async (req, res, next) => {
        try {
            let sql = `SELECT * FROM users where role=0`;
            connection.query(sql, function (err, result) {
                if (!result) {
                    res.json({ error: err });
                };

                res.json({ success: true, result });

            });
        } catch (e) {
            next(e);
        }
    });







    //delete user
    app.delete('/user/:id', async (req, res, next) => {
        const { id } = req.params;
        try {
            let sql = `DELETE FROM users WHERE id = ${id}`;
            connection.query(sql, function (err, result) {
                if (!result) {
                    res.json({ error: err });
                };
                res.json({ success: true, result });
            });
        } catch (e) {
            next(e);
        }
    });
    ////// update user
    app.put('/user/:id', (req, res) => {
        let { id } = req.params;
        let { firstname, lastname, username, phonenumber, password } = req.body;
        let str = "";
        let values = [];

        if (firstname) {
            str += " firstname = ?,";
            values.push(firstname);
        }
        if (lastname) {
            str += " lastname = ?,";
            values.push(lastname);
        }
        if (username) {
            str += " username = ?,";
            values.push(username);
        }
        if (phonenumber) {
            str += " phonenumber = ?,";
            values.push(phonenumber);
        }
        if (password) {
            str += " password = ?,";
            values.push(password);
        }


        str = str.slice(0, -1);
        str += " WHERE id= ?"
        values.push(id);

        let sql = `UPDATE users SET ${str}`;
        connection.query(sql, values, function (err, result) {
            if (!result) {
                res.send({ error: false });
            }
            res.send({ success: true, result });
        });
    });

    ///////////////////////// trip //////////////////////

    // CREATE trip
    app.post('/trip', async (req, res, next) => {
        const { tripe_title, route } = req.body;
        let att = " tripe_title, route ";
        let values = [tripe_title, route];
        let inValues = "?,?";
        try {
            let sql = `INSERT INTO trip (${att}) VALUES (${inValues})`;
            connection.query(sql, values, function (err, result) {
                if (err) throw err;
                res.json({ success: true, result });
            });
        } catch (e) {
            next(e);
        }
    });

    //get one trip by id
    app.get('/trip/:id', async (req, res, next) => {
        const { id } = req.params;
        try {
            let sql = `SELECT * FROM trip WHERE id = ${id} LIMIT 1`;
            connection.query(sql, function (err, result) {
                if (err) throw err;
                res.json({ success: true, result: result[0] });
            });
        } catch (e) {
            next(e);
        }
    });
    //get all the trip
    app.get('/trip', async (req, res, next) => {
        try {
            let sql = `SELECT * FROM trip`;
            connection.query(sql, function (err, result) {
                if (err) throw err;
                res.json({ success: true, result });
            });
        } catch (e) {
            next(e);
        }
    });
    //delete trip
    app.delete('/trip/:id', async (req, res, next) => {
        const { id } = req.params;
        try {
            let sql = `DELETE FROM trip WHERE id = ${id}`;
            connection.query(sql, function (err, result) {
                if (err) throw err;
                res.json({ success: true, result });
            });
        } catch (e) {
            next(e);
        }
    });

    ////// update trip
    app.put('/trip/:id', (req, res) => {
        let { id } = req.params;
        let { tripe_title, route } = req.body;
        let str = "";
        let values = [];

        if (tripe_title) {
            str += " tripe_title = ?,";
            values.push(tripe_title);
        }

        if (route) {
            str += " route = ?,";
            values.push(route);
        }




        str = str.slice(0, -1);
        str += " WHERE id= ?"
        values.push(id);

        let sql = `UPDATE trip SET ${str}`;
        connection.query(sql, values, function (err, result) {
            if (err) throw err;
            res.send({ success: true, result });
        });
    });

    ////////////////////// BUS //////////////////////////////

    // CREATE bus
    app.post('/bus', async (req, res, next) => {
        const { time, date, longitude, laltitude, empty_place, total_place, id_trip, id_users } = req.body;
        let att = "time, date, longitude, laltitude, empty_place, total_place, id_trip, id_users";
        let values = [time, date, longitude, laltitude, empty_place, total_place, id_trip, id_users];
        let inValues = "?,?,?,?,?,?,?,?";
        try {
            let sql = `INSERT INTO bus (${att}) VALUES (${inValues})`;
            connection.query(sql, values, function (err, result) {
                if (!result) {
                    res.json({ error: err })
                    return
                }
                res.json({ success: true, result });
            });
        } catch (e) {
            next(e);
        }
    });

    //get one bus by id
    app.get('/bus/:id', async (req, res, next) => {
        const { id } = req.params;
        try {
            let sql = `SELECT * FROM bus WHERE id = ${id} LIMIT 1`;
            connection.query(sql, function (err, result) {
                if (err) throw err;
                res.json({ success: true, result: result[0] });
            });
        } catch (e) {
            next(e);
        }
    });

    //get all the bus
    app.get('/bus', async (req, res, next) => {
        try {
            let sql = `SELECT * FROM bus`;
            connection.query(sql, function (err, result) {
                if (err) throw err;
                res.json({ success: true, result });
            });
        } catch (e) {
            next(e);
        }
    });


    //delete user
    app.delete('/bus/:id', async (req, res, next) => {
        const { id } = req.params;
        try {
            let sql = `DELETE FROM bus WHERE id = ${id}`;
            connection.query(sql, function (err, result) {
                if (err) throw err;
                res.json({ success: true, result });
            });
        } catch (e) {
            next(e);
        }
    });
    ////// update bus
    app.put('/bus/:id', (req, res) => {
        let { id } = req.params;
        let { time, date, longitude, laltitude, empty_place, total_place, id_trip } = req.body;
        let str = "";
        let values = [];

        if (time) {
            str += " time = ?,";
            values.push(time);
        }
        if (date) {
            str += " date = ?,";
            values.push(date);
        }
        if (longitude) {
            str += " longitude = ?,";
            values.push(longitude);
        }
        if (laltitude) {
            str += " laltitude = ?,";
            values.push(laltitude);
        }
        if (empty_place) {
            str += " empty_place = ?,";
            values.push(empty_place);
        }
        if (total_place) {
            str += " total_place = ?,";
            values.push(total_place);
        }
        if (id_trip) {
            str += " id_trip = ?,";
            values.push(id_trip);
        }



        str = str.slice(0, -1);
        str += " WHERE id= ?"
        values.push(id);

        let sql = `UPDATE bus SET ${str}`;
        connection.query(sql, values, function (err, result) {
            if (err) throw err;
            res.send({ success: true, result });
        });
    });

    //////////////////// RESERVATION ///////////////////

    // CREATE reservation
    app.post('/reservation', async (req, res, next) => {
        const { firstname, lastname, phonenumber, pickup_address, id_bus, id_users } = req.body;
        let att = " firstname,lastname, phonenumber,pickup_address, id_bus, id_users ";
        let values = [firstname, lastname, phonenumber, pickup_address, id_bus, id_users];
        let inValues = "?,?,?,?,?,?";
        try {
            let sql = `INSERT INTO reservation (${att}) VALUES (${inValues})`;
            connection.query(sql, values, function (err, result) {
                if (err) throw err;
                res.json({ success: true, result });
            });
        } catch (e) {
            next(e);
        }
    });

    //get one reservation by id
    app.get('/reservation/:id', async (req, res, next) => {
        const { id } = req.params;
        try {
            let sql = `SELECT * FROM reservation WHERE id = ${id} LIMIT 1`;
            connection.query(sql, function (err, result) {
                if (err) throw err;
                res.json({ success: true, result: result[0] });
            });
        } catch (e) {
            next(e);
        }
    });
    //get all the reservation
    app.get('/reservation', async (req, res, next) => {
        try {
            let sql = `SELECT * FROM reservation`;
            connection.query(sql, function (err, result) {
                if (err) throw err;
                res.json({ success: true, result });
            });
        } catch (e) {
            next(e);
        }
    });
    //delete reservation trip
    app.delete('/reservation/:id', async (req, res, next) => {
        const { id } = req.params;
        try {
            let sql = `DELETE FROM reservation WHERE id = ${id}`;
            connection.query(sql, function (err, result) {
                if (err) throw err;
                res.json({ success: true, result });
            });
        } catch (e) {
            next(e);
        }
    });


    app.get('/joinuser', async (req, res, next) => {

        try {
            let sql = `SELECT 

                    reservation.firstname,
                    reservation.lastname,
                    reservation.phonenumber,
                    reservation.pickup_address,
        
                    bus.date,
                    bus.time,

                    trip.tripe_title as trip
                    
                    FROM reservation 
                    JOIN bus ON bus.id = reservation.id_bus
                    JOIN trip ON trip.id = bus.id_trip
                    `;

            connection.query(sql, function (err, result) {
                if (err) throw err;
                res.json({ success: true, result });
            });
        } catch (e) {
            next(e);
        }
    });


    ////// update reservation
    app.put('/reservation/:id', (req, res) => {
        let { id } = req.params;
        let { pickup_adress, id_bus, id_users } = req.body;
        let str = "";
        let values = [];

        if (pickup_address) {
            str += " pickup_address = ?,";
            values.push(pickup_address);
        }
        if (id_bus) {
            str += " id_bus = ?,";
            values.push(id_bus);
        }
        if (id_users) {
            str += " id_users = ?,";
            values.push(id_users);
        }



        str = str.slice(0, -1);
        str += " WHERE id= ?"
        values.push(id);

        let sql = `UPDATE reservation SET ${str}`;
        connection.query(sql, values, function (err, result) {
            if (err) throw err;
            res.send({ success: true, result });
        });
    });

    ///////////////mssg/////////////////

    app.get('/mssg', async (req, res, next) => {
        try {
            let sql = `SELECT * FROM mssg`;
            connection.query(sql, function (err, result) {
                if (!result) {
                    res.json({ error: false })
                }
                res.json({ success: true, result });
            });
        } catch (e) {
            next(e);
        }
    });



    // CREATE mssg
    app.post('/mssg', async (req, res, next) => {
        const { name, email, phonenumber, message } = req.body;
        let att = "name, email, phonenumber,message ";
        let values = [name, email, phonenumber, message];
        let inValues = "?,?,?,?";
        try {
            let sql = `INSERT INTO mssg (${att}) VALUES (${inValues})`;
            connection.query(sql, values, function (err, result) {
                if (err) throw err;
                res.json({ success: true, result });
            });
        } catch (e) {
            next(e);
        }
    });


    app.delete('/mssg/:id', async (req, res, next) => {
        const { id } = req.params;
        try {
            let sql = `DELETE FROM mssg WHERE id = ${id}`;
            connection.query(sql, function (err, result) {
                if (!result) {
                    res.json({ error: false })
                }
                res.json({ success: true, result });
            });
        } catch (e) {
            next(e);
        }
    });
}
app.get('/', (req, res) => res.send("ok"));
app.listen(process.env.PORT || 8000, () => console.log('server listening on port 8000'));
start();
