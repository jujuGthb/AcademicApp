"use client";

import { useState, useEffect, useCallback } from "react";
import JobPostingService from "../services/job-posting-service";

export const useJobPostings = () => {
  const [jobPostings, setJobPostings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchJobPostings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await JobPostingService.getAllJobPostings();
      setJobPostings(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch job postings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobPostings();
  }, [fetchJobPostings]);

  const fetchJobPostingsByStatus = async (status) => {
    try {
      setLoading(true);
      setError(null);
      const data = await JobPostingService.getJobPostingsByStatus(status);
      return data;
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch job postings by status"
      );
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchJobPostingById = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const data = await JobPostingService.getJobPostingById(id);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch job posting");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    jobPostings,
    loading,
    error,
    fetchJobPostings,
    fetchJobPostingsByStatus,
    fetchJobPostingById,
  };
};
