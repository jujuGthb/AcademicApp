"use client";

import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/use-auth";
import { useApplication } from "../../hooks/use-application";
import { useCriteria } from "../../hooks/use-criteria";
import api from "../../services/api";
import "./ManagerStyles.css";
import { AuthContext } from "../../context/AuthContext";

const ManagerDashboard = () => {
  const { user } = useContext(AuthContext);
  const {
    applications,
    loading: applicationsLoading,
    fetchAllApplications,
  } = useApplication();
  const { criteria, loading: criteriaLoading, fetchCriteria } = useCriteria();

  const [juryMembers, setJuryMembers] = useState([]);
  const [juryLoading, setJuryLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        await Promise.all([fetchAllApplications(), fetchCriteria()]);

        // Fetch jury members
        setJuryLoading(true);
        const juryResponse = await api.get("/users?role=jury");
        setJuryMembers(juryResponse.data || []);
        setJuryLoading(false);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
        setError("Veriler yüklenirken bir hata oluştu.");
        setJuryLoading(false);
      }
    };

    //loadDashboardData();
  }, [fetchAllApplications, fetchCriteria]);

  if (applicationsLoading || criteriaLoading || juryLoading) {
    return <div className="loading">Yükleniyor...</div>;
  }

  // Calculate statistics
  const pendingApplications = applications.filter(
    (app) => app.status === "pending"
  );
  const approvedApplications = applications.filter(
    (app) => app.status === "approved"
  );
  const rejectedApplications = applications.filter(
    (app) => app.status === "rejected"
  );

  // Applications without jury assignment
  const unassignedApplications = applications.filter(
    (app) =>
      app.status === "pending" &&
      (!app.evaluations || app.evaluations.length === 0)
  );

  return (
    <div className="manager-dashboard">
      <h1 className="dashboard-title">
        Yönetici Paneli - Hoş Geldiniz, {user?.name} {user?.surname}
      </h1>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-file-alt"></i>
          </div>
          <div className="stat-content">
            <h3>{applications.length}</h3>
            <p>Toplam Başvuru</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-clock"></i>
          </div>
          <div className="stat-content">
            <h3>{pendingApplications.length}</h3>
            <p>Bekleyen Başvuru</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-user-tie"></i>
          </div>
          <div className="stat-content">
            <h3>{juryMembers.length}</h3>
            <p>Jüri Üyesi</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-list-check"></i>
          </div>
          <div className="stat-content">
            <h3>{criteria.length}</h3>
            <p>Kriter Seti</p>
          </div>
        </div>
      </div>

      <div className="dashboard-sections">
        {/* Unassigned Applications Section */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Jüri Ataması Bekleyen Başvurular</h2>
            <Link
              to="/manager/jury-assignment"
              className="btn btn-sm btn-secondary"
            >
              Jüri Atama
            </Link>
          </div>

          {unassignedApplications.length === 0 ? (
            <p className="no-data">
              Jüri ataması bekleyen başvuru bulunmamaktadır.
            </p>
          ) : (
            <div className="application-list">
              {unassignedApplications.slice(0, 5).map((application) => (
                <div key={application.id} className="application-card">
                  <div className="application-header">
                    <h3>
                      {application.announcement?.title || "İlan Bilgisi Yok"}
                    </h3>
                    <span className="application-status pending">
                      Jüri Ataması Bekliyor
                    </span>
                  </div>
                  <div className="application-details">
                    <p>
                      <strong>Aday:</strong> {application.user?.name}{" "}
                      {application.user?.surname}
                    </p>
                    <p>
                      <strong>Başvuru Tarihi:</strong>{" "}
                      {new Date(application.createdAt).toLocaleDateString(
                        "tr-TR"
                      )}
                    </p>
                    <p>
                      <strong>Fakülte/Birim:</strong>{" "}
                      {application.announcement?.faculty || "Bilgi Yok"}
                    </p>
                  </div>
                  <div className="application-footer">
                    <Link
                      to={`/manager/applications/${application.id}`}
                      className="btn btn-sm btn-primary"
                    >
                      Detaylar
                    </Link>
                    <Link
                      to={`/manager/jury-assignment/${application.id}`}
                      className="btn btn-sm btn-success"
                    >
                      Jüri Ata
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Applications Section */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Son Başvurular</h2>
            <Link
              to="/manager/applications"
              className="btn btn-sm btn-secondary"
            >
              Tümünü Gör
            </Link>
          </div>

          {applications.length === 0 ? (
            <p className="no-data">Henüz başvuru bulunmamaktadır.</p>
          ) : (
            <div className="application-list">
              {applications.slice(0, 5).map((application) => (
                <div key={application.id} className="application-card">
                  <div className="application-header">
                    <h3>
                      {application.announcement?.title || "İlan Bilgisi Yok"}
                    </h3>
                    <span
                      className={`application-status ${application.status}`}
                    >
                      {application.status === "pending" && "Beklemede"}
                      {application.status === "approved" && "Onaylandı"}
                      {application.status === "rejected" && "Reddedildi"}
                    </span>
                  </div>
                  <div className="application-details">
                    <p>
                      <strong>Aday:</strong> {application.user?.name}{" "}
                      {application.user?.surname}
                    </p>
                    <p>
                      <strong>Başvuru Tarihi:</strong>{" "}
                      {new Date(application.createdAt).toLocaleDateString(
                        "tr-TR"
                      )}
                    </p>
                    <p>
                      <strong>Fakülte/Birim:</strong>{" "}
                      {application.announcement?.faculty || "Bilgi Yok"}
                    </p>
                  </div>
                  <div className="application-footer">
                    <Link
                      to={`/manager/applications/${application.id}`}
                      className="btn btn-sm btn-primary"
                    >
                      Detaylar
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Criteria Section */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2>Kriter Setleri</h2>
          <Link
            to="/manager/criteria-form"
            className="btn btn-sm btn-secondary"
          >
            Yeni Kriter Seti
          </Link>
        </div>

        {criteria.length === 0 ? (
          <p className="no-data">Henüz kriter seti bulunmamaktadır.</p>
        ) : (
          <div className="criteria-list">
            {criteria.slice(0, 5).map((criterion) => (
              <div key={criterion.id} className="criteria-card">
                <div className="criteria-header">
                  <h3>{criterion.name}</h3>
                  <span
                    className={`criteria-badge ${
                      criterion.isActive ? "active" : "inactive"
                    }`}
                  >
                    {criterion.isActive ? "Aktif" : "Pasif"}
                  </span>
                </div>
                <div className="criteria-details">
                  <p>
                    <strong>Akademik Alan:</strong> {criterion.academicField}
                  </p>
                  <p>
                    <strong>Kadro:</strong> {criterion.position}
                  </p>
                  <p>
                    <strong>Minimum Puan:</strong>{" "}
                    {criterion.minimumRequirements?.minimumScores?.total}
                  </p>
                </div>
                <div className="criteria-footer">
                  <Link
                    to={`/manager/criteria-form/${criterion.id}`}
                    className="btn btn-sm btn-primary"
                  >
                    Düzenle
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions Section */}
      <div className="dashboard-quick-actions">
        <h2>Hızlı İşlemler</h2>
        <div className="quick-actions-grid">
          <Link to="/manager/criteria-form" className="quick-action-card">
            <div className="quick-action-icon">
              <i className="fas fa-list-check"></i>
            </div>
            <h3>Kriter Yönetimi</h3>
            <p>Yeni kriter seti oluşturun veya mevcut kriterleri düzenleyin</p>
          </Link>

          <Link to="/manager/jury-assignment" className="quick-action-card">
            <div className="quick-action-icon">
              <i className="fas fa-user-tie"></i>
            </div>
            <h3>Jüri Atama</h3>
            <p>Başvurulara jüri üyesi atayın</p>
          </Link>

          <Link to="/manager/applications" className="quick-action-card">
            <div className="quick-action-icon">
              <i className="fas fa-file-alt"></i>
            </div>
            <h3>Başvuru İnceleme</h3>
            <p>Başvuruları inceleyin ve değerlendirin</p>
          </Link>

          <Link to="/manager/reports" className="quick-action-card">
            <div className="quick-action-icon">
              <i className="fas fa-chart-bar"></i>
            </div>
            <h3>Raporlar</h3>
            <p>Başvuru ve değerlendirme raporlarını görüntüleyin</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
