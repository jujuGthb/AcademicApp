"use client";

import { useState, useEffect } from "react";
import applicationService from "../services/application-service";

export function useApplication() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserApplications();
  }, []);

  const fetchUserApplications = async () => {
    try {
      setLoading(true);
      const data = await applicationService.getUserApplications();
      setApplications(data);
      setError(null);
    } catch (err) {
      setError("Başvurular yüklenirken bir hata oluştu.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllApplications = async () => {
    try {
      setLoading(true);
      const data = await applicationService.getAllApplications();
      setApplications(data);
      setError(null);
    } catch (err) {
      setError("Başvurular yüklenirken bir hata oluştu.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchJuryApplications = async () => {
    try {
      setLoading(true);
      const data = await applicationService.getJuryApplications();
      setApplications(data);
      setError(null);
    } catch (err) {
      setError(
        "Değerlendirme bekleyen başvurular yüklenirken bir hata oluştu."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getApplicationById = async (id) => {
    try {
      setLoading(true);
      const data = await applicationService.getApplicationById(id);
      setError(null);
      return data;
    } catch (err) {
      setError("Başvuru detayları yüklenirken bir hata oluştu.");
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createApplication = async (applicationData) => {
    try {
      setLoading(true);
      const data = await applicationService.createApplication(applicationData);
      setApplications([...applications, data]);
      setError(null);
      return data;
    } catch (err) {
      setError("Başvuru oluşturulurken bir hata oluştu.");
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateApplication = async (id, applicationData) => {
    try {
      setLoading(true);
      const data = await applicationService.updateApplication(
        id,
        applicationData
      );
      setApplications(applications.map((app) => (app.id === id ? data : app)));
      setError(null);
      return data;
    } catch (err) {
      setError("Başvuru güncellenirken bir hata oluştu.");
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteApplication = async (id) => {
    try {
      setLoading(true);
      await applicationService.deleteApplication(id);
      setApplications(applications.filter((app) => app.id !== id));
      setError(null);
    } catch (err) {
      setError("Başvuru silinirken bir hata oluştu.");
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const submitEvaluation = async (applicationId, evaluationData) => {
    try {
      setLoading(true);
      const data = await applicationService.submitEvaluation(
        applicationId,
        evaluationData
      );
      setApplications(
        applications.map((app) =>
          app.id === applicationId
            ? { ...app, evaluationStatus: "completed" }
            : app
        )
      );
      setError(null);
      return data;
    } catch (err) {
      setError("Değerlendirme gönderilirken bir hata oluştu.");
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    applications,
    loading,
    error,
    fetchUserApplications,
    fetchAllApplications,
    fetchJuryApplications,
    getApplicationById,
    createApplication,
    updateApplication,
    deleteApplication,
    submitEvaluation,
  };
}
