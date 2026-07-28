const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "movie_recommender"
});

connection.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("✅ MySQL Connected");
    }
});

module.exports = connection;