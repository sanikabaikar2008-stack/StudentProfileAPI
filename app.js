const profileRoutes = require("./routes/profileRoutes");

const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();

connectDB();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api", profileRoutes);

app.listen(5000, () => {
  console.log("Server Running on Port 5000");
});