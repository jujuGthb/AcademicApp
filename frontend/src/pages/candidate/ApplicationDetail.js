"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ApplicationService from "../../services/application-service";
import { formatDate } from "../../utils/formatters";
import "./ApplicationDetail.css";

const ApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        setLoading(true);
        if (!id) return;

        const data = await ApplicationService.getApplicationById(id);
        setApplication(data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch application");
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

  const handleDelete = async () => {
    if (
      !id ||
      !window.confirm("Bu başvuruyu silmek istediğinizden emin misiniz?")
    ) {
      return;
    }

    try {
      setLoading(true);
      await ApplicationService.deleteApplication(id);
      navigate("/candidate/applications");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete application");
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Yükleniyor...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!application) {
    return <div className="error-message">Başvuru bulunamadı</div>;
  }

  return (
    <div className="application-detail">
      <div className="application-detail-header">
        <h1>Başvuru Detayı</h1>
        <div className="application-detail-actions">
          {application.status === "pending" && (
            <button onClick={handleDelete} className="btn btn-danger">
              Başvuruyu İptal Et
            </button>
          )}
        </div>
      </div>

      <div className="application-detail-card">
        <div className="application-detail-section">
          <h2>Başvuru Bilgileri</h2>
          <div className="application-detail-row">
            <span className="application-detail-label">Başvuru Tarihi:</span>
            <span className="application-detail-value">
              {formatDate(application.createdAt)}
            </span>
          </div>
          <div className="application-detail-row">
            <span className="application-detail-label">Durum:</span>
            <span
              className={`application-detail-value status-${application.status}`}
            >
              {getStatusText(application.status)}
            </span>
          </div>
          {application.submittedAt && (
            <div className="application-detail-row">
              <span className="application-detail-label">Gönderim Tarihi:</span>
              <span className="application-detail-value">
                {formatDate(application.submittedAt)}
              </span>
            </div>
          )}
        </div>

        <div className="application-detail-section">
          <h2>İlan Bilgileri</h2>
          <div className="application-detail-row">
            <span className="application-detail-label">İlan Başlığı:</span>
            <span className="application-detail-value">
              {application.jobPosting.title}
            </span>
          </div>
          <div className="application-detail-row">
            <span className="application-detail-label">Bölüm:</span>
            <span className="application-detail-value">
              {application.jobPosting.department}
            </span>
          </div>
          <div className="application-detail-row">
            <span className="application-detail-label">Fakülte:</span>
            <span className="application-detail-value">
              {application.jobPosting.faculty}
            </span>
          </div>
          <div className="application-detail-row">
            <span className="application-detail-label">Pozisyon:</span>
            <span className="application-detail-value">
              {application.jobPosting.position}
            </span>
          </div>
        </div>

        <div className="application-detail-section">
          <h2>Puan Özeti</h2>
          <div className="application-detail-row">
            <span className="application-detail-label">Toplam Puan:</span>
            <span className="application-detail-value">
              {application.totalPoints.toFixed(2)}
            </span>
          </div>

          <h3>Kategori Puanları</h3>
          <div className="application-category-points">
            {Object.entries(application.categoryPoints).map(
              ([category, points]) =>
                points > 0 && (
                  <div
                    key={category}
                    className="application-category-point-item"
                  >
                    <span className="application-category-label">
                      {category} - {getCategoryName(category)}:
                    </span>
                    <span className="application-category-value">
                      {points.toFixed(2)}
                    </span>
                  </div>
                )
            )}
          </div>

          <h3>Faaliyet Sayıları</h3>
          <div className="application-activity-counts">
            {Object.entries(application.activityCounts).map(
              ([countType, count]) =>
                count > 0 && (
                  <div key={countType} className="application-count-item">
                    <span className="application-count-label">
                      {getCountTypeName(countType)}:
                    </span>
                    <span className="application-count-value">{count}</span>
                  </div>
                )
            )}
          </div>
        </div>

        {application.documents && application.documents.length > 0 && (
          <div className="application-detail-section">
            <h2>Belgeler</h2>
            <ul className="application-documents-list">
              {application.documents.map((document) => (
                <li key={document._id} className="application-document-item">
                  <div className="application-document-info">
                    <a
                      href={`http://localhost:5000/${document.path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="application-document-link"
                    >
                      {document.name}
                    </a>
                    <span className="application-document-category">
                      {document.category || "Genel"}
                    </span>
                    <span className="application-document-date">
                      {formatDate(document.uploadDate)}
                    </span>
                  </div>
                  <div className="application-document-status">
                    <span
                      className={`verification-status ${
                        document.verified ? "verified" : "pending"
                      }`}
                    >
                      {document.verified ? "Doğrulanmış" : "Doğrulanmamış"}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper functions
const getStatusText = (status) => {
  const statusMap = {
    pending: "Beklemede",
    under_review: "İnceleniyor",
    approved: "Onaylandı",
    rejected: "Reddedildi",
  };
  return statusMap[status] || status;
};

const getCategoryName = (category) => {
  const categories = {
    A: "Makaleler",
    B: "Bilimsel Toplantı Faaliyetleri",
    C: "Kitaplar",
    D: "Atıflar",
    E: "Eğitim Öğretim Faaliyetleri",
    F: "Tez Yöneticiliği",
    G: "Patentler",
    H: "Araştırma Projeleri",
    I: "Editörlük, Yayın Kurulu Üyeliği ve Hakemlik",
    J: "Ödüller",
    K: "İdari Görevler ve Üniversiteye Katkı",
    L: "Güzel Sanatlar Faaliyetleri",
  };
  return categories[category] || category;
};

const getCountTypeName = (countType) => {
  const countTypeMap = {
    publications: "Yayın Sayısı",
    mainAuthor: "Başlıca Yazar Olduğu Yayın Sayısı",
    projects: "Proje Sayısı",
    theses: "Tez Danışmanlığı Sayısı",
    sciPublications: "SCI/SSCI/AHCI Yayın Sayısı",
    internationalPublications: "Uluslararası Yayın Sayısı",
    nationalPublications: "Ulusal Yayın Sayısı",
    personalExhibitions: "Kişisel Sergi Sayısı",
    groupExhibitions: "Karma Sergi Sayısı",
  };
  return countTypeMap[countType] || countType;
};

export default ApplicationDetail;
