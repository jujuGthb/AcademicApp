import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/use-auth";
import ActivityService from "../../services/activity-service";
import JobPostingService from "../../services/job-posting-service";
import { formatDate } from "../../utils/formatters";
import "./Dashboard.css";
import { AuthContext } from "../../context/AuthContext";

const Dashboard = () => {
  //const { user } = useAuth();
  const { user } = useContext(AuthContext);
  const [activities, setActivities] = useState([]);
  const [jobPostings, setJobPostings] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch recent activities
        const activitiesData = await ActivityService.getActivities();
        setActivities(activitiesData.slice(0, 5)); // Get only the 5 most recent

        // Fetch open job postings
        const jobPostingsData = await JobPostingService.getJobPostingsByStatus(
          "active"
        );
        setJobPostings(jobPostingsData.slice(0, 3)); // Get only the 3 most recent

        // Fetch activity stats
        const statsData = await ActivityService.getActivityStats();
        setStats(statsData);
      } catch (err) {
        setError(
          "Veri yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin."
        );
        console.error("Dashboard data fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="loading">Yükleniyor...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-welcome">
        <h1>Hoş Geldiniz, {user?.name || "Kullanıcı"}</h1>
        <p>
          Akademik Yükseltme Sistemi'ne hoş geldiniz. Aşağıda son
          faaliyetlerinizi ve açık iş ilanlarını görebilirsiniz.
        </p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h2>Özet Bilgiler</h2>
          </div>
          <div className="dashboard-card-content">
            {stats ? (
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-value">
                    {stats.totalActivities || 0}
                  </span>
                  <span className="stat-label">Toplam Faaliyet</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">
                    {stats.totalPoints?.toFixed(2) || 0}
                  </span>
                  <span className="stat-label">Toplam Puan</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">
                    {stats.publicationCount || 0}
                  </span>
                  <span className="stat-label">Yayın Sayısı</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{stats.projectCount || 0}</span>
                  <span className="stat-label">Proje Sayısı</span>
                </div>
              </div>
            ) : (
              <p className="no-data-message">
                Henüz faaliyet kaydınız bulunmamaktadır.
              </p>
            )}
          </div>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h2>Son Faaliyetler</h2>
            <Link to="/candidate/activities" className="view-all-link">
              Tümünü Gör
            </Link>
          </div>
          <div className="dashboard-card-content">
            {activities && activities.length > 0 ? (
              <ul className="activities-list">
                {activities.map((activity) => (
                  <li key={activity._id} className="activity-item">
                    <div className="activity-info">
                      <span className="activity-category">
                        {activity.category}
                      </span>
                      <span className="activity-date">
                        {formatDate(activity.date)}
                      </span>
                    </div>
                    <h3 className="activity-title">{activity.title}</h3>
                    <div className="activity-points">
                      <span>{activity.calculatedPoints.toFixed(2)} puan</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-data-message">
                Henüz faaliyet kaydınız bulunmamaktadır.
              </p>
            )}
          </div>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h2>Açık İş İlanları</h2>
            <Link to="/candidate/job-postings" className="view-all-link">
              Tümünü Gör
            </Link>
          </div>
          <div className="dashboard-card-content">
            {jobPostings && jobPostings.length > 0 ? (
              <ul className="job-postings-list">
                {jobPostings.map((job) => (
                  <li key={job._id} className="job-posting-item">
                    <h3 className="job-posting-title">{job.title}</h3>
                    <div className="job-posting-info">
                      <span>{job.faculty}</span>
                      <span>{job.department}</span>
                    </div>
                    <div className="job-posting-details">
                      <span className="job-posting-position">
                        {job.position}
                      </span>
                      <span className="job-posting-deadline">
                        Son Başvuru: {formatDate(job.applicationDeadline)}
                      </span>
                    </div>
                    <Link
                      to={`/candidate/job-postings/${job._id}`}
                      className="view-details-link"
                    >
                      Detayları Gör
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-data-message">
                Şu anda açık iş ilanı bulunmamaktadır.
              </p>
            )}
          </div>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h2>Duyurular</h2>
          </div>
          <div className="dashboard-card-content">
            <div className="announcement">
              <h3>Akademik Yükseltme Kriterleri Güncellendi</h3>
              <p className="announcement-date">15 Mayıs 2023</p>
              <p>
                Üniversitemizin akademik yükseltme kriterleri güncellenmiştir.
                Yeni kriterleri incelemek için
                <Link to="/criteria"> Kriterler</Link> sayfasını ziyaret
                edebilirsiniz.
              </p>
            </div>
            <div className="announcement">
              <h3>Yeni Dönem Başvuruları Başladı</h3>
              <p className="announcement-date">1 Haziran 2023</p>
              <p>
                2023-2024 akademik yılı için akademik yükseltme başvuruları
                başlamıştır. Son başvuru tarihi: 30 Haziran 2023
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
