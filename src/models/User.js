const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");
const crypto = require('crypto');
const secret = process.env.TOKEN_SECRET;

const userSchema = new Schema(
    {
        // userID: { type: Number, trim: true, required: true },
        firstname: { type: String, trim: true, required: true},
        lastname: { type: String, trim: true, required: true },
        email:{ type: String , trim :true  , required :true },
        password: { type: String, required: true },
        // hash: { type: String, required: true },
        books: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Book"
        }]
    }, { timestamps: true });

/// PASSWORD AUTH 

userSchema.methods.hashPassword = (password) => {
    return crypto.createHmac('sha256', secret).update(password).digest('hex'); 
}

userSchema.methods.comparePassword = function (loginPassword) {
    if (this.password !== this.hashPassword(loginPassword))
    {
        return false;
    }

    return true;
} 

///

const User = new model( "User", userSchema, "users")

module.exports = User;