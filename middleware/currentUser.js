const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const currentUser = (req, res, next) => {

    const token = req.cookies.token;

    if (!token) {
        res.locals.user = null;
        return next();
    }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        User.findById(decoded.id, (err, result) => {

            if (err || result.length === 0) {
                res.locals.user = null;
            } else {
                res.locals.user = result[0];
            }

            next();

        });

    } catch (error) {

        res.locals.user = null;
        next();

    }

};

module.exports = currentUser;