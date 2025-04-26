"use client";

import { useState, useEffect, useCallback } from "react";
import ActivityService from "../services/activity-service";

export const useActivities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchActivities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ActivityService.getActivities();
      setActivities(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch activities");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const fetchActivityById = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const data = await ActivityService.getActivityById(id);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch activity");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchActivitiesByCategory = async (category) => {
    try {
      setLoading(true);
      setError(null);
      const data = await ActivityService.getActivitiesByCategory(category);
      return data;
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch activities by category"
      );
      return [];
    } finally {
      setLoading(false);
    }
  };

  const createActivity = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      const newActivity = await ActivityService.createActivity(formData);
      setActivities([newActivity, ...activities]);
      return newActivity;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create activity");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateActivity = async (id, formData) => {
    try {
      setLoading(true);
      setError(null);
      const updatedActivity = await ActivityService.updateActivity(
        id,
        formData
      );
      setActivities(
        activities.map((activity) =>
          activity._id === id ? updatedActivity : activity
        )
      );
      return updatedActivity;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update activity");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteActivity = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await ActivityService.deleteActivity(id);
      setActivities(activities.filter((activity) => activity._id !== id));
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete activity");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getActivityStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const stats = await ActivityService.getActivityStats();
      return stats;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to get activity stats");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    activities,
    loading,
    error,
    fetchActivities,
    fetchActivityById,
    fetchActivitiesByCategory,
    createActivity,
    updateActivity,
    deleteActivity,
    getActivityStats,
  };
};
