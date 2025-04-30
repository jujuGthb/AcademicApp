"use client";

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./ManagerStyles.css";

const JuryAssignment = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [juryMembers, setJuryMembers] = useState([]);
  const [selectedJuryMembers, setSelectedJuryMembers] = useState([]);
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch application details
        const applicationResponse = await axios.get(
          `/api/applications/${applicationId}`
        );
        setApplication(applicationResponse.data);

        // Fetch all jury members
        const juryResponse = await axios.get("/api/jury/members");
        setJuryMembers(juryResponse.data);

        // Set default due date (30 days from now)
        const defaultDueDate = new Date();
        defaultDueDate.setDate(defaultDueDate.getDate() + 30);
        setDueDate(defaultDueDate.toISOString().split("T")[0]);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again.");
        setLoading(false);
      }
    };

    fetchData();
  }, [applicationId]);

  const handleJurySelection = (juryId) => {
    setSelectedJuryMembers((prev) => {
      if (prev.includes(juryId)) {
        return prev.filter((id) => id !== juryId);
      } else {
        return [...prev, juryId];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedJuryMembers.length === 0) {
      setError("Please select at least one jury member.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      await axios.post("/api/jury/assign", {
        applicationId,
        juryMemberIds: selectedJuryMembers,
        dueDate,
      });

      setSuccess("Jury members assigned successfully!");
      setSubmitting(false);

      // Redirect after a short delay
      setTimeout(() => {
        navigate(`/manager/applications/${applicationId}`);
      }, 2000);
    } catch (err) {
      console.error("Error assigning jury members:", err);
      setError("Failed to assign jury members. Please try again.");
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading application data...</div>;
  }

  if (!application) {
    return <div className="error-message">Application not found.</div>;
  }

  return (
    <div className="jury-assignment-container">
      <div className="form-header">
        <h2>Assign Jury Members</h2>
        <button
          className="btn-back"
          onClick={() => navigate(`/manager/applications/${applicationId}`)}
        >
          Back to Application
        </button>
      </div>

      <div className="application-summary">
        <h3>Application Summary</h3>
        <div className="summary-details">
          <div className="summary-item">
            <span className="label">Applicant:</span>
            <span className="value">{application.applicant.name}</span>
          </div>
          <div className="summary-item">
            <span className="label">Position:</span>
            <span className="value">{application.jobPosting.position}</span>
          </div>
          <div className="summary-item">
            <span className="label">Department:</span>
            <span className="value">{application.jobPosting.department}</span>
          </div>
          <div className="summary-item">
            <span className="label">Submission Date:</span>
            <span className="value">
              {new Date(application.submissionDate).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit} className="jury-assignment-form">
        <div className="form-section">
          <div className="form-group">
            <label htmlFor="dueDate">Evaluation Due Date</label>
            <input
              type="date"
              id="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div className="jury-selection">
            <h3>Select Jury Members (Recommended: 5 members)</h3>
            <p className="help-text">
              Select jury members who are experts in the field and available for
              evaluation.
            </p>

            <div className="jury-list">
              {juryMembers.length > 0 ? (
                juryMembers.map((jury) => (
                  <div
                    key={jury._id}
                    className={`jury-card ${
                      selectedJuryMembers.includes(jury._id) ? "selected" : ""
                    }`}
                    onClick={() => handleJurySelection(jury._id)}
                  >
                    <div className="jury-info">
                      <h4>{jury.name}</h4>
                      <p>{jury.email}</p>
                      <p className="jury-specialty">
                        {jury.specialty || "No specialty specified"}
                      </p>
                    </div>
                    <div className="jury-select">
                      <input
                        type="checkbox"
                        checked={selectedJuryMembers.includes(jury._id)}
                        onChange={() => {}}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p>No jury members available. Please add jury members first.</p>
              )}
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn-cancel"
            onClick={() => navigate(`/manager/applications/${applicationId}`)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-save"
            disabled={submitting || selectedJuryMembers.length === 0}
          >
            {submitting ? "Assigning..." : "Assign Jury Members"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default JuryAssignment;
