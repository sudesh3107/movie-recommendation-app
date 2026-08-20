const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// ================= Register =================

exports.register = async (req, res) => {

    try {

        const { fullname, email, password } = req.body;

        User.findByEmail(email, async (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Database Error"
                });
            }

            if (result.length > 0) {
                return res.json({
                    success: false,
                    message: "Email already exists"
                });
            }

            const hash = await bcrypt.hash(password, 10);

            User.create(fullname, email, hash, (err) => {

                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: "Registration Failed"
                    });
                }

                res.json({
                    success: true,
                    message: "Registration Successful"
                });

            });

        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }

};

// ================= Login =================

exports.login = (req, res) => {

    const { email, password } = req.body;

    User.findByEmail(email, async (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Server Error"
            });
        }

        if (result.length === 0) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        const user = result[0];

        const valid = await bcrypt.compare(password, user.password);

        if (!valid) {
            return res.status(401).json({
                success: false,
                message: "Wrong Password"
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                fullname: user.fullname,
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000
        });

        return res.json({
            success: true,
            message: "Login Successful"
        });

    });

};

// ================= Logout =================

exports.logout = (req, res) => {

    res.clearCookie("token");

    res.redirect("/login");

};