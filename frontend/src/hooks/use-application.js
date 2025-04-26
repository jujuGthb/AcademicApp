"use client";

import { useState, useEffect, useCallback } from "react";
import ApplicationService from "../services/application-service";

export const useApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ApplicationService.getApplicationsByCandidate();
      setApplications(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const fetchApplicationById = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const data = await ApplicationService.getApplicationById(id);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch application");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createApplication = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      const newApplication = await ApplicationService.createApplication(
        formData
      );
      setApplications([newApplication, ...applications]);
      return newApplication;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create application");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const addDocumentToApplication = async (id, formData) => {
    try {
      setLoading(true);
      setError(null);
      const updatedApplication =
        await ApplicationService.addDocumentToApplication(id, formData);
      setApplications(
        applications.map((app) => (app._id === id ? updatedApplication : app))
      );
      return updatedApplication;
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to add document to application"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  const removeDocumentFromApplication = async (applicationId, documentId) => {
    try {
      setLoading(true);
      setError(null);
      const updatedApplication =
        await ApplicationService.removeDocumentFromApplication(
          applicationId,
          documentId
        );
      setApplications(
        applications.map((app) =>
          app._id === applicationId ? updatedApplication : app
        )
      );
      return updatedApplication;
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to remove document from application"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteApplication = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await ApplicationService.deleteApplication(id);
      setApplications(applications.filter((app) => app._id !== id));
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete application");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    applications,
    loading,
    error,
    fetchApplications,
    fetchApplicationById,
    createApplication,
    addDocumentToApplication,
    removeDocumentFromApplication,
    deleteApplication,
  };
};
