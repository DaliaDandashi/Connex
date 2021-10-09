const bcrypt = require("bcryptjs"); //npm install bcryptjs --save
const jwt = require("jsonwebtoken");
const { connection } = require('../config');
import app from '../app';

let auth = () => {

    const isLoggedIn = async (req, res, next) => {
        const token = req.body.token;
        if (!token) next(new Error("Auth Error"));

        try {

            const decoded = jwt.verify(token, "randomString");
            const id = req.body.id;
            if (id != decoded.id) next(new Error("Invalid Token1"));

            const statement = `SELECT id,username,token FROM users WHERE token="${token}"`;
            connection.query(statement, (err, result) => {
                if (!result || !result[0].id || result[0].id != id) next(new Error("Invalid Token2"));

                req.id = decoded.id;
                req.result = result;


                next();
            })

        } catch (e) {
            next(new Error("Invalid Token3" + e.message));
        }

    }



    
    const signupAction = async () => {
        // check body data
        app.post('/signup', async (req, res, nex) => {
            const { firstname, lastname, username, phonenumber, password } = req.body;

            
            if (!username || !password) throw new Error("username and password are required");
            try {
                let selectStmt = `SELECT id, username, password FROM users WHERE username = "${username}"`;
                //   let salt = await bcrypt.genSalt(10);
                connection.query(selectStmt, async (err, result) => {
                    if (result.length >= 1) throw new Error("User already exists");
                    let salt = await bcrypt.genSalt(10);
                    let hashedPassword = await bcrypt.hash(password, salt);
                    let insertStmt = 'INSERT INTO users (firstname, lastname, username, phonenumber, password ) VALUES (?,?,?, ?, ?)';

                    connection.query(insertStmt, [firstname, lastname, username, phonenumber, hashedPassword], (err, result) => {
                        let id = result && result.insertId;

                        let payload = { id: id };
                        let token = jwt.sign(payload, "randomString", { expiresIn: 10000 });


                        let obj = {
                            'token': token
                        }
                        let query = 'update users SET ? where id=?';
                        connection.query(query, [obj, id], (err, result) => {
                            res.send({ id: id, token: token })

                        })
                    });

                });
            } catch (e) {
                throw new Error(`couldn't create user ` + e.message);
            }
        })
    }

    // let id =result && result.id;
    // let id = result ? result.id : 2;


    const loginAction = async () => {
        app.post('/login', async (req, res) => {
            let { username, password } = req.body;
            if (!username || !password) throw new Error("username and password are required");
            try {
                let statement = `SELECT id, username, password FROM users WHERE username = "${username}"`;
                connection.query(statement, async (err, result1) => {

                    if (result1.length === 0) console.log("User not found");
                    // check the password
                    let isMatch = await bcrypt.compare(password, result1[0].password);
                    if (!isMatch) throw new Error("Incorrect Password !");
                    // generate token
                    let payload = { id: result1[0].id };

                    let token = jwt.sign(payload, "randomString", { expiresIn: 10000 });
                    // add token to the user
                    let obj = {
                        'token': token
                    }
                    let query = 'update users SET ? where id=?';
                    connection.query(query, [obj, result1[0].id], (err, result) => {

                        res.send({ id: result1[0].id, token });
                    })
                })
            } catch (e) {
                throw new Error(`couldn't login user ` + e.message);

            }
        })
    }

    const logoutAction = async () => {
        app.post('/logout', isLoggedIn, (req, res) => {
            try {
                let query = 'UPDATE users SET token = ? WHERE id = ?';
                let obj = {
                    'token': null
                }
                let id = req.id

                connection.query(query, [obj, id], (err, result) => {
                    res.send("logged out successfully");
                })
            } catch (e) {
                throw new Error(`couldn't logout user ` + e.message);
            }
        })
    }

    signupAction();
    loginAction();
    logoutAction();
}
module.exports = { auth }