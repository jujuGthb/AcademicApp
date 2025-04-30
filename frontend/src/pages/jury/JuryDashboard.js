"use client";

import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "../admin/AdminStyles.css";

const JuryDashboard = () => {
  const { user, token } = useContext(AuthContext);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Placeholder data - in a real app, this would come from an API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setAssignments([
        {
          id: "1",
          applicantName: "Ahmet Yılmaz",
          position: "Dr. Öğretim Üyesi",
          department: "Bilgisayar Mühendisliği",
          faculty: "Mühendislik Fakültesi",
          status: "pending",
          dueDate: "2025-05-15",
        },
        {
          id: "2",
          applicantName: "Ayşe Demir",
          position: "Doçent",
          department: "Elektrik-Elektronik Mühendisliği",
          faculty: "Mühendislik Fakültesi",
          status: "in_progress",
          dueDate: "2025-05-20",
        },
        {
          id: "3",
          applicantName: "Mehmet Kaya",
          position: "Profesör",
          department: "Makine Mühendisliği",
          faculty: "Mühendislik Fakültesi",
          status: "completed",
          dueDate: "2025-05-10",
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Beklemede";
      case "in_progress":
        return "Değerlendiriliyor";
      case "completed":
        return "Tamamlandı";
      default:
        return status;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "pending":
        return "status-draft";
      case "in_progress":
        return "status-published";
      case "completed":
        return "status-active";
      default:
        return "";
    }
  };

  return (
    <div className="admin-container">
      <h1 className="admin-title">Jüri Üyesi Paneli</h1>
      <div className="admin-welcome">
        <h2>Hoşgeldiniz, {user?.name || "Jüri Üyesi"}</h2>
        <p>Bu panelden size atanan başvuruları değerlendirebilirsiniz.</p>
      </div>

      <div className="admin-list-container">
        <h2>Değerlendirme Görevleriniz</h2>
        {loading ? (
          <div className="loading">Görevler yükleniyor...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : assignments.length === 0 ? (
          <div className="empty-message">
            Atanmış değerlendirme göreviniz bulunmamaktadır.
          </div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Aday</th>
                  <th>Pozisyon</th>
                  <th>Bölüm</th>
                  <th>Fakülte</th>
                  <th>Durum</th>
                  <th>Son Tarih</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map((assignment) => (
                  <tr key={assignment.id}>
                    <td>{assignment.applicantName}</td>
                    <td>{assignment.position}</td>
                    <td>{assignment.department}</td>
                    <td>{assignment.faculty}</td>
                    <td>
                      <span
                        className={`status-badge ${getStatusClass(
                          assignment.status
                        )}`}
                      >
                        {getStatusText(assignment.status)}
                      </span>
                    </td>
                    <td>{new Date(assignment.dueDate).toLocaleDateString()}</td>
                    <td>
                      <div className="action-buttons">
                        <Link
                          to={`/jury/evaluate/${assignment.id}`}
                          className="btn-icon"
                          title="Değerlendir"
                        >
                          📝
                        </Link>
                        <Link
                          to={`/jury/view/${assignment.id}`}
                          className="btn-icon"
                          title="Görüntüle"
                        >
                          👁️
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="admin-stats">
        <h2>Değerlendirme İstatistikleri</h2>
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <h3>Bekleyen</h3>
            <p className="stat-number">
              {assignments.filter((a) => a.status === "pending").length}
            </p>
          </div>
          <div className="admin-stat-card">
            <h3>Devam Eden</h3>
            <p className="stat-number">
              {assignments.filter((a) => a.status === "in_progress").length}
            </p>
          </div>
          <div className="admin-stat-card">
            <h3>Tamamlanan</h3>
            <p className="stat-number">
              {assignments.filter((a) => a.status === "completed").length}
            </p>
          </div>
          <div className="admin-stat-card">
            <h3>Toplam</h3>
            <p className="stat-number">{assignments.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JuryDashboard;
