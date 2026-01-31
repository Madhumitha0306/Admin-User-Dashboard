import api from "./api";

export const getCaptcha = async (email) => {
  const res = await api.post("/auth/captcha", { email });
  return res.data.captcha;
};

export const verifyCaptcha = async (email, captcha) => {
  await api.post("/auth/captcha-verify", { email, captcha });
};

export const sendOtp = async (email) => {
  await api.post("/auth/send-otp", { email });
};

export const verifyOtp = async (email, otp) => {
  await api.post("/auth/verify-otp", { email, otp });
};

export const login = async (email) => {
  const res = await api.post("/auth/login", { email });
  return res.data;
};
