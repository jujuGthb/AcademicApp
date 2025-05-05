import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/use-auth";
import ActivityService from "../../services/activity-service";
import JobPostingService from "../../services/job-posting-service";
import { formatDate } from "../../utils/formatters";
import { AuthContext } from "../../context/AuthContext";
import CandidateSidebar from "../../components/candidate/CandidateSidebar";
import Header from "../../components/common/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Dashboard.css";

const Dashboard = () => {
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

        const activitiesData = await ActivityService.getActivities();
        setActivities(activitiesData?.slice(0, 5));

        const jobPostingsData = await JobPostingService.getJobPostingsByStatus(
          "active"
        );
        setJobPostings(jobPostingsData?.slice(0, 3));

        const statsData = await ActivityService?.getActivityStats();
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

  if (loading) return <div className="text-center mt-5">Yükleniyor...</div>;

  return (
    <div className="d-flex">
      <CandidateSidebar />
      <div className="container ml-4 p-4">
        <Header />
        <div className="mb-4">
          <h1>Hoş Geldiniz, {user?.name || "Kullanıcı"}</h1>
          <p>
            Akademik Yükseltme Sistemi'ne hoş geldiniz. Aşağıda son
            faaliyetlerinizi ve açık iş ilanlarını görebilirsiniz.
          </p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="row g-4">
          {/* Stats Card */}
          <div className="col-md-6 col-lg-4">
            <div className="card h-100">
              <div className="card-header">
                <h5>Özet Bilgiler</h5>
              </div>
              <div className="card-body">
                {stats ? (
                  <div className="row text-center">
                    <div className="col-6 mb-3">
                      <h6>{stats.totalActivities || 0}</h6>
                      <small>Toplam Faaliyet</small>
                    </div>
                    <div className="col-6 mb-3">
                      <h6>{stats.totalPoints?.toFixed(2) || 0}</h6>
                      <small>Toplam Puan</small>
                    </div>
                    <div className="col-6">
                      <h6>{stats.publicationCount || 0}</h6>
                      <small>Yayın Sayısı</small>
                    </div>
                    <div className="col-6">
                      <h6>{stats.projectCount || 0}</h6>
                      <small>Proje Sayısı</small>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted">
                    Henüz faaliyet kaydınız bulunmamaktadır.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Activities Card */}
          <div className="col-md-6 col-lg-4">
            <div className="card h-100">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Son Faaliyetler</h5>
                <Link
                  to="/candidate/activities"
                  className="btn btn-sm btn-outline-primary"
                >
                  Tümünü Gör
                </Link>
              </div>
              <div className="card-body">
                {activities.length > 0 ? (
                  <ul className="list-group list-group-flush">
                    {activities.map((activity) => (
                      <li key={activity._id} className="list-group-item">
                        <div className="d-flex justify-content-between">
                          <small className="text-muted">
                            {activity.category}
                          </small>
                          <small className="text-muted">
                            {formatDate(activity.date)}
                          </small>
                        </div>
                        <strong>{activity.title}</strong>
                        <div className="text-end text-primary">
                          {activity.calculatedPoints.toFixed(2)} puan
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted">
                    Henüz faaliyet kaydınız bulunmamaktadır.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Job Postings Card */}
          <div className="col-md-6 col-lg-4">
            <div className="card h-100">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Açık İş İlanları</h5>
                <Link
                  to="/candidate/job-postings"
                  className="btn btn-sm btn-outline-primary"
                >
                  Tümünü Gör
                </Link>
              </div>
              <div className="card-body">
                {jobPostings.length > 0 ? (
                  <ul className="list-group list-group-flush">
                    {jobPostings.map((job) => (
                      <li key={job._id} className="list-group-item">
                        <h6>{job.title}</h6>
                        <p className="mb-1">
                          {job.faculty} - {job.department}
                        </p>
                        <div className="d-flex justify-content-between">
                          <small>{job.position}</small>
                          <small>
                            Son: {formatDate(job.applicationDeadline)}
                          </small>
                        </div>
                        <Link
                          to={`/candidate/job-postings/${job._id}`}
                          className="btn btn-link p-0 mt-2"
                        >
                          Detayları Gör
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted">
                    Şu anda açık iş ilanı bulunmamaktadır.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Announcements */}
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h5>Duyurular</h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <h6>Akademik Yükseltme Kriterleri Güncellendi</h6>
                  <small className="text-muted">15 Mayıs 2023</small>
                  <p>
                    Üniversitemizin akademik yükseltme kriterleri
                    güncellenmiştir. Yeni kriterleri incelemek için
                    <Link to="/criteria"> Kriterler</Link> sayfasını ziyaret
                    edebilirsiniz.
                  </p>
                </div>
                <div>
                  <h6>Yeni Dönem Başvuruları Başladı</h6>
                  <small className="text-muted">1 Haziran 2023</small>
                  <p>
                    2023-2024 akademik yılı için akademik yükseltme başvuruları
                    başlamıştır. Son başvuru tarihi: 30 Haziran 2023
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>{" "}
      {/* container */}
    </div>
  );
};

export default Dashboard;
