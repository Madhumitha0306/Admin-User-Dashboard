const db = require("../config/db");

exports.handleOpenformWebhook = async (req, res) => {
  const payload = req.body;

  console.log("Webhook received:");
  console.log(JSON.stringify(payload, null, 2));

  const formId = payload.form_slug || "unknown_form";

  let userEmail = "anonymous";
  if (payload.data) {
    for (const field of Object.values(payload.data)) {
      if (field?.name && field.name.toLowerCase() === "email") {
        userEmail = field.value;
        break;
      }
    }
  }

  try {
    await db.query(
      `
      INSERT INTO submissions
      (form_id, user_email, data, status)
      VALUES ($1, $2, $3, 'pending')
      `,
      [formId, userEmail, JSON.stringify(payload)]

    );

    console.log("Submission stored with email:", userEmail);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("DB insert error:", err);
    res.status(500).json({ message: "DB error" });
  }
};
