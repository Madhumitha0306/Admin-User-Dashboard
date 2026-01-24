import api from "./api";

export const login = async (email) => {
  const response = await api.post("/auth/login", { email });
  return response.data; // { token, role }
};
