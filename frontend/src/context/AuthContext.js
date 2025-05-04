"use client";

import { createContext, useState, useEffect } from "react";
import { server } from "../components/remote/server";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);

  const login = async (tcNumber, password) => {
    try {
      // console.log(tcNumber);
      setError(null);
      const response = await fetch(`${server}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tcNumber, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }
      console.log(data);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setUser(data.user);
      setToken(data.token);
      setIsAuthenticated(true);
      return data;
    } catch (err) {
      setError(err.message);
      console.log(err);
      return null;
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const response = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      //)localStorage.setItem("token", data.token);

      // Get user data
      /*const userResponse = await fetch(
        "http://localhost:5000/api/users/verify",
        {
          headers: {
            "x-auth-token": data.token,
          },
        }
      );

      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUser(userData);
        setIsAuthenticated(true);
        return userData;
      } else {
        throw new Error("Failed to get user data");
      }*/
     return await login(userData.tcNumber, userData.password)
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        setIsAuthenticated,
        loading,
        error,
        token,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
