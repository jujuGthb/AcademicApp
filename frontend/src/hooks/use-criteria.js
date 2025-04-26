"use client";

import { useState, useEffect, useCallback } from "react";
import CriteriaService from "../services/criteria-service";

export const useCriteria = () => {
  const [criteria, setCriteria] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllCriteria = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await CriteriaService.getAllCriteria();
      setCriteria(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch criteria");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllCriteria();
  }, [fetchAllCriteria]);

  const fetchCriteriaByParams = async (
    fieldArea,
    targetTitle,
    isFirstAppointment
  ) => {
    try {
      setLoading(true);
      setError(null);
      const data = await CriteriaService.getCriteriaByParams(
        fieldArea,
        targetTitle,
        isFirstAppointment
      );
      return data;
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch criteria by parameters"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  const checkCriteria = async (data) => {
    try {
      setLoading(true);
      setError(null);
      const result = await CriteriaService.checkCriteria(data);
      return result;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to check criteria");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    criteria,
    loading,
    error,
    fetchAllCriteria,
    fetchCriteriaByParams,
    checkCriteria,
  };
};

export default useCriteria;
