import api from "./api";

// Report service functions
const reportService = {
  // Get all reports
  getReports: async () => {
    try {
      const response = await api.get("/reports");
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to fetch reports";
    }
  },

  // Get report by ID
  getReportById: async (id) => {
    try {
      const response = await api.get(`/reports/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to fetch report";
    }
  },

  // Create report
  createReport: async (formData) => {
    try {
      const response = await api.post("/reports", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to create report";
    }
  },

  // Update report status
  updateReportStatus: async (id, statusData) => {
    try {
      const response = await api.put(`/reports/${id}/status`, statusData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to update report status";
    }
  },

  // Add attachments to report
  addAttachmentsToReport: async (id, formData) => {
    try {
      const response = await api.put(`/reports/${id}/attachments`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to add attachments";
    }
  },

  // Remove attachment from report
  removeAttachmentFromReport: async (reportId, attachmentId) => {
    try {
      const response = await api.delete(
        `/reports/${reportId}/attachments/${attachmentId}`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to remove attachment";
    }
  },

  // Delete report
  deleteReport: async (id) => {
    try {
      const response = await api.delete(`/reports/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to delete report";
    }
  },

  // Get report activities
  getReportActivities: async (id) => {
    try {
      const response = await api.get(`/reports/${id}/activities`);
      return response.data;
    } catch (error) {
      throw (
        error.response?.data?.message || "Failed to fetch report activities"
      );
    }
  },

  // Check report criteria
  checkReportCriteria: async (id) => {
    try {
      const response = await api.get(`/reports/${id}/check-criteria`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to check report criteria";
    }
  },
};

export default reportService;
