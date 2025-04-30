"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./AdminStyles.css";

const ApplicationsList = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [jobPosting, setJobPosting] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        // Fetch job posting details
        const jobResponse = await fetch(
          `http://localhost:5000/api/job-postings/${jobId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!jobResponse.ok) {
          throw new Error("İlan bilgileri yüklenirken bir hata oluştu");
        }

        const jobData = await jobResponse.json();
        setJobPosting(jobData);

        // Fetch applications for this job posting
        const applicationsResponse = await fetch(
          `http://localhost:5000/api/applications/job/${jobId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!applicationsResponse.ok) {
          throw new Error("Başvurular yüklenirken bir hata oluştu");
        }

        const applicationsData = await applicationsResponse.json();
        setApplications(applicationsData);
        setError(null);
      } catch (err) {
        setError("Veri yüklenirken hata: " + err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [jobId]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const filteredApplications =
    filter === "all"
      ? applications
      : applications.filter((app) => app.status === filter);

  const getStatusText = (status) => {
    switch (status) {
      case "draft":
        return "Taslak";
      case "submitted":
        return "Gönderildi";
      case "under_review":
        return "İncelemede";
      case "approved":
        return "Onaylandı";
      case "rejected":
        return "Reddedildi";
      default:
        return status;
    }
  };

  const assignJury = (applicationId) => {
    navigate(`/admin/applications/${applicationId}/assign-jury`);
  };

  const viewApplication = (applicationId) => {
    navigate(`/admin/applications/${applicationId}`);
  };

  if (loading) {
    return <div className="loading">Veriler yükleniyor...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!jobPosting) {
    return <div className="error-message">İlan bulunamadı.</div>;
  }

  return (
    <div className="admin-container">
      <div className="page-header">
        <h1 className="admin-title">İlan Başvuruları</h1>
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/admin/job-postings")}
        >
          İlanlara Dön
        </button>
      </div>

      <div className="job-details">
        <h2>{jobPosting.title}</h2>
        <div className="job-info">
          <p>
            <strong>Fakülte:</strong> {jobPosting.faculty}
          </p>
          <p>
            <strong>Bölüm:</strong> {jobPosting.department}
          </p>
          <p>
            <strong>Pozisyon:</strong> {jobPosting.position}
          </p>
          <p>
            <strong>Durum:</strong>{" "}
            <span className={`status-badge status-${jobPosting.status}`}>
              {jobPosting.status === "draft"
                ? "Taslak"
                : jobPosting.status === "published"
                ? "Yayında"
                : "Kapalı"}
            </span>
          </p>
          <p>
            <strong>Başvuru Tarihleri:</strong>{" "}
            {new Date(jobPosting.startDate).toLocaleDateString()} -{" "}
            {new Date(jobPosting.endDate).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="filter-container">
        <label htmlFor="statusFilter">Duruma Göre Filtrele:</label>
        <select id="statusFilter" value={filter} onChange={handleFilterChange}>
          <option value="all">Tümü</option>
          <option value="draft">Taslak</option>
          <option value="submitted">Gönderildi</option>
          <option value="under_review">İncelemede</option>
          <option value="approved">Onaylandı</option>
          <option value="rejected">Reddedildi</option>
        </select>
      </div>

      <div className="admin-list-container">
        <h2>Başvurular ({filteredApplications.length})</h2>
        {filteredApplications.length === 0 ? (
          <div className="empty-message">
            Bu kriterlere uygun başvuru bulunmamaktadır.
          </div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Aday</th>
                  <th>Başvuru Tarihi</th>
                  <th>Durum</th>
                  <th>Toplam Puan</th>
                  <th>Jüri Ataması</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map((application) => (
                  <tr key={application._id}>
                    <td>{application.applicant.name}</td>
                    <td>
                      {application.submissionDate
                        ? new Date(
                            application.submissionDate
                          ).toLocaleDateString()
                        : "-"}
                    </td>
                    <td>
                      <span
                        className={`status-badge status-${application.status}`}
                      >
                        {getStatusText(application.status)}
                      </span>
                    </td>
                    <td>{application.totalPoints}</td>
                    <td>
                      {application.juryMembers &&
                      application.juryMembers.length > 0 ? (
                        <span className="jury-assigned">
                          Jüri Atandı ({application.juryMembers.length})
                        </span>
                      ) : (
                        <span className="jury-not-assigned">Jüri Atanmadı</span>
                      )}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-icon"
                          onClick={() => viewApplication(application._id)}
                          title="Görüntüle"
                        >
                          👁️
                        </button>
                        {application.status === "submitted" && (
                          <button
                            className="btn-icon"
                            onClick={() => assignJury(application._id)}
                            title="Jüri Ata"
                          >
                            👨‍⚖️
                          </button>
                        )}
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

export default ApplicationsList;
