const express = require("express");
const router = express.Router();
const { handleOpenformWebhook } = require("../controllers/webhook.controller");

router.post("/openform", handleOpenformWebhook);

module.exports = router;
