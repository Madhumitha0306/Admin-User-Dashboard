const express = require("express");
const router = express.Router();
const db = require("../config/db");
const {
  getAllSubmissions,
  updateSubmissionStatus,
  getUserSubmissions,
  getReport,
  exportReport
} = require("../controllers/submissions.controller");

const { verifyToken } = require("../middlewares/auth.middleware");

router.get("/", getAllSubmissions);
router.patch("/:id/status", updateSubmissionStatus);
router.get("/me", verifyToken, getUserSubmissions);

// ✅ FIXED: SQLite -> PostgreSQL
router.get("/pending/count", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT COUNT(*) AS count FROM submissions WHERE status = $1",
      ["pending"]
    );

    res.json({ count: Number(result.rows[0].count) });
  } catch (err) {
    console.error("Pending count error:", err);
    res.status(500).json({ message: "DB error" });
  }
});

router.get("/report", getReport);
router.get("/report/export", exportReport);

module.exports = router;
