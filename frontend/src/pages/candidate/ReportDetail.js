"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import ReportService from "../../services/report-service";
import { formatDate } from "../../utils/formatters";
import "./ReportDetail.css";

const ReportDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [activities, setActivities] = useState([]);
  const [criteriaCheck, setCriteriaCheck] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (!id) return;

        const reportData = await ReportService.getReportById(id);
        setReport(reportData);

        const activitiesData = await ReportService.getReportActivities(id);
        setActivities(activitiesData);

        const criteriaData = await ReportService.checkReportCriteria(id);
        setCriteriaCheck(criteriaData);

        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch report data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleStatusChange = async (status) => {
    if (
      !id ||
      !window.confirm(
        `Rapor durumunu "${getStatusText(
          status
        )}" olarak değiştirmek istediğinizden emin misiniz?`
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      const updatedReport = await ReportService.updateReportStatus(id, status);
      setReport(updatedReport);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update report status");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !id ||
      !window.confirm("Bu raporu silmek istediğinizden emin misiniz?")
    ) {
      return;
    }

    try {
      setLoading(true);
      await ReportService.deleteReport(id);
      navigate("/candidate/reports");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete report");
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Yükleniyor...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!report) {
    return <div className="error-message">Rapor bulunamadı</div>;
  }

  return (
    <div className="report-detail">
      <div className="report-detail-header">
        <h1>Rapor Detayı</h1>
        <div className="report-detail-actions">
          {report.status === "draft" && (
            <>
              <button
                onClick={() => handleStatusChange("submitted")}
                className="btn btn-primary"
              >
                Raporu Gönder
              </button>
              <button onClick={handleDelete} className="btn btn-danger">
                Sil
              </button>
            </>
          )}
          {report.status === "rejected" && (
            <button
              onClick={() => handleStatusChange("draft")}
              className="btn btn-secondary"
            >
              Taslağa Dönüştür
            </button>
          )}
        </div>
      </div>

      <div className="report-detail-card">
        <div className="report-detail-section">
          <h2>Genel Bilgiler</h2>
          <div className="report-detail-row">
            <span className="report-detail-label">Hedef Ünvan:</span>
            <span className="report-detail-value">{report.targetTitle}</span>
          </div>
          <div className="report-detail-row">
            <span className="report-detail-label">İlk Atama:</span>
            <span className="report-detail-value">
              {report.isFirstAppointment ? "Evet" : "Hayır"}
            </span>
          </div>
          <div className="report-detail-row">
            <span className="report-detail-label">Başlangıç Tarihi:</span>
            <span className="report-detail-value">
              {formatDate(report.startDate)}
            </span>
          </div>
          <div className="report-detail-row">
            <span className="report-detail-label">Bitiş Tarihi:</span>
            <span className="report-detail-value">
              {formatDate(report.endDate)}
            </span>
          </div>
          <div className="report-detail-row">
            <span className="report-detail-label">Durum:</span>
            <span className={`report-detail-value status-${report.status}`}>
              {getStatusText(report.status)}
            </span>
          </div>
          {report.submittedAt && (
            <div className="report-detail-row">
              <span className="report-detail-label">Gönderim Tarihi:</span>
              <span className="report-detail-value">
                {formatDate(report.submittedAt)}
              </span>
            </div>
          )}
          {report.reviewNotes && (
            <div className="report-detail-row">
              <span className="report-detail-label">
                Değerlendirme Notları:
              </span>
              <span className="report-detail-value">{report.reviewNotes}</span>
            </div>
          )}
        </div>

        <div className="report-detail-section">
          <h2>Puan Özeti</h2>
          <div className="report-detail-row">
            <span className="report-detail-label">Toplam Puan:</span>
            <span className="report-detail-value">
              {report.totalPoints.toFixed(2)}
            </span>
          </div>

          <h3>Kategori Puanları</h3>
          <div className="report-category-points">
            {Object.entries(report.categoryPoints).map(
              ([category, points]) =>
                points > 0 && (
                  <div key={category} className="report-category-point-item">
                    <span className="report-category-label">
                      {category} - {getCategoryName(category)}:
                    </span>
                    <span className="report-category-value">
                      {points.toFixed(2)}
                    </span>
                  </div>
                )
            )}
          </div>

          <h3>Faaliyet Sayıları</h3>
          <div className="report-activity-counts">
            {Object.entries(report.activityCounts).map(
              ([countType, count]) =>
                count > 0 && (
                  <div key={countType} className="report-count-item">
                    <span className="report-count-label">
                      {getCountTypeName(countType)}:
                    </span>
                    <span className="report-count-value">{count}</span>
                  </div>
                )
            )}
          </div>
        </div>

        {criteriaCheck && (
          <div className="report-detail-section">
            <h2>Kriter Kontrolü</h2>
            <div className="report-criteria-result">
              <div
                className={`report-criteria-status ${
                  criteriaCheck.meetsRequirements ? "success" : "error"
                }`}
              >
                {criteriaCheck.meetsRequirements
                  ? "Bu rapor kriterleri karşılıyor"
                  : "Bu rapor kriterleri karşılamıyor"}
              </div>

              <h3>Toplam Puan</h3>
              <div
                className={`report-criteria-item ${
                  criteriaCheck.details.totalPoints.meets ? "success" : "error"
                }`}
              >
                <span>
                  Gerekli: {criteriaCheck.details.totalPoints.required}
                </span>
                <span>
                  Mevcut: {criteriaCheck.details.totalPoints.actual.toFixed(2)}
                </span>
              </div>

              {Object.keys(criteriaCheck.details.categoryPoints).length > 0 && (
                <>
                  <h3>Kategori Puanları</h3>
                  {Object.entries(criteriaCheck.details.categoryPoints).map(
                    ([category, detail]) => (
                      <div
                        key={category}
                        className={`report-criteria-item ${
                          detail.meets ? "success" : "error"
                        }`}
                      >
                        <span>
                          {category} - {getCategoryName(category)}:
                        </span>
                        <span>Gerekli: {detail.required}</span>
                        <span>Mevcut: {detail.actual.toFixed(2)}</span>
                      </div>
                    )
                  )}
                </>
              )}

              {Object.keys(criteriaCheck.details.activityCounts).length > 0 && (
                <>
                  <h3>Faaliyet Sayıları</h3>
                  {Object.entries(criteriaCheck.details.activityCounts).map(
                    ([countType, detail]) => (
                      <div
                        key={countType}
                        className={`report-criteria-item ${
                          detail.meets ? "success" : "error"
                        }`}
                      >
                        <span>{getCountTypeName(countType)}:</span>
                        <span>Gerekli: {detail.required}</span>
                        <span>Mevcut: {detail.actual}</span>
                      </div>
                    )
                  )}
                </>
              )}

              {Object.keys(criteriaCheck.details.maximumLimits).length > 0 && (
                <>
                  <h3>Maksimum Limitler</h3>
                  {Object.entries(criteriaCheck.details.maximumLimits).map(
                    ([category, detail]) => (
                      <div
                        key={category}
                        className={`report-criteria-item ${
                          !detail.exceeds ? "success" : "warning"
                        }`}
                      >
                        <span>
                          {category} - {getCategoryName(category)}:
                        </span>
                        <span>Limit: {detail.limit}</span>
                        <span>Mevcut: {detail.actual.toFixed(2)}</span>
                        {detail.exceeds && (
                          <span className="report-criteria-note">
                            Not: Bu kategoride limit aşımı var. Değerlendirmede{" "}
                            {detail.adjusted} puan dikkate alınacaktır.
                          </span>
                        )}
                      </div>
                    )
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {activities.length > 0 && (
          <div className="report-detail-section">
            <h2>Faaliyetler</h2>
            <div className="report-activities-list">
              {activities.map((activity) => (
                <div key={activity._id} className="report-activity-item">
                  <div className="report-activity-header">
                    <span className="report-activity-category">
                      {activity.category} - {getCategoryName(activity.category)}
                    </span>
                    <span className="report-activity-date">
                      {formatDate(activity.date)}
                    </span>
                  </div>
                  <h3 className="report-activity-title">{activity.title}</h3>
                  {activity.authors && (
                    <p className="report-activity-authors">
                      {activity.authors}
                    </p>
                  )}
                  <div className="report-activity-points">
                    <span>Baz Puan: {activity.basePoints}</span>
                    <span>
                      Hesaplanan Puan: {activity.calculatedPoints.toFixed(2)}
                    </span>
                  </div>
                  <Link
                    to={`/candidate/activities/${activity._id}`}
                    className="report-activity-link"
                  >
                    Detayları Görüntüle
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {report.attachments && report.attachments.length > 0 && (
          <div className="report-detail-section">
            <h2>Ekler</h2>
            <ul className="report-attachments-list">
              {report.attachments.map((attachment) => (
                <li key={attachment._id} className="report-attachment-item">
                  <a
                    href={`http://localhost:5000/${attachment.path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="report-attachment-link"
                  >
                    {attachment.name}
                  </a>
                  <span className="report-attachment-date">
                    {formatDate(attachment.uploadDate)}
                  </span>
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
    draft: "Taslak",
    submitted: "Gönderildi",
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

export default ReportDetail;
