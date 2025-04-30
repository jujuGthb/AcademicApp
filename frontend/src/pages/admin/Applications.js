"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useApplication } from "../../hooks/use-application";
import "./AdminStyles.css";

const Applications = () => {
  const { applications, loading, error, fetchAllApplications } =
    useApplication();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [facultyFilter, setFacultyFilter] = useState("all");
  const [faculties, setFaculties] = useState([]);

  useEffect(() => {
    //fetchAllApplications();
  }, [fetchAllApplications]);

  useEffect(() => {
    // Extract unique faculties from applications for filtering
    if (applications.length > 0) {
      const uniqueFaculties = [
        ...new Set(
          applications?.map((app) => app.announcement?.faculty).filter(Boolean)
        ),
      ];
      setFaculties(uniqueFaculties);
    }
  }, [applications]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleFacultyFilter = (e) => {
    setFacultyFilter(e.target.value);
  };

  // Filter applications based on search term, status filter, and faculty filter
  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      (app.user?.name + " " + app.user?.surname)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      app.announcement?.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      app.announcement?.department
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || app.status === statusFilter;

    const matchesFaculty =
      facultyFilter === "all" ||
      (app.announcement?.faculty && app.announcement.faculty === facultyFilter);

    return matchesSearch && matchesStatus && matchesFaculty;
  });

  if (loading) {
    return <div className="loading">Yükleniyor...</div>;
  }

  return (
    <div className="admin-applications">
      <div className="page-header">
        <h1>Başvuru Yönetimi</h1>
        <div className="header-actions">
          <Link to="/admin/reports" className="btn btn-secondary">
            <i className="fas fa-chart-bar"></i> Raporlar
          </Link>
        </div>
      </div>

      {/*error && <div className="alert alert-danger">{error}</div>*/}

      <div className="filters-container">
        <div className="search-container">
          <input
            type="text"
            placeholder="Aday veya ilan ara..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
        <div className="filter-container">
          <select
            value={statusFilter}
            onChange={handleStatusFilter}
            className="filter-select"
          >
            <option value="all">Tüm Durumlar</option>
            <option value="pending">Beklemede</option>
            <option value="approved">Onaylandı</option>
            <option value="rejected">Reddedildi</option>
          </select>
        </div>
        <div className="filter-container">
          <select
            value={facultyFilter}
            onChange={handleFacultyFilter}
            className="filter-select"
          >
            <option value="all">Tüm Fakülteler</option>
            {faculties.map((faculty) => (
              <option key={faculty} value={faculty}>
                {faculty}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="stats-summary">
        <div className="stat-item">
          <span className="stat-value">{applications.length}</span>
          <span className="stat-label">Toplam Başvuru</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">
            {applications.filter((app) => app.status === "pending").length}
          </span>
          <span className="stat-label">Bekleyen</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">
            {applications.filter((app) => app.status === "approved").length}
          </span>
          <span className="stat-label">Onaylanan</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">
            {applications.filter((app) => app.status === "rejected").length}
          </span>
          <span className="stat-label">Reddedilen</span>
        </div>
      </div>

      {filteredApplications.length === 0 ? (
        <div className="no-data">
          <p>Başvuru bulunamadı.</p>
        </div>
      ) : (
        <div className="applications-table">
          <table>
            <thead>
              <tr>
                <th>Başvuru Tarihi</th>
                <th>Aday</th>
                <th>İlan</th>
                <th>Fakülte/Birim</th>
                <th>Bölüm</th>
                <th>Durum</th>
                <th>Jüri Ataması</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.map((application) => (
                <tr key={application.id}>
                  <td>
                    {new Date(application.createdAt).toLocaleDateString(
                      "tr-TR"
                    )}
                  </td>
                  <td>
                    {application.user?.name} {application.user?.surname}
                  </td>
                  <td>{application.announcement?.title || "Bilgi Yok"}</td>
                  <td>{application.announcement?.faculty || "Bilgi Yok"}</td>
                  <td>{application.announcement?.department || "Bilgi Yok"}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        application.status === "pending"
                          ? "pending"
                          : application.status === "approved"
                          ? "approved"
                          : "rejected"
                      }`}
                    >
                      {application.status === "pending" && "Beklemede"}
                      {application.status === "approved" && "Onaylandı"}
                      {application.status === "rejected" && "Reddedildi"}
                    </span>
                  </td>
                  <td>
                    {application.evaluations &&
                    application.evaluations.length > 0 ? (
                      <span className="jury-assigned">
                        <i className="fas fa-check-circle"></i> Atandı (
                        {application.evaluations.length})
                      </span>
                    ) : (
                      <span className="jury-not-assigned">
                        <i className="fas fa-exclamation-circle"></i> Atanmadı
                      </span>
                    )}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <Link
                        to={`/admin/applications/${application.id}`}
                        className="btn btn-sm btn-secondary"
                        title="Görüntüle"
                      >
                        <i className="fas fa-eye"></i>
                      </Link>
                      <Link
                        to={`/admin/assign-jury/${application.id}`}
                        className="btn btn-sm btn-primary"
                        title="Jüri Ata"
                      >
                        <i className="fas fa-user-tie"></i>
                      </Link>
                      <Link
                        to={`/admin/applications/${application.id}/edit`}
                        className="btn btn-sm btn-warning"
                        title="Düzenle"
                      >
                        <i className="fas fa-edit"></i>
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
  );
};

export default Applications;
