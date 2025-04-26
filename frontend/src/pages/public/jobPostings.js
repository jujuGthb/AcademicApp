import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import JobPostingService from "../../services/job-posting-service";
import { formatDate } from "../../utils/formatters";
import "./JobPostings.css";

const JobPostings = () => {
  const [jobPostings, setJobPostings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobPostings = async () => {
      try {
        setLoading(true);
        const data = await JobPostingService.getJobPostingsByStatus("active");
        setJobPostings(data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch job postings");
      } finally {
        setLoading(false);
      }
    };

    fetchJobPostings();
  }, []);

  if (loading) {
    return <div className="loading">Yükleniyor...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (jobPostings.length === 0) {
    return (
      <div className="job-postings-empty">
        <h1>İş İlanları</h1>
        <p>Şu anda aktif ilan bulunmamaktadır.</p>
      </div>
    );
  }

  return (
    <div className="job-postings-container">
      <h1>İş İlanları</h1>
      <div className="job-postings-list">
        {jobPostings.map((posting) => (
          <div key={posting._id} className="job-posting-card">
            <h2 className="job-posting-title">{posting.title}</h2>
            <div className="job-posting-details">
              <div className="job-posting-info">
                <span className="job-posting-department">
                  {posting.department}
                </span>
                <span className="job-posting-faculty">{posting.faculty}</span>
              </div>
              <div className="job-posting-meta">
                <span className="job-posting-position">{posting.position}</span>
                <span className="job-posting-deadline">
                  Son Başvuru: {formatDate(posting.applicationDeadline)}
                </span>
              </div>
            </div>
            <div className="job-posting-description">{posting.description}</div>
            <Link
              to={`/job-postings/${posting._id}`}
              className="btn btn-primary"
            >
              Detayları Görüntüle
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobPostings;
