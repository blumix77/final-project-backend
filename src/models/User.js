const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");

const userSchema = new Schema(
    {
        // userID: { type: Number, trim: true, required: true },
        firstname: { type: String, trim: true, required: true},
        lastname: { type: String, trim: true, required: true },
        email:{ type :String , trim :true  , required :true },
        books: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Book"
        }]
    }, { timestamps: true });

const User = new model( "User", userSchema, "users")

module.exports = User;