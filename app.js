const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const historyRoutes = require("./routes/historyRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");
dotenv.config();

const app = express();

require("./config/db");

// ================= Middleware =================

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Current Logged-in User
const currentUser = require("./middleware/currentUser");
app.use(currentUser);

app.use((req, res, next) => {
    res.locals.user = res.locals.user || null;
    next();
});

// Static Files
app.use(express.static("public"));

// View Engine
app.set("view engine", "ejs");

// ================= Routes =================

const movieRoutes = require("./routes/movieRoutes");
const authRoutes = require("./routes/authRoutes");
const watchlistRoutes = require("./routes/watchlistRoutes");
const userRoutes = require("./routes/userRoutes");
const reviewRoutes = require("./routes/reviewRoutes"); // NEW

app.use("/", movieRoutes);
app.use("/api/auth", authRoutes);
app.use("/watchlist", watchlistRoutes);
app.use("/", userRoutes);
app.use("/reviews", reviewRoutes); // NEW

// ================= Pages =================

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.get("/movies", (req, res) => {
    res.render("movies");
});

app.get("/about", (req, res) => {
    res.render("about");
});

app.get("/contact", (req, res) => {
    res.render("contact");
});

app.get("/admin", (req, res) => {
    res.render("admin");
});
// profile
const profileRoutes = require("./routes/profileRoutes");

app.use("/profile", profileRoutes);
//
app.use("/history", historyRoutes);
//
app.use("/recommendations", recommendationRoutes);
// ================= Server =================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`✅ Server Running on Port ${PORT}`);
});