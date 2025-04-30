"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminStyles.css";

const CriteriaManagement = () => {
  const [criteria, setCriteria] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    fieldArea: "",
    targetTitle: "",
    isFirstAppointment: true,
    minimumRequirements: {
      totalPoints: 0,
      categoryPoints: {
        A: 0,
        B: 0,
        C: 0,
        D: 0,
        E: 0,
        F: 0,
        G: 0,
        H: 0,
        I: 0,
        J: 0,
        K: 0,
        L: 0,
      },
      activityCounts: {
        publications: 0,
        mainAuthor: 0,
        projects: 0,
        theses: 0,
        sciPublications: 0,
        internationalPublications: 0,
        nationalPublications: 0,
        personalExhibitions: 0,
        groupExhibitions: 0,
      },
    },
    maximumLimits: {
      categoryPoints: {
        D: 1500,
        E: 50,
        K: 50,
      },
    },
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [activeTab, setActiveTab] = useState("general");
  const navigate = useNavigate();

  const fieldAreas = [
    "Sağlık Bilimleri",
    "Fen Bilimleri ve Matematik",
    "Mühendislik",
    "Ziraat, Orman ve Su Ürünleri",
    "Eğitim Bilimleri",
    "Filoloji",
    "Mimarlık, Planlama ve Tasarım",
    "Sosyal, Beşeri ve İdari Bilimler",
    "Spor Bilimleri",
    "Hukuk",
    "İlahiyat",
    "Güzel Sanatlar",
  ];

  const academicTitles = ["Dr. Öğretim Üyesi", "Doçent", "Profesör"];

  // Fetch all criteria
  useEffect(() => {
    //fetchCriteria();
  }, []);

  const fetchCriteria = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/criteria", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch criteria");
      }

      const data = await response.json();
      setCriteria(data);
      setError(null);
    } catch (err) {
      setError("Error fetching criteria: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes(".")) {
      // Handle nested properties
      const parts = name.split(".");
      if (parts.length === 3) {
        // For categoryPoints and activityCounts
        setFormData({
          ...formData,
          [parts[0]]: {
            ...formData[parts[0]],
            [parts[1]]: {
              ...formData[parts[0]][parts[1]],
              [parts[2]]: type === "number" ? Number(value) : value,
            },
          },
        });
      } else if (parts.length === 4) {
        // For maximumLimits.categoryPoints
        setFormData({
          ...formData,
          [parts[0]]: {
            ...formData[parts[0]],
            [parts[1]]: {
              ...formData[parts[0]][parts[1]],
              [parts[2]]: {
                ...formData[parts[0]][parts[1]][parts[2]],
                [parts[3]]: type === "number" ? Number(value) : value,
              },
            },
          },
        });
      }
    } else {
      // Handle top-level properties
      setFormData({
        ...formData,
        [name]:
          type === "checkbox"
            ? checked
            : type === "number"
            ? Number(value)
            : value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const url = isEditing
        ? `http://localhost:5000/api/criteria/${currentId}`
        : "http://localhost:5000/api/criteria";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save criteria");
      }

      // Reset form and refresh criteria
      resetForm();
      fetchCriteria();
    } catch (err) {
      setError("Error saving criteria: " + err.message);
      console.error(err);
    }
  };

  const handleEdit = (criteriaItem) => {
    setFormData({
      fieldArea: criteriaItem.fieldArea,
      targetTitle: criteriaItem.targetTitle,
      isFirstAppointment: criteriaItem.isFirstAppointment,
      minimumRequirements: {
        totalPoints: criteriaItem.minimumRequirements.totalPoints,
        categoryPoints: {
          A: criteriaItem.minimumRequirements.categoryPoints.A,
          B: criteriaItem.minimumRequirements.categoryPoints.B,
          C: criteriaItem.minimumRequirements.categoryPoints.C,
          D: criteriaItem.minimumRequirements.categoryPoints.D,
          E: criteriaItem.minimumRequirements.categoryPoints.E,
          F: criteriaItem.minimumRequirements.categoryPoints.F,
          G: criteriaItem.minimumRequirements.categoryPoints.G,
          H: criteriaItem.minimumRequirements.categoryPoints.H,
          I: criteriaItem.minimumRequirements.categoryPoints.I,
          J: criteriaItem.minimumRequirements.categoryPoints.J,
          K: criteriaItem.minimumRequirements.categoryPoints.K,
          L: criteriaItem.minimumRequirements.categoryPoints.L,
        },
        activityCounts: {
          publications:
            criteriaItem.minimumRequirements.activityCounts.publications,
          mainAuthor:
            criteriaItem.minimumRequirements.activityCounts.mainAuthor,
          projects: criteriaItem.minimumRequirements.activityCounts.projects,
          theses: criteriaItem.minimumRequirements.activityCounts.theses,
          sciPublications:
            criteriaItem.minimumRequirements.activityCounts.sciPublications,
          internationalPublications:
            criteriaItem.minimumRequirements.activityCounts
              .internationalPublications,
          nationalPublications:
            criteriaItem.minimumRequirements.activityCounts
              .nationalPublications,
          personalExhibitions:
            criteriaItem.minimumRequirements.activityCounts.personalExhibitions,
          groupExhibitions:
            criteriaItem.minimumRequirements.activityCounts.groupExhibitions,
        },
      },
      maximumLimits: {
        categoryPoints: {
          D: criteriaItem.maximumLimits.categoryPoints.D,
          E: criteriaItem.maximumLimits.categoryPoints.E,
          K: criteriaItem.maximumLimits.categoryPoints.K,
        },
      },
    });
    setIsEditing(true);
    setCurrentId(criteriaItem._id);
    setActiveTab("general");
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this criteria?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/criteria/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete criteria");
      }

      // Refresh criteria
      fetchCriteria();
    } catch (err) {
      setError("Error deleting criteria: " + err.message);
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormData({
      fieldArea: "",
      targetTitle: "",
      isFirstAppointment: true,
      minimumRequirements: {
        totalPoints: 0,
        categoryPoints: {
          A: 0,
          B: 0,
          C: 0,
          D: 0,
          E: 0,
          F: 0,
          G: 0,
          H: 0,
          I: 0,
          J: 0,
          K: 0,
          L: 0,
        },
        activityCounts: {
          publications: 0,
          mainAuthor: 0,
          projects: 0,
          theses: 0,
          sciPublications: 0,
          internationalPublications: 0,
          nationalPublications: 0,
          personalExhibitions: 0,
          groupExhibitions: 0,
        },
      },
      maximumLimits: {
        categoryPoints: {
          D: 1500,
          E: 50,
          K: 50,
        },
      },
    });
    setIsEditing(false);
    setCurrentId(null);
    setActiveTab("general");
  };

  return (
    <div className="admin-container">
      <h1 className="admin-title">Academic Criteria Management</h1>
      {error && <div className="error-message">{error}</div>}

      <div className="admin-form-container">
        <h2>{isEditing ? "Edit Criteria" : "Create New Criteria"}</h2>

        <div className="form-tabs">
          <button
            className={`form-tab ${activeTab === "general" ? "active" : ""}`}
            onClick={() => setActiveTab("general")}
          >
            General
          </button>
          <button
            className={`form-tab ${
              activeTab === "categoryPoints" ? "active" : ""
            }`}
            onClick={() => setActiveTab("categoryPoints")}
          >
            Category Points
          </button>
          <button
            className={`form-tab ${
              activeTab === "activityCounts" ? "active" : ""
            }`}
            onClick={() => setActiveTab("activityCounts")}
          >
            Activity Counts
          </button>
          <button
            className={`form-tab ${
              activeTab === "maximumLimits" ? "active" : ""
            }`}
            onClick={() => setActiveTab("maximumLimits")}
          >
            Maximum Limits
          </button>
        </div>

        <form onSubmit={handleSubmit} className="admin-form">
          {/* General Tab */}
          <div
            className={`form-tab-content ${
              activeTab === "general" ? "active" : ""
            }`}
          >
            <div className="form-group">
              <label htmlFor="fieldArea">Field Area</label>
              <select
                id="fieldArea"
                name="fieldArea"
                value={formData.fieldArea}
                onChange={handleChange}
                required
              >
                <option value="">Select Field Area</option>
                {fieldAreas.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="targetTitle">Target Title</label>
              <select
                id="targetTitle"
                name="targetTitle"
                value={formData.targetTitle}
                onChange={handleChange}
                required
              >
                <option value="">Select Target Title</option>
                {academicTitles.map((title) => (
                  <option key={title} value={title}>
                    {title}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                id="isFirstAppointment"
                name="isFirstAppointment"
                checked={formData.isFirstAppointment}
                onChange={handleChange}
              />
              <label htmlFor="isFirstAppointment">First Appointment</label>
            </div>

            <div className="form-group">
              <label htmlFor="minimumRequirements.totalPoints">
                Total Points Required
              </label>
              <input
                type="number"
                id="minimumRequirements.totalPoints"
                name="minimumRequirements.totalPoints"
                value={formData.minimumRequirements.totalPoints}
                onChange={handleChange}
                required
                min="0"
              />
            </div>
          </div>

          {/* Category Points Tab */}
          <div
            className={`form-tab-content ${
              activeTab === "categoryPoints" ? "active" : ""
            }`}
          >
            <h3>Minimum Category Points</h3>
            <div className="form-grid">
              {Object.keys(formData.minimumRequirements.categoryPoints).map(
                (category) => (
                  <div className="form-group" key={category}>
                    <label
                      htmlFor={`minimumRequirements.categoryPoints.${category}`}
                    >
                      Category {category}
                    </label>
                    <input
                      type="number"
                      id={`minimumRequirements.categoryPoints.${category}`}
                      name={`minimumRequirements.categoryPoints.${category}`}
                      value={
                        formData.minimumRequirements.categoryPoints[category]
                      }
                      onChange={handleChange}
                      min="0"
                    />
                  </div>
                )
              )}
            </div>
          </div>

          {/* Activity Counts Tab */}
          <div
            className={`form-tab-content ${
              activeTab === "activityCounts" ? "active" : ""
            }`}
          >
            <h3>Minimum Activity Counts</h3>
            <div className="form-grid">
              {Object.keys(formData.minimumRequirements.activityCounts).map(
                (activity) => (
                  <div className="form-group" key={activity}>
                    <label
                      htmlFor={`minimumRequirements.activityCounts.${activity}`}
                    >
                      {activity.charAt(0).toUpperCase() +
                        activity.slice(1).replace(/([A-Z])/g, " $1")}
                    </label>
                    <input
                      type="number"
                      id={`minimumRequirements.activityCounts.${activity}`}
                      name={`minimumRequirements.activityCounts.${activity}`}
                      value={
                        formData.minimumRequirements.activityCounts[activity]
                      }
                      onChange={handleChange}
                      min="0"
                    />
                  </div>
                )
              )}
            </div>
          </div>

          {/* Maximum Limits Tab */}
          <div
            className={`form-tab-content ${
              activeTab === "maximumLimits" ? "active" : ""
            }`}
          >
            <h3>Maximum Category Limits</h3>
            <div className="form-grid">
              {Object.keys(formData.maximumLimits.categoryPoints).map(
                (category) => (
                  <div className="form-group" key={category}>
                    <label htmlFor={`maximumLimits.categoryPoints.${category}`}>
                      Category {category} Max
                    </label>
                    <input
                      type="number"
                      id={`maximumLimits.categoryPoints.${category}`}
                      name={`maximumLimits.categoryPoints.${category}`}
                      value={formData.maximumLimits.categoryPoints[category]}
                      onChange={handleChange}
                      min="0"
                    />
                  </div>
                )
              )}
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {isEditing ? "Update" : "Create"} Criteria
            </button>
            {isEditing && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="admin-list-container">
        <h2>Academic Criteria</h2>
        {loading ? (
          <div className="loading">Loading criteria...</div>
        ) : criteria.length === 0 ? (
          <div className="empty-message">No criteria found.</div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Field Area</th>
                  <th>Target Title</th>
                  <th>First Appointment</th>
                  <th>Total Points</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {criteria.map((item) => (
                  <tr key={item._id}>
                    <td>{item.fieldArea}</td>
                    <td>{item.targetTitle}</td>
                    <td>{item.isFirstAppointment ? "Yes" : "No"}</td>
                    <td>{item.minimumRequirements.totalPoints}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-icon"
                          onClick={() => handleEdit(item)}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          className="btn-icon"
                          onClick={() => handleDelete(item._id)}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CriteriaManagement;
