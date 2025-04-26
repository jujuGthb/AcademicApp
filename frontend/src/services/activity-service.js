import api from "./api";

const ActivityService = {
  getActivities: async () => {
    const response = await api.get("/activities");
    return response.data;
  },

  getActivityById: async (id) => {
    const response = await api.get(`/activities/${id}`);
    return response.data;
  },

  getActivitiesByCategory: async (category) => {
    const response = await api.get(`/activities/category/${category}`);
    return response.data;
  },

  createActivity: async (formData) => {
    const response = await api.post("/activities", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  updateActivity: async (id, formData) => {
    const response = await api.put(`/activities/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  deleteActivity: async (id) => {
    const response = await api.delete(`/activities/${id}`);
    return response.data;
  },

  getActivityStats: async () => {
    const response = await api.get("/activities/stats/summary");
    return response.data;
  },
};

export default ActivityService;
