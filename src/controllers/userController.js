
require('dotenv').config();

const Book = require("../models/Book.js");
const User = require("../models/User.js");

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({
            success: true,
            data: users,
            amount: users.length,
            message: "All listed Users!"
        });
    } catch (err) {
        next(err);
    }
}


exports.borrowBook = async (req, res) => {
    
    const { userID, bookID } = req.params;
    console.log(userID, bookID);

    try {
        // Suchen des Benutzers und des Buches in der DB
        const user = await User.findById(userID);
        const book = await Book.findById(bookID);
        /* console.log("user", userID);
        console.log("book", bookID); */
        console.log(user);
        console.log(book);

        if (!user || !book) {
            return res.status(404).json({
                success: false,
                message: "User or Book not found!"
            });
        }
        console.log(book.isAvailable);
        if(!book.isAvailable) {
            return res.status(400).json({
                success: false,
                message: "Book is temporary not available!"
            });
        }

        // Hinzufügen des Buches zur Liste der ausgeliehenen Bücher des Benutzers
        user.books.push(bookID);

        book.isAvailable = false;

        await user.save();
        await book.save();
   
        res.status(200).json({
            success: true,
            message: "The book has been successfully borrowed!"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error borrowing the book!"
        });
    }
};

exports.getBorrowedBooks = async (req, res) => {
    
    const { userID } = req.params;

    try {

        const user = await User.findById(userID).populate("books");
    
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found!"
            });
        }
        else {
            res.status(200).json({
            success: true,
            data: user.books,
            message: "List of books borrowed by the user."
            });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error retrieving borrowed books!"
        });
    }
};