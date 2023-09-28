require('dotenv').config();
const jwt = require('jsonwebtoken');
const secret = process.env.TOKEN_SECRET;
const cookieParser = require('cookie-parser');

exports.authorize = (req, res, next) => {
    const token = req.cookies.access_token;
  
    try {
        const data = jwt.verify(token, secret);
        req.loggedInId = data.id;
        next()
    } catch (err) {
        return res.sendStatus(400);
    }
};