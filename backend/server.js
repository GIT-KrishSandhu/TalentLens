const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes (we'll fill these in next parts)
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/candidates", require("./routes/candidateRoutes"));
app.use("/api/match", require("./routes/matchRoutes"));
app.use("/api/ai", require("./routes/aiRoutes"));

app.get("/", (req, res) => res.send("🚀 API is running..."));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🟢 Server running on port ${PORT}`));