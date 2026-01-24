const ADMIN_EMAILS = [
  "madhumitha@gmail.com",
  "admin@gmail.com"
];

function getUserRole(email) {
  return ADMIN_EMAILS.includes(email) ? "admin" : "user";
}

module.exports = { getUserRole, ADMIN_EMAILS };
