import api from "./api";

// Criteria service functions
const criteriaService = {
  // Get all criteria
  getAllCriteria: async () => {
    try {
      const response = await api.get("/criteria");
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to fetch criteria";
    }
  },

  // Get criteria by parameters
  getCriteriaByParams: async (fieldArea, targetTitle, isFirstAppointment) => {
    try {
      const response = await api.get(
        `/criteria/${fieldArea}/${targetTitle}/${isFirstAppointment}`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to fetch criteria";
    }
  },

  // Check if report meets criteria
  checkCriteria: async (reportData) => {
    try {
      const response = await api.post("/criteria/check", reportData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to check criteria";
    }
  },
};

export default criteriaService;
