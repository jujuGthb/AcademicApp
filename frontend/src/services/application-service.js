import api from "./api"

// Application service functions
const applicationService = {
  // Get applications by candidate
  getApplicationsByCandidate: async () => {
    try {
      const response = await api.get("/applications/candidate")
      return response.data
    } catch (error) {
      throw error.response?.data?.message || "Failed to fetch applications"
    }
  },

  // Get application by ID
  getApplicationById: async (id) => {
    try {
      const response = await api.get(`/applications/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data?.message || "Failed to fetch application"
    }
  },

  // Create application
  createApplication: async (formData) => {
    try {
      const response = await api.post("/applications", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      return response.data
    } catch (error) {
      throw error.response?.data?.message || "Failed to create application"
    }
  },

  // Add document to application
  addDocumentToApplication: async (id, formData) => {
    try {
      const response = await api.put(`/applications/${id}/documents`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      return response.data
    } catch (error) {
      throw error.response?.data?.message || "Failed to add document"
    }
  },

  // Remove document from application
  removeDocumentFromApplication: async (applicationId, documentId) => {
    try {
      const response = await api.delete(`/applications/${applicationId}/documents/${documentId}`)
      return response.data
    } catch (error) {
      throw error.response?.data?.message || "Failed to remove document"
    }
  },

  // Delete application
  deleteApplication: async (id) => {
    try {
      const response = await api.delete(`/applications/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data?.message || "Failed to delete application"
    }
  },
}

export default applicationService
