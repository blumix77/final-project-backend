
const express = require('express');
const router = express.Router();

const userController = require("../controllers/userController.js");

router.route("/")
    .get(userController.getUsers);

router.route("/:userID/borrow/:bookID")
    .put(userController.borrowBook);

router.route("/:userID/borrowed")
    .get(userController.getBorrowedBooks)
    


module.exports = router;