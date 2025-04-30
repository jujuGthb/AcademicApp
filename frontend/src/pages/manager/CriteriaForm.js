import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./ManagerStyles.css";

const CriteriaForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: "",
    fieldArea: "",
    targetTitle: "Dr. Öğretim Üyesi",
    isFirstAppointment: true,
    description: "",
    minimumRequirements: {
      publicationCount: {
        A1A2: 0,
        A1A4: 0,
        A1A5: 0,
        A1A6: 0,
        total: 0,
      },
      mainAuthorCount: 0,
      projectCount: 0,
      thesisSupervisionCount: {
        phd: 0,
        masters: 0,
      },
      minimumPoints: {
        A1A4: 0,
        A1A5: 0,
        A1A6: 0,
        total: 0,
      },
      exhibitionsCount: {
        personal: 0,
        group: 0,
      },
      patentCount: 0,
    },
    specialRequirements: {
      description: "",
      requiredPublications: "",
      additionalNotes: "",
    },
    isActive: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    if (isEditMode) {
      const fetchCriteria = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`/api/criteria/${id}`);
          setFormData(response.data);
          setLoading(false);
        } catch (err) {
          console.error("Error fetching criteria:", err);
          setError("Failed to load criteria. Please try again.");
          setLoading(false);
        }
      };

      fetchCriteria();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleNestedChange = (category, field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [category]: {
        ...prevData[category],
        [field]: value,
      },
    }));
  };

  const handleDeepNestedChange = (category, subcategory, field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [category]: {
        ...prevData[category],
        [subcategory]: {
          ...prevData[category][subcategory],
          [field]: value,
        },
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (isEditMode) {
        await axios.put(`/api/criteria/${id}`, formData);
      } else {
        await axios.post("/api/criteria", formData);
      }
      setLoading(false);
      navigate("/manager/dashboard");
    } catch (err) {
      console.error("Error saving criteria:", err);
      setError("Failed to save criteria. Please try again.");
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
    return <div className="loading">Loading criteria data...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="criteria-form-container">
      <div className="form-header">
        <h2>{isEditMode ? "Edit Criteria" : "Create New Criteria"}</h2>
        <button
          className="btn-back"
          onClick={() => navigate("/manager/dashboard")}
        >
          Back to Dashboard
        </button>
      </div>

      <div className="form-tabs">
        <button
          className={`tab-button ${activeTab === "general" ? "active" : ""}`}
          onClick={() => setActiveTab("general")}
        >
          General Information
        </button>
        <button
          className={`tab-button ${
            activeTab === "requirements" ? "active" : ""
          }`}
          onClick={() => setActiveTab("requirements")}
        >
          Minimum Requirements
        </button>
        <button
          className={`tab-button ${activeTab === "special" ? "active" : ""}`}
          onClick={() => setActiveTab("special")}
        >
          Special Requirements
        </button>
      </div>

      <form onSubmit={handleSubmit} className="criteria-form">
        {activeTab === "general" && (
          <div className="form-section">
            <div className="form-group">
              <label htmlFor="title">Criteria Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

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
                <option value="Sağlık Bilimleri">Sağlık Bilimleri</option>
                <option value="Fen Bilimleri ve Matematik">
                  Fen Bilimleri ve Matematik
                </option>
                <option value="Mühendislik">Mühendislik</option>
                <option value="Ziraat, Orman ve Su Ürünleri">
                  Ziraat, Orman ve Su Ürünleri
                </option>
                <option value="Eğitim Bilimleri">Eğitim Bilimleri</option>
                <option value="Filoloji">Filoloji</option>
                <option value="Mimarlık, Planlama ve Tasarım">
                  Mimarlık, Planlama ve Tasarım
                </option>
                <option value="Sosyal, Beşeri ve İdari Bilimler">
                  Sosyal, Beşeri ve İdari Bilimler
                </option>
                <option value="Spor Bilimleri">Spor Bilimleri</option>
                <option value="Hukuk">Hukuk</option>
                <option value="İlahiyat">İlahiyat</option>
                <option value="Güzel Sanatlar">Güzel Sanatlar</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="targetTitle">Target Academic Title</label>
              <select
                id="targetTitle"
                name="targetTitle"
                value={formData.targetTitle}
                onChange={handleChange}
                required
              >
                <option value="Dr. Öğretim Üyesi">Dr. Öğretim Üyesi</option>
                <option value="Doçent">Doçent</option>
                <option value="Profesör">Profesör</option>
              </select>
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="isFirstAppointment"
                  checked={formData.isFirstAppointment}
                  onChange={handleChange}
                />
                First Appointment
              </label>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                required
              ></textarea>
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                />
                Active
              </label>
            </div>
          </div>
        )}

        {activeTab === "requirements" && (
          <div className="form-section">
            <h3>Publication Requirements</h3>
            <div className="form-row">
              <div className="form-group">
                <label>A1-A2 Publications (Q1-Q2)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.minimumRequirements.publicationCount.A1A2}
                  onChange={(e) =>
                    handleDeepNestedChange(
                      "minimumRequirements",
                      "publicationCount",
                      "A1A2",
                      parseInt(e.target.value) || 0
                    )
                  }
                />
              </div>
              <div className="form-group">
                <label>A1-A4 Publications (All SCI/SSCI/AHCI)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.minimumRequirements.publicationCount.A1A4}
                  onChange={(e) =>
                    handleDeepNestedChange(
                      "minimumRequirements",
                      "publicationCount",
                      "A1A4",
                      parseInt(e.target.value) || 0
                    )
                  }
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>A1-A5 Publications (Including ESCI)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.minimumRequirements.publicationCount.A1A5}
                  onChange={(e) =>
                    handleDeepNestedChange(
                      "minimumRequirements",
                      "publicationCount",
                      "A1A5",
                      parseInt(e.target.value) || 0
                    )
                  }
                />
              </div>
              <div className="form-group">
                <label>A1-A6 Publications (Including Scopus)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.minimumRequirements.publicationCount.A1A6}
                  onChange={(e) =>
                    handleDeepNestedChange(
                      "minimumRequirements",
                      "publicationCount",
                      "A1A6",
                      parseInt(e.target.value) || 0
                    )
                  }
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Total Publications</label>
                <input
                  type="number"
                  min="0"
                  value={formData.minimumRequirements.publicationCount.total}
                  onChange={(e) =>
                    handleDeepNestedChange(
                      "minimumRequirements",
                      "publicationCount",
                      "total",
                      parseInt(e.target.value) || 0
                    )
                  }
                />
              </div>
              <div className="form-group">
                <label>Main Author Count</label>
                <input
                  type="number"
                  min="0"
                  value={formData.minimumRequirements.mainAuthorCount}
                  onChange={(e) =>
                    handleNestedChange(
                      "minimumRequirements",
                      "mainAuthorCount",
                      parseInt(e.target.value) || 0
                    )
                  }
                />
              </div>
            </div>

            <h3>Project and Thesis Requirements</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Minimum Project Count</label>
                <input
                  type="number"
                  min="0"
                  value={formData.minimumRequirements.projectCount}
                  onChange={(e) =>
                    handleNestedChange(
                      "minimumRequirements",
                      "projectCount",
                      parseInt(e.target.value) || 0
                    )
                  }
                />
              </div>
              <div className="form-group">
                <label>PhD Thesis Supervision</label>
                <input
                  type="number"
                  min="0"
                  value={
                    formData.minimumRequirements.thesisSupervisionCount.phd
                  }
                  onChange={(e) =>
                    handleDeepNestedChange(
                      "minimumRequirements",
                      "thesisSupervisionCount",
                      "phd",
                      parseInt(e.target.value) || 0
                    )
                  }
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Masters Thesis Supervision</label>
                <input
                  type="number"
                  min="0"
                  value={
                    formData.minimumRequirements.thesisSupervisionCount.masters
                  }
                  onChange={(e) =>
                    handleDeepNestedChange(
                      "minimumRequirements",
                      "thesisSupervisionCount",
                      "masters",
                      parseInt(e.target.value) || 0
                    )
                  }
                />
              </div>
              <div className="form-group">
                <label>Patent Count</label>
                <input
                  type="number"
                  min="0"
                  value={formData.minimumRequirements.patentCount}
                  onChange={(e) =>
                    handleNestedChange(
                      "minimumRequirements",
                      "patentCount",
                      parseInt(e.target.value) || 0
                    )
                  }
                />
              </div>
            </div>

            <h3>Minimum Points Requirements</h3>
            <div className="form-row">
              <div className="form-group">
                <label>A1-A4 Publications Points</label>
                <input
                  type="number"
                  min="0"
                  value={formData.minimumRequirements.minimumPoints.A1A4}
                  onChange={(e) =>
                    handleDeepNestedChange(
                      "minimumRequirements",
                      "minimumPoints",
                      "A1A4",
                      parseInt(e.target.value) || 0
                    )
                  }
                />
              </div>
              <div className="form-group">
                <label>A1-A6 Publications Points</label>
                <input
                  type="number"
                  min="0"
                  value={formData.minimumRequirements.minimumPoints.A1A6}
                  onChange={(e) =>
                    handleDeepNestedChange(
                      "minimumRequirements",
                      "minimumPoints",
                      "A1A6",
                      parseInt(e.target.value) || 0
                    )
                  }
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Total Minimum Points</label>
                <input
                  type="number"
                  min="0"
                  value={formData.minimumRequirements.minimumPoints.total}
                  onChange={(e) =>
                    handleDeepNestedChange(
                      "minimumRequirements",
                      "minimumPoints",
                      "total",
                      parseInt(e.target.value) || 0
                    )
                  }
                />
              </div>
            </div>

            {formData.fieldArea === "Güzel Sanatlar" && (
              <>
                <h3>Exhibition Requirements (Fine Arts Only)</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Personal Exhibitions</label>
                    <input
                      type="number"
                      min="0"
                      value={
                        formData.minimumRequirements.exhibitionsCount.personal
                      }
                      onChange={(e) =>
                        handleDeepNestedChange(
                          "minimumRequirements",
                          "exhibitionsCount",
                          "personal",
                          parseInt(e.target.value) || 0
                        )
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Group Exhibitions</label>
                    <input
                      type="number"
                      min="0"
                      value={
                        formData.minimumRequirements.exhibitionsCount.group
                      }
                      onChange={(e) =>
                        handleDeepNestedChange(
                          "minimumRequirements",
                          "exhibitionsCount",
                          "group",
                          parseInt(e.target.value) || 0
                        )
                      }
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === "special" && (
          <div className="form-section">
            <div className="form-group">
              <label htmlFor="specialDescription">
                Special Requirements Description
              </label>
              <textarea
                id="specialDescription"
                value={formData.specialRequirements.description}
                onChange={(e) =>
                  handleNestedChange(
                    "specialRequirements",
                    "description",
                    e.target.value
                  )
                }
                rows="4"
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="requiredPublications">
                Required Publications
              </label>
              <textarea
                id="requiredPublications"
                value={formData.specialRequirements.requiredPublications}
                onChange={(e) =>
                  handleNestedChange(
                    "specialRequirements",
                    "requiredPublications",
                    e.target.value
                  )
                }
                rows="4"
                placeholder="e.g., At least one publication must be in the field of..."
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="additionalNotes">Additional Notes</label>
              <textarea
                id="additionalNotes"
                value={formData.specialRequirements.additionalNotes}
                onChange={(e) =>
                  handleNestedChange(
                    "specialRequirements",
                    "additionalNotes",
                    e.target.value
                  )
                }
                rows="4"
                placeholder="Any additional requirements or notes..."
              ></textarea>
            </div>
          </div>
        )}

        <div className="form-actions">
          <button
            type="button"
            className="btn-cancel"
            onClick={() => navigate("/manager/dashboard")}
          >
            Cancel
          </button>
          <button type="submit" className="btn-save" disabled={loading}>
            {loading
              ? "Saving..."
              : isEditMode
              ? "Update Criteria"
              : "Create Criteria"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CriteriaForm;
