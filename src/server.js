
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

////

const crypto = require("crypto");
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

/* const secret = crypto.randomBytes(64).toString('hex');
console.log(secret); */

const secret = process.env.TOKEN_SECRET;

exports.signAccessToken = data => {
    return jwt.sign(data, process.env.TOKEN_SECRET, {expiresIn: '1800s'});
};

exports.verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        const decodedData = jwt.verify(token, process.env.TOKEN_SECRET);
        next();
    } catch (error) {
        res.status(401).json({ message: "NOT AUTHORIZED!"});
    }
};


////

const port = process.env.PORT || 4000;
const app = express();



/* Imports */

const { setCors } = require("./middlewares/cors.js");
const booksRouter = require("./routes/books.js");
const userRouter = require("./routes/user.js");


/* DB */

/* const db = require("../src/config/db.js"); */
// const { connect, closeConnection } = require('./config/db.js');
/* Warum wird in der Console nicht die Verbindung zur Datenbank ausgegeben, obwohl sie in der config/db.js vermerkt ist? */

const db = mongoose
  .connect(`${process.env.DB_URL}${process.env.DB_NAME}`)
  .then(() => console.log("connected to DB"))
  .catch((err) => console.log("ERROR:", err.message));

/* Middleware */

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(setCors);
app.use(cookieParser());



/* Routes */
/* app.use("/login", userRouter); */
app.use("/books", booksRouter);
app.use("/user", userRouter);

/* Error Handling */

app.use((req, res, next) => {
    const error = new Error("Looks like something is broken...");
    error.statusCode = 404;
    next(error);
});

app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).send({
        error: {
            message: err.message
        }
    });
}); 

/* Listener */

app.listen(port, () => {
    console.log("Server is running on Port:", port);
})