
require('dotenv').config();

const Book = require("../models/Book.js");
const User = require("../models/User.js");

////
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const secret = process.env.TOKEN_SECRET;



////

exports.loginUser = async (req, res, next) => {

    try {
        const { email, password } = req.body;
        const user = await User.findOne({email});

        if(user) {
            if(user.password === password) {
                const token = jwt.sign({ user, id: user._id }, secret)

                res
                .cookie('access_token', token , {
                    maxAge: 24 * 60 * 60 * 1000,
                    httpOnly: true
                })
                .status(200)
                .json({
                    success: true,
                    message: `User ${email} is logged in!`
                })}
        } else {
            res.status(403).json({
                success: false,
                message: "User not found!"
            })
        }
    } catch (error) {
        next(error);
    }
}



////


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

exports.getUser = (req, res) => {
    const { id } = req.params;
    User
    .findById(id)
    .then(user => {
        res.status(200).json({
            success: true,
            id,
            data: user,
        })
    })
    .catch(err => console.log(err.message));
} 

exports.borrowBook = async (req, res) => {
    
    const { /* userID, */ bookID } = req.params;
    //console.log(userID, bookID);

    try {
        // Suchen des Benutzers und des Buches in der DB
        const user = await User.findById(req.loggedInId); //userID
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

exports.returnBook = async (req, res) => {
    const { userID, bookID } = req.params;

    try {

        const user = await User.findById(userID);
        const book = await Book.findById(bookID);

        if(!user || !book) {
            return res.status(404).json({
                success: false,
                message: "User or Book not found!"
            });
        }

        if(!user.books.includes(bookID)) {
            return res.status(400).json({
                success: false,
                message: "The book wasn´t borrowed by the user!"
            })
        }

        // Entfernen des Buches aus der List der ausgeliehenen Bücher des Benutzers
        user.books = user.books.filter((borrowedBookID) => !borrowedBookID.equals(bookID));

        book.isAvailable = true

        await user.save();
        await book.save();

        res.status(200).json({
            success: true,
            message: "The book was successfully returned!"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error returning the book!"
        });
    }
};