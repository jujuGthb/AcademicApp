"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./AdminStyles.css";

const AssignJury = () => {
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
        const token = localStorage.getItem("token");

        // Fetch application details
        const applicationResponse = await fetch(
          `http://localhost:5000/api/applications/${applicationId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!applicationResponse.ok) {
          throw new Error("Başvuru bilgileri yüklenirken bir hata oluştu");
        }

        const applicationData = await applicationResponse.json();
        setApplication(applicationData);

        // Fetch all jury members
        const juryResponse = await fetch(
          "http://localhost:5000/api/users/role/jury",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!juryResponse.ok) {
          throw new Error("Jüri üyeleri yüklenirken bir hata oluştu");
        }

        const juryData = await juryResponse.json();
        setJuryMembers(juryData);

        // Set default due date (30 days from now)
        const defaultDueDate = new Date();
        defaultDueDate.setDate(defaultDueDate.getDate() + 30);
        setDueDate(defaultDueDate.toISOString().split("T")[0]);

        setError(null);
      } catch (err) {
        setError("Veri yüklenirken hata: " + err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    //fetchData();
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
      setError("Lütfen en az bir jüri üyesi seçin.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/jury/assign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          applicationId,
          juryMemberIds: selectedJuryMembers,
          dueDate,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Jüri ataması yapılırken bir hata oluştu"
        );
      }

      setSuccess("Jüri ataması başarıyla yapıldı!");

      // Redirect after a short delay
      setTimeout(() => {
        navigate(`/admin/applications/${applicationId}`);
      }, 2000);
    } catch (err) {
      setError("Jüri ataması yapılırken hata: " + err.message);
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading">Veriler yükleniyor...</div>;
  }

  if (error && !application) {
    return <div className="error-message">{error}</div>;
  }

  if (!application) {
    return <div className="error-message">Başvuru bulunamadı.</div>;
  }

  return (
    <div className="admin-container">
      <div className="page-header">
        <h1 className="admin-title">Jüri Ataması</h1>
        <button
          className="btn btn-secondary"
          onClick={() => navigate(`/admin/applications/${applicationId}`)}
        >
          Başvuruya Dön
        </button>
      </div>

      <div className="application-summary">
        <h3>Başvuru Özeti</h3>
        <div className="summary-details">
          <div className="summary-item">
            <span className="label">Aday:</span>
            <span className="value">{application.applicant.name}</span>
          </div>
          <div className="summary-item">
            <span className="label">İlan:</span>
            <span className="value">{application.jobPosting.title}</span>
          </div>
          <div className="summary-item">
            <span className="label">Pozisyon:</span>
            <span className="value">{application.jobPosting.position}</span>
          </div>
          <div className="summary-item">
            <span className="label">Bölüm:</span>
            <span className="value">{application.jobPosting.department}</span>
          </div>
          <div className="summary-item">
            <span className="label">Başvuru Tarihi:</span>
            <span className="value">
              {application.submissionDate
                ? new Date(application.submissionDate).toLocaleDateString()
                : "-"}
            </span>
          </div>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit} className="jury-assignment-form">
        <div className="form-section">
          <div className="form-group">
            <label htmlFor="dueDate">Değerlendirme Son Tarihi</label>
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
            <h3>Jüri Üyelerini Seçin (Önerilen: 5 üye)</h3>
            <p className="help-text">
              Alanında uzman ve değerlendirme için uygun jüri üyelerini seçin.
            </p>

            {juryMembers.length > 0 ? (
              <div className="jury-list">
                {juryMembers.map((jury) => (
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
                    </div>
                    <div className="jury-select">
                      <input
                        type="checkbox"
                        checked={selectedJuryMembers.includes(jury._id)}
                        onChange={() => {}}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-message">
                Jüri üyesi bulunamadı. Lütfen önce jüri üyesi ekleyin.
              </p>
            )}
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate(`/admin/applications/${applicationId}`)}
          >
            İptal
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting || selectedJuryMembers.length === 0}
          >
            {submitting ? "Atama Yapılıyor..." : "Jüri Üyelerini Ata"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AssignJury;
