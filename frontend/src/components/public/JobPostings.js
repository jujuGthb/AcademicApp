"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./JobPostings.css";

const JobPostings = ({ isAuthenticated }) => {
  const [jobPostings, setJobPostings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobPostings = async () => {
      try {
        setLoading(true);
        // Specifically fetch published job postings
        const response = await fetch(
          "http://localhost:5000/api/job-postings/status/published"
        );

        if (!response.ok) {
          throw new Error("İş ilanları alınamadı");
        }

        const data = await response.json();
        setJobPostings(data);
        setError(null);
      } catch (err) {
        setError("İş ilanları alınırken bir hata oluştu.");
        console.error("Error fetching job postings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobPostings();
  }, []);

  const handleJobClick = (jobId) => {
    if (isAuthenticated) {
      navigate(`/candidate/job-postings/${jobId}`);
    } else {
      navigate("/login", {
        state: { from: `/candidate/job-postings/${jobId}` },
      });
    }
  };

  if (loading) {
    return (
      <div className="job-postings-loading">İş ilanları yükleniyor...</div>
    );
  }

  if (error) {
    return <div className="job-postings-error">{error}</div>;
  }

  if (jobPostings.length === 0) {
    return (
      <div className="job-postings-empty">
        Şu anda aktif iş ilanı bulunmamaktadır.
      </div>
    );
  }

  return (
    <div className="job-postings">
      <h2>Güncel İş İlanları</h2>
      <div className="job-postings-grid">
        {jobPostings.map((job) => (
          <div
            key={job._id}
            className="job-posting-card"
            onClick={() => handleJobClick(job._id)}
          >
            <h3>{job.title}</h3>
            <div className="job-posting-details">
              <p>
                <strong>Fakülte:</strong> {job.faculty}
              </p>
              <p>
                <strong>Bölüm:</strong> {job.department}
              </p>
              <p>
                <strong>Pozisyon:</strong> {job.position}
              </p>
              <p>
                <strong>Alan:</strong> {job.fieldArea}
              </p>
            </div>
            <div className="job-posting-dates">
              <p>
                Başlangıç: {new Date(job.startDate).toLocaleDateString("tr-TR")}
              </p>
              <p>Bitiş: {new Date(job.endDate).toLocaleDateString("tr-TR")}</p>
            </div>
            <button className="btn btn-primary">
              {isAuthenticated ? "Detayları Görüntüle" : "Başvuru Yap"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobPostings;
