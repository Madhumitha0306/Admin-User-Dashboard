const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const webhookRoutes = require("./routes/webhook.routes");
const submissionsRoutes = require("./routes/submissions.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/webhook", webhookRoutes);
app.use("/api/submissions", submissionsRoutes);

app.get("/", (req, res) => {
  res.send("Backend running ");
});

module.exports = app;
