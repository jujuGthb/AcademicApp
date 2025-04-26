import api from "./api";

const JobPostingService = {
  getAllJobPostings: async () => {
    const response = await api.get("/job-postings");
    return response.data;
  },

  getJobPostingsByStatus: async (status) => {
    const response = await api.get(`/job-postings/status/${status}`);
    return response.data;
  },

  getJobPostingById: async (id) => {
    const response = await api.get(`/job-postings/${id}`);
    return response.data;
  },

  createJobPosting: async (data) => {
    const response = await api.post("/job-postings", data);
    return response.data;
  },

  updateJobPosting: async (id, data) => {
    const response = await api.put(`/job-postings/${id}`, data);
    return response.data;
  },

  deleteJobPosting: async (id) => {
    const response = await api.delete(`/job-postings/${id}`);
    return response.data;
  },
};

export default JobPostingService;
