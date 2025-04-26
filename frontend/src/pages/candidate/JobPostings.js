import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import JobPostingService from "../../services/job-posting-service";
import { formatDate } from "../../utils/formatters";
import "./JobPostings.css";

const JobPostings = () => {
  const [jobPostings, setJobPostings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchJobPostings = async () => {
      try {
        setLoading(true);
        setError(null);

        let data;
        if (filter === "all") {
          data = await JobPostingService.getAllJobPostings();
        } else {
          data = await JobPostingService.getJobPostingsByStatus(filter);
        }

        setJobPostings(data);
      } catch (err) {
        setError("İş ilanları yüklenirken bir hata oluştu.");
        console.error("Job postings fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobPostings();
  }, [filter]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  if (loading) {
    return <div className="loading">Yükleniyor...</div>;
  }

  return (
    <div className="job-postings-container">
      <div className="job-postings-header">
        <h1>İş İlanları</h1>
        <div className="job-postings-filter">
          <label htmlFor="status-filter">Durum:</label>
          <select
            id="status-filter"
            value={filter}
            onChange={handleFilterChange}
          >
            <option value="all">Tümü</option>
            <option value="active">Aktif</option>
            <option value="closed">Kapanmış</option>
          </select>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {jobPostings.length === 0 ? (
        <div className="no-job-postings">
          <p>Şu anda gösterilecek iş ilanı bulunmamaktadır.</p>
        </div>
      ) : (
        <div className="job-postings-list">
          {jobPostings.map((job) => (
            <div key={job._id} className="job-posting-card">
              <div className="job-posting-header">
                <h2>{job.title}</h2>
                <span className={`job-status job-status-${job.status}`}>
                  {job.status === "active" ? "Aktif" : "Kapanmış"}
                </span>
              </div>

              <div className="job-posting-details">
                <div className="job-detail">
                  <span className="job-detail-label">Fakülte:</span>
                  <span className="job-detail-value">{job.faculty}</span>
                </div>
                <div className="job-detail">
                  <span className="job-detail-label">Bölüm:</span>
                  <span className="job-detail-value">{job.department}</span>
                </div>
                <div className="job-detail">
                  <span className="job-detail-label">Pozisyon:</span>
                  <span className="job-detail-value">{job.position}</span>
                </div>
                <div className="job-detail">
                  <span className="job-detail-label">İlan Tarihi:</span>
                  <span className="job-detail-value">
                    {formatDate(job.postingDate)}
                  </span>
                </div>
                <div className="job-detail">
                  <span className="job-detail-label">Son Başvuru Tarihi:</span>
                  <span className="job-detail-value">
                    {formatDate(job.applicationDeadline)}
                  </span>
                </div>
              </div>

              {job.description && (
                <div className="job-description">
                  <p>{job.description}</p>
                </div>
              )}

              <div className="job-posting-footer">
                <Link
                  to={`/candidate/job-postings/${job._id}`}
                  className="btn btn-primary"
                >
                  Detayları Gör
                </Link>

                {job.status === "active" && (
                  <Link
                    to={`/candidate/applications/new/${job._id}`}
                    className="btn btn-success"
                  >
                    Başvur
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobPostings;
