import apiClient from "./client";

/**
 * Login user
 */
export const login = async (loginData) => {
  const response = await apiClient.post("/auth/login", loginData);

  return response.data;
};

/**
 * Signup user
 */
export const signup = async (signupData) => {
  const response = await apiClient.post("/auth/signup", signupData);

  return response.data;
};

/**
 * Get current logged-in user
 */
export const getCurrentUser = async () => {
  const response = await apiClient.get("/auth/me");

  return response.data;
};
