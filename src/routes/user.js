
const express = require('express');
const router = express.Router();

const userController = require("../controllers/userController.js");
const authUser = require('../middlewares/authUser.js');

router.route("/login")
    .post(userController.loginUser)

router.route("/")
    .get(userController.getUsers);

router.route("/:id")
    .get(userController.getUser)
    //.get(authUser.authorize, userController.getUser)

router.route("/:userID/borrow/:bookID")
    .put(userController.borrowBook)

router.route("/:userID/borrowed")
    .get(userController.getBorrowedBooks)

router.route("/:userID/return/:bookID")
    .put(userController.returnBook)


module.exports = router;