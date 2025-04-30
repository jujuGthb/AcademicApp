"use client";

import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useJobPostings } from "../../hooks/use-job-postings";
import { useApplication } from "../../hooks/use-application";
import "./JobPostingDetails.css";

const JobPostingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getJobPostingById } = useJobPostings();
  const { createApplication } = useApplication();

  const [jobPosting, setJobPosting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [applying, setApplying] = useState(false);
  const [applicationSuccess, setApplicationSuccess] = useState(false);

  useEffect(() => {
    const fetchJobPosting = async () => {
      try {
        setLoading(true);
        const data = await getJobPostingById(id);
        setJobPosting(data);
      } catch (err) {
        console.error("Error fetching job posting:", err);
        setError("İlan detayları yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobPosting();
  }, [id, getJobPostingById]);

  const handleApply = async () => {
    try {
      setApplying(true);
      await createApplication({ announcementId: id });
      setApplicationSuccess(true);
      setTimeout(() => {
        navigate("/candidate/applications");
      }, 2000);
    } catch (err) {
      console.error("Error applying to job posting:", err);
      setError(
        "Başvuru yapılırken bir hata oluştu. Lütfen daha sonra tekrar deneyin."
      );
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return <div className="loading">Yükleniyor...</div>;
  }

  if (!jobPosting) {
    return (
      <div className="job-posting-details">
        <div className="alert alert-danger">
          İlan bulunamadı veya erişim izniniz yok.
        </div>
        <Link to="/candidate/job-postings" className="btn btn-primary">
          İlanlara Dön
        </Link>
      </div>
    );
  }

  return (
    <div className="job-posting-details">
      <div className="details-header">
        <h1>{jobPosting.title}</h1>
        <div className="status-badge">
          {jobPosting.status === "active" ? (
            <span className="badge active">Aktif</span>
          ) : (
            <span className="badge inactive">Pasif</span>
          )}
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {applicationSuccess && (
        <div className="alert alert-success">
          Başvurunuz başarıyla alınmıştır. Başvurularım sayfasına
          yönlendiriliyorsunuz...
        </div>
      )}

      <div className="details-card">
        <div className="details-section">
          <h2>İlan Bilgileri</h2>
          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-label">Fakülte/Birim:</span>
              <span className="detail-value">{jobPosting.faculty}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Bölüm:</span>
              <span className="detail-value">{jobPosting.department}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Kadro:</span>
              <span className="detail-value">{jobPosting.position}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Kadro Sayısı:</span>
              <span className="detail-value">{jobPosting.positionCount}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">İlan Başlangıç Tarihi:</span>
              <span className="detail-value">
                {new Date(jobPosting.startDate).toLocaleDateString("tr-TR")}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Son Başvuru Tarihi:</span>
              <span className="detail-value">
                {new Date(jobPosting.endDate).toLocaleDateString("tr-TR")}
              </span>
            </div>
          </div>
        </div>

        <div className="details-section">
          <h2>İlan Açıklaması</h2>
          <p className="description">{jobPosting.description}</p>
        </div>

        <div className="details-section">
          <h2>Gerekli Belgeler</h2>
          {jobPosting.requiredDocuments &&
          jobPosting.requiredDocuments.length > 0 ? (
            <ul className="documents-list">
              {jobPosting.requiredDocuments.map((doc, index) => (
                <li key={index} className={doc.required ? "required" : ""}>
                  {doc.name}{" "}
                  {doc.required && (
                    <span className="required-badge">Zorunlu</span>
                  )}
                  {doc.description && (
                    <p className="document-description">{doc.description}</p>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>Belirtilen belge bulunmamaktadır.</p>
          )}
        </div>

        <div className="details-section">
          <h2>Başvuru Kriterleri</h2>
          {jobPosting.criteria ? (
            <div className="criteria-info">
              <p>
                <strong>Kriter Seti:</strong> {jobPosting.criteria.name}
              </p>
              <p>
                <strong>Akademik Alan:</strong>{" "}
                {jobPosting.criteria.academicField}
              </p>
              <p>
                <strong>Minimum Puan:</strong>{" "}
                {jobPosting.criteria.minimumRequirements.minimumScores.total}
              </p>
              <Link
                to={`/candidate/criteria/${jobPosting.criteria.id}`}
                className="btn btn-sm btn-secondary"
              >
                Kriter Detaylarını Görüntüle
              </Link>
            </div>
          ) : (
            <p>Kriter bilgisi bulunmamaktadır.</p>
          )}
        </div>
      </div>

      <div className="details-actions">
        <Link to="/candidate/job-postings" className="btn btn-secondary">
          İlanlara Dön
        </Link>
        {jobPosting.status === "active" &&
          new Date() <= new Date(jobPosting.endDate) && (
            <button
              className="btn btn-primary"
              onClick={handleApply}
              disabled={applying || applicationSuccess}
            >
              {applying ? "Başvuru Yapılıyor..." : "Başvur"}
            </button>
          )}
      </div>
    </div>
  );
};

export default JobPostingDetails;
