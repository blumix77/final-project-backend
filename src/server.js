
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const port = process.env.PORT || 4000;
const app = express();

/* Imports */

const { setCors } = require("./middlewares/cors.js");
const booksRouter = require("./routes/books.js");


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

/* Routes */

app.use("/books", booksRouter);

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