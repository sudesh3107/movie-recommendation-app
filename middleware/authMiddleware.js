const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const authMiddleware = (req, res, next) => {

    const token = req.cookies.token;

    if (!token) {
        return res.redirect("/login");
    }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        User.findById(decoded.id, (err, result) => {

            if (err || result.length === 0) {
                return res.redirect("/login");
            }

            req.user = result[0];
            res.locals.user = result[0];

            next();

        });

    } catch (error) {

        return res.redirect("/login");

    }

};

module.exports = authMiddleware;