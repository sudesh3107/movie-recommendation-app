const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const historyRoutes = require("./routes/historyRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");
dotenv.config();

const app = express();

require("./config/db");

// ================= Middleware =================

app.disable("x-powered-by");

app.use((req, res, next) => {
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "same-origin");
    next();
});

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
const profileRoutes = require("./routes/profileRoutes");

app.use("/", movieRoutes);
app.use("/api/auth", authRoutes);
app.use("/watchlist", watchlistRoutes);
app.use("/", userRoutes);
app.use("/reviews", reviewRoutes); // NEW
app.use("/profile", profileRoutes);
app.use("/history", historyRoutes);
app.use("/recommendations", recommendationRoutes);

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

const authMiddleware = require("./middleware/authMiddleware");
const requireAdmin = require("./middleware/requireAdmin");

app.get("/admin", authMiddleware, requireAdmin, (req, res) => {
    res.render("admin");
});

// ================= Server =================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`✅ Server Running on Port ${PORT}`);
});