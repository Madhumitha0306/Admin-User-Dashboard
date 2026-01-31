const crypto = require("crypto");

const store = new Map();

exports.createOtp = (email) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hash = crypto.createHash("sha256").update(otp).digest("hex");

  store.set(email, {
    hash,
    expires: Date.now() + 5 * 60 * 1000
  });

  return otp;
};

exports.verifyOtp = (email, otp) => {
  const record = store.get(email);
  if (!record) return false;
  if (Date.now() > record.expires) return false;

  const hash = crypto.createHash("sha256").update(otp).digest("hex");
  const valid = hash === record.hash;

  if (valid) store.delete(email);
  return valid;
};
