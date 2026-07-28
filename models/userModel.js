const db = require("../config/db");

const User = {

    create: (fullname, email, password, callback) => {
        const sql = "INSERT INTO users(fullname,email,password) VALUES(?,?,?)";
        db.query(sql, [fullname, email, password], callback);
    },

    findByEmail: (email, callback) => {
        const sql = "SELECT * FROM users WHERE email=?";
        db.query(sql, [email], callback);
    },

    findById: (id, callback) => {
        const sql = "SELECT * FROM users WHERE id=?";
        db.query(sql, [id], callback);
    },

    updateProfile: (id, fullname, email, callback) => {
        const sql = `
            UPDATE users
            SET fullname = ?, email = ?
            WHERE id = ?
        `;
        db.query(sql, [fullname, email, id], callback);
    },

    updatePassword: (id, password, callback) => {
        const sql = `
            UPDATE users
            SET password = ?
            WHERE id = ?
        `;
        db.query(sql, [password, id], callback);
    }

};

module.exports = User;