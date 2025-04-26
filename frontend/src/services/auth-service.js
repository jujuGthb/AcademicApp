import api from "./api";

// Authentication service functions
const authService = {
  // Login user
  login: async (email, password) => {
    try {
      //console.log("Ok :::::", email, password);
      const response = await api.post("/auth/login", { email, password });
      //console.log(response);
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Login failed";
      return null;
    }
  },

  // Register user
  register: async (userData) => {
    try {
      const response = await api.post("/users", userData);
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Registration failed";
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem("token");
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await api.get("/auth/me");
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to get user data";
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    try {
      const response = await api.put("/users/profile", profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to update profile";
    }
  },

  // Change password
  changePassword: async (passwordData) => {
    try {
      const response = await api.put("/users/password", passwordData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to change password";
    }
  },
};

export default authService;
