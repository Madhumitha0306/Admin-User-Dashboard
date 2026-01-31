const store = new Map();

const generateCaptcha = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

exports.createCaptcha = (email) => {
  const captcha = generateCaptcha();
  store.set(email, captcha);
  return captcha;
};

exports.verifyCaptcha = (email, input) => {
  const real = store.get(email);
  if (!real) return false;

  const valid = real === input.toUpperCase();
  if (valid) store.delete(email);
  return valid;
};
