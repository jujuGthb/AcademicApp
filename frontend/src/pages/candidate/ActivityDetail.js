"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import ActivityService from "../../services/activity-service";
import { formatDate } from "../../utils/formatters";
import "./ActivityDetail.css";

const ActivityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        setLoading(true);
        if (!id) return;

        const data = await ActivityService.getActivityById(id);
        setActivity(data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch activity");
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [id]);

  const handleDelete = async () => {
    if (
      !id ||
      !window.confirm("Bu faaliyeti silmek istediğinizden emin misiniz?")
    ) {
      return;
    }

    try {
      setLoading(true);
      await ActivityService.deleteActivity(id);
      navigate("/candidate/activities");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete activity");
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Yükleniyor...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!activity) {
    return <div className="error-message">Faaliyet bulunamadı</div>;
  }

  return (
    <div className="activity-detail">
      <div className="activity-detail-header">
        <h1>Faaliyet Detayı</h1>
        <div className="activity-detail-actions">
          <Link
            to={`/candidate/activities/edit/${id}`}
            className="btn btn-secondary"
          >
            Düzenle
          </Link>
          <button onClick={handleDelete} className="btn btn-danger">
            Sil
          </button>
        </div>
      </div>

      <div className="activity-detail-card">
        <div className="activity-detail-section">
          <h2>Genel Bilgiler</h2>
          <div className="activity-detail-row">
            <span className="activity-detail-label">Kategori:</span>
            <span className="activity-detail-value">
              {activity.category} - {getCategoryName(activity.category)}
            </span>
          </div>
          <div className="activity-detail-row">
            <span className="activity-detail-label">Alt Kategori:</span>
            <span className="activity-detail-value">
              {activity.subcategory}
            </span>
          </div>
          <div className="activity-detail-row">
            <span className="activity-detail-label">Başlık:</span>
            <span className="activity-detail-value">{activity.title}</span>
          </div>
          {activity.description && (
            <div className="activity-detail-row">
              <span className="activity-detail-label">Açıklama:</span>
              <span className="activity-detail-value">
                {activity.description}
              </span>
            </div>
          )}
          <div className="activity-detail-row">
            <span className="activity-detail-label">Tarih:</span>
            <span className="activity-detail-value">
              {formatDate(activity.date)}
            </span>
          </div>
        </div>

        {activity.category === "A" && (
          <div className="activity-detail-section">
            <h2>Yayın Bilgileri</h2>
            {activity.journal && (
              <div className="activity-detail-row">
                <span className="activity-detail-label">Dergi:</span>
                <span className="activity-detail-value">
                  {activity.journal}
                </span>
              </div>
            )}
            {activity.volume && (
              <div className="activity-detail-row">
                <span className="activity-detail-label">Cilt:</span>
                <span className="activity-detail-value">{activity.volume}</span>
              </div>
            )}
            {activity.issue && (
              <div className="activity-detail-row">
                <span className="activity-detail-label">Sayı:</span>
                <span className="activity-detail-value">{activity.issue}</span>
              </div>
            )}
            {activity.pages && (
              <div className="activity-detail-row">
                <span className="activity-detail-label">Sayfalar:</span>
                <span className="activity-detail-value">{activity.pages}</span>
              </div>
            )}
            {activity.doi && (
              <div className="activity-detail-row">
                <span className="activity-detail-label">DOI:</span>
                <span className="activity-detail-value">{activity.doi}</span>
              </div>
            )}
            {activity.indexType && (
              <div className="activity-detail-row">
                <span className="activity-detail-label">İndeks Türü:</span>
                <span className="activity-detail-value">
                  {activity.indexType}
                </span>
              </div>
            )}
            {activity.quartile && (
              <div className="activity-detail-row">
                <span className="activity-detail-label">Çeyreklik (Q):</span>
                <span className="activity-detail-value">
                  {activity.quartile}
                </span>
              </div>
            )}
          </div>
        )}

        <div className="activity-detail-section">
          <h2>Yazar Bilgileri</h2>
          {activity.authors && (
            <div className="activity-detail-row">
              <span className="activity-detail-label">Yazarlar:</span>
              <span className="activity-detail-value">{activity.authors}</span>
            </div>
          )}
          <div className="activity-detail-row">
            <span className="activity-detail-label">Yazar Sayısı:</span>
            <span className="activity-detail-value">
              {activity.authorCount}
            </span>
          </div>
          <div className="activity-detail-row">
            <span className="activity-detail-label">Başlıca Yazar:</span>
            <span className="activity-detail-value">
              {activity.isMainAuthor ? "Evet" : "Hayır"}
            </span>
          </div>
        </div>

        <div className="activity-detail-section">
          <h2>Puan Bilgileri</h2>
          <div className="activity-detail-row">
            <span className="activity-detail-label">Baz Puan:</span>
            <span className="activity-detail-value">{activity.basePoints}</span>
          </div>
          <div className="activity-detail-row">
            <span className="activity-detail-label">Hesaplanan Puan:</span>
            <span className="activity-detail-value">
              {activity.calculatedPoints.toFixed(2)}
            </span>
          </div>
        </div>

        {activity.attachments && activity.attachments.length > 0 && (
          <div className="activity-detail-section">
            <h2>Ekler</h2>
            <ul className="activity-attachments-list">
              {activity.attachments.map((attachment) => (
                <li key={attachment._id} className="activity-attachment-item">
                  <a
                    href={`http://localhost:5000/${attachment.path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="activity-attachment-link"
                  >
                    {attachment.name}
                  </a>
                  <span className="activity-attachment-date">
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

// Helper function to get category name
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

export default ActivityDetail;
