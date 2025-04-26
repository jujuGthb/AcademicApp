"use client";

import { useState, useEffect, useCallback } from "react";
import ReportService from "../services/report-service";

export const useReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ReportService.getReports();
      setReports(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const fetchReportById = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const data = await ReportService.getReportById(id);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch report");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createReport = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      const newReport = await ReportService.createReport(formData);
      setReports([newReport, ...reports]);
      return newReport;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create report");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateReportStatus = async (id, status, reviewNotes) => {
    try {
      setLoading(true);
      setError(null);
      const updatedReport = await ReportService.updateReportStatus(
        id,
        status,
        reviewNotes
      );
      setReports(
        reports.map((report) => (report._id === id ? updatedReport : report))
      );
      return updatedReport;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update report status");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteReport = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await ReportService.deleteReport(id);
      setReports(reports.filter((report) => report._id !== id));
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete report");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const checkReportCriteria = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const result = await ReportService.checkReportCriteria(id);
      return result;
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to check report criteria"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    reports,
    loading,
    error,
    fetchReports,
    fetchReportById,
    createReport,
    updateReportStatus,
    deleteReport,
    checkReportCriteria,
  };
};
