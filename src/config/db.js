
require("dotenv").config();
const mongoose = require("mongoose");

exports.connect = async () => 
{
    try {
        const db = await mongoose.connect(`${process.env.DB_URL}${process.env.DB_NAME}`);
        /* .then(() => ) */console.log(`Connected to DB on ${db.connection.host}`);
    } catch(err) {
        console.log("ERROR:", err.message);
    }
}

exports.closeConnection = () => mongoose.connection.close();