const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "root",
    database: process.env.DB_NAME || "movie_recommender"
});

connection.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("✅ MySQL Connected");
    }
});

module.exports = connection;