/* DEPENDENCIES */

require("dotenv").config();
const Chance = require("chance");
const mongoose = require("mongoose");

/* DB */

/* const db = mongoose
  .connect(`${process.env.DB_URL}${process.env.DB_NAME}`)
  .then(() => console.log("connected to DB"))
  .catch((err) => console.log("ERROR:", err.message)); */

const { connect, closeConnection } = require("../config/db.js");

/* MODELS TO SEED */

const { Book } = require("../models/Book.js");

const chance = new Chance();

const generateBooks = (num) => {
    const books = [];
    const genres = ["novel", "science-fiction", "fantasy", "comic", "crime", "nonfiction"];

    for(let i = 0; i < num; i++) {
        const title = chance.string({ symbols: false }) + chance.string();
        const author = chance.name();
        const genre = chance.pickone(genres);
        const year = chance.natural({ min: 1700, max: 2023});
        const ISBN = chance.natural();

        books.push({
            title,
            author,
            genre,
            year,
            ISBN
        });
    }
    return books;
}

const seed = async () => {

    await connect().then(async () => {
        await Book
        .insertMany(generateBooks(20))
        .then(docs => {
            console.log(docs);
        })
        .catch(err => {
            console.log(err.message);
        })
    });
    await closeConnection();
    // mongoose.connection.close();
}   

seed();
