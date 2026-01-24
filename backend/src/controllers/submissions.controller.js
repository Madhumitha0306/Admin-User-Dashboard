const db = require("../config/db");

exports.getAllSubmissions = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM submissions ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch {
    res.status(500).json({ message: "DB error" });
  }
};

exports.updateSubmissionStatus = async (req, res) => {
  const { id } = req.params;
  const { status, rejectionReason } = req.body;

  try {
    if (status === "rejected") {
      await db.query(
        "UPDATE submissions SET status=$1, rejection_reason=$2 WHERE id=$3",
        [status, rejectionReason || "", id]
      );
    } else {
      await db.query(
        "UPDATE submissions SET status=$1, rejection_reason=NULL WHERE id=$2",
        [status, id]
      );
    }
    res.json({ success: true });
  } catch {
    res.status(500).json({ message: "DB error" });
  }
};

exports.getUserSubmissions = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM submissions WHERE user_email=$1 ORDER BY created_at DESC",
      [req.user.email]
    );
    res.json(result.rows);
  } catch {
    res.status(500).json({ message: "DB error" });
  }
};

exports.getReport = async (req, res) => {
  const { date, month, year, status } = req.query;
  let where = [];
  let params = [];

  if (year) { where.push("EXTRACT(YEAR FROM created_at)=$1"); params.push(year); }
  if (month) { where.push(`EXTRACT(MONTH FROM created_at)=$${params.length+1}`); params.push(month); }
  if (date) { where.push(`EXTRACT(DAY FROM created_at)=$${params.length+1}`); params.push(date); }
  if (status && status !== "all") { where.push(`status=$${params.length+1}`); params.push(status); }

  const sql = `
    SELECT DATE(created_at) as date, COUNT(*) as count
    FROM submissions
    ${where.length ? "WHERE " + where.join(" AND ") : ""}
    GROUP BY DATE(created_at)
    ORDER BY DATE(created_at)
  `;

  try {
    const result = await db.query(sql, params);
    res.json(result.rows);
  } catch {
    res.status(500).json({ message: "DB error" });
  }
};

exports.exportReport = async (req, res) => {
  const { date, month, year, status } = req.query;
  let where = [];
  let params = [];

  if (year) { where.push("EXTRACT(YEAR FROM created_at)=$1"); params.push(year); }
  if (month) { where.push(`EXTRACT(MONTH FROM created_at)=$${params.length+1}`); params.push(month); }
  if (date) { where.push(`EXTRACT(DAY FROM created_at)=$${params.length+1}`); params.push(date); }
  if (status && status !== "all") { where.push(`status=$${params.length+1}`); params.push(status); }

  const sql = `
    SELECT * FROM submissions
    ${where.length ? "WHERE " + where.join(" AND ") : ""}
    ORDER BY created_at DESC
  `;

  try {
    const result = await db.query(sql, params);

    let csv = "id,user_email,status,created_at\n";
    result.rows.forEach(r => {
      csv += `${r.id},${r.user_email},${r.status},${r.created_at}\n`;
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=report.csv");
    res.send(csv);
  } catch {
    res.status(500).json({ message: "DB error" });
  }
};
