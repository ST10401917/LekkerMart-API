const express = require("express");
// const https = require("https");
// const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const errorHandler = require("./middleware/errorMiddleware");

const app = express();

app.use(express.json());

// Test endpoint
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "LekkerMart API is running"
    });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Error handling
app.use(errorHandler);

// HTTPS certificate configuration
// const httpsOptions = {
//     key: fs.readFileSync(
//         path.join(__dirname, "certs", "server.key")
//     ),
//     cert: fs.readFileSync(
//         path.join(__dirname, "certs", "server.crt")
//     )
// };

const PORT = process.env.PORT || 7000;

// https.createServer(httpsOptions, app).listen(PORT, "0.0.0.0", () => {
//     console.log(`LekkerMart API running on port ${PORT}`);
//     console.log(`HTTPS: https://localhost:${PORT}`);

app.listen(PORT, "0.0.0.0", () => {
    console.log(`LekkerMart API running on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});