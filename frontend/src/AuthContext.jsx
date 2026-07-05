import { createContext, useContext, useEffect, useState } from "react";

import { login, signup, getCurrentUser } from "./api/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Login User
  const loginUser = async (loginData) => {
    const response = await login(loginData);

    localStorage.setItem("token", response.access_token);

    const currentUser = await getCurrentUser();

    setUser(currentUser);

    return currentUser;
  };

  // Signup User
  const signupUser = async (signupData) => {
    const response = await signup(signupData);

    return response;
  };

  // Logout User
  const logoutUser = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  // Restore Session
  const loadUser = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const currentUser = await getCurrentUser();

      setUser(currentUser);
    } catch (error) {
      console.error("Authentication Error:", error);

      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginUser,
        signupUser,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
