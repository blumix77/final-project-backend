

const { Schema, model } = require("mongoose");

const bookSchema = new Schema(
    {
    title: String,
    author: String,
    genre: String,
    year: Number,
    ISBN: Number,
    }, 
{ timestamps: true });

const Book = new model("Book", bookSchema, "books");

module.exports = { bookSchema, Book };