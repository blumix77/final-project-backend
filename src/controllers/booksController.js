
require('dotenv').config();

const { Book }  = require("../models/Book.js");

exports.getAllBooks = (req, res) => {
    Book
    .find()
    .then(books => 
    {
        res.status(200).json(
        {
            success: true,
            data: books,
            message: "All listed Books!"
        }
    )
    })
    .catch(err => console.log(err.message));
}

exports.getBook = (req, res) => {
    const { id } = req.params;
    Book
    .findById(id)
    .then(book => {
        res.status(200).json({
            success: true,
            id,
            data: book,
        })
    })
    .catch(err => console.log(err.message));
} 

exports.getBooksByGenre = (req, res) => {
    const { genre } = req.params;
    Book
    .find({ genre: genre })
    .then(books => {
        res.status(200).json({
            success: true,
            amount: books.length,
            data: books,
        })
    })
    .catch(err => console.log(err.message));
}