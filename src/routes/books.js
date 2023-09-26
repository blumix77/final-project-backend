
const express = require('express');
const router = express.Router();

const booksController  = require("../controllers/booksController.js");

router.route("/")
    .get(booksController.getAllBooks);

router.route("/:id")
    .get(booksController.getBook);

router.route("/genre/:genre")
    .get(booksController.getBooksByGenre);


module.exports = router;