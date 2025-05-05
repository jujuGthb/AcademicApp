"use client";

import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import CandidateSidebar from "../../components/admin/AdminSidebar";
import "./AdminStyles.css";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    activeJobPostings: 0,
    pendingApplications: 0,
    registeredUsers: 0,
    completedReviews: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        // Fetch job postings count
        const jobsResponse = await fetch(
          "http://localhost:5000/api/job-postings/stats",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Fetch applications count
        const applicationsResponse = await fetch(
          "http://localhost:5000/api/applications/stats",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Fetch users count
        const usersResponse = await fetch(
          "http://localhost:5000/api/users/stats",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!jobsResponse.ok || !applicationsResponse.ok || !usersResponse.ok) {
          throw new Error("Failed to fetch statistics");
        }

        const jobsData = await jobsResponse.json();
        const applicationsData = await applicationsResponse.json();
        const usersData = await usersResponse.json();

        setStats({
          activeJobPostings: jobsData.activeCount || 0,
          pendingApplications: applicationsData.pendingCount || 0,
          registeredUsers: usersData.totalCount || 0,
          completedReviews: applicationsData.completedReviewsCount || 0,
        });

        setError(null);
      } catch (err) {
        console.error("Error fetching statistics:", err);
        setError("İstatistikler yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    //fetchStats();
  }, []);

  return (
    <div className="admin-container">
      <h1 className="admin-title">Admin Paneli</h1>
      <div className="admin-welcome">
        <h2>Hoş Geldiniz, {user?.name || "Admin"}</h2>
        <p>Bu panelden akademik başvuru sistemini yönetebilirsiniz.</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="admin-cards">
        <div className="admin-card">
          <h3>İlan Yönetimi</h3>
          <p>Akademik iş ilanlarını oluşturun, düzenleyin ve yayınlayın.</p>
          <Link to="/admin/job-postings" className="btn btn-primary">
            İlanları Yönet
          </Link>
        </div>

        <div className="admin-card">
          <h3>Başvuru Yönetimi</h3>
          <p>
            Adayların başvurularını görüntüleyin ve jüri üyelerine yönlendirin.
          </p>
          <Link to="/admin/applications" className="btn btn-primary">
            Başvuruları Yönet
          </Link>
        </div>

        <div className="admin-card">
          <h3>Kullanıcı Yönetimi</h3>
          <p>Adayları, jüri üyelerini ve yöneticileri yönetin.</p>
          <Link to="/admin/users" className="btn btn-primary">
            Kullanıcıları Yönet
          </Link>
        </div>

        <div className="admin-card">
          <h3>Değerlendirme Kriterleri</h3>
          <p>
            Akademik pozisyonlar için değerlendirme kriterlerini belirleyin.
          </p>
          <Link to="/admin/criteria" className="btn btn-primary">
            Kriterleri Yönet
          </Link>
        </div>
      </div>

      <div className="admin-stats">
        <h2>Sistem İstatistikleri</h2>
        {loading ? (
          <div className="loading">İstatistikler yükleniyor...</div>
        ) : (
          <div className="admin-stats-grid">
            <div className="admin-stat-card">
              <h3>Aktif İlanlar</h3>
              <p className="stat-number">{stats.activeJobPostings}</p>
            </div>
            <div className="admin-stat-card">
              <h3>Bekleyen Başvurular</h3>
              <p className="stat-number">{stats.pendingApplications}</p>
            </div>
            <div className="admin-stat-card">
              <h3>Kayıtlı Kullanıcılar</h3>
              <p className="stat-number">{stats.registeredUsers}</p>
            </div>
            <div className="admin-stat-card">
              <h3>Tamamlanan Değerlendirmeler</h3>
              <p className="stat-number">{stats.completedReviews}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
