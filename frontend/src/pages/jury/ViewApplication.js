"use client";

import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "../admin/AdminStyles.css";

const ViewApplication = () => {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [application, setApplication] = useState(null);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        setLoading(true);
        // In a real app, this would be an API call to fetch the application details
        // For now, we'll simulate it with a timeout
        setTimeout(() => {
          setApplication({
            id,
            applicantName: "Ahmet Yılmaz",
            position: "Dr. Öğretim Üyesi",
            department: "Bilgisayar Mühendisliği",
            faculty: "Mühendislik Fakültesi",
            status: "in_progress",
            dueDate: "2025-05-15",
            documents: [
              {
                id: "1",
                name: "Özgeçmiş",
                fileUrl: "/documents/cv.pdf",
                uploadDate: "2025-01-15",
              },
              {
                id: "2",
                name: "Yayın Listesi",
                fileUrl: "/documents/publications.pdf",
                uploadDate: "2025-01-15",
              },
              {
                id: "3",
                name: "Diploma",
                fileUrl: "/documents/diploma.pdf",
                uploadDate: "2025-01-15",
              },
            ],
            publications: [
              {
                id: "1",
                title: "Yapay Zeka Uygulamaları",
                journal: "Bilgisayar Bilimleri Dergisi",
                year: 2024,
                category: "A1",
                isMainAuthor: true,
                points: 60,
                fileUrl: "/documents/pub1.pdf",
              },
              {
                id: "2",
                title: "Veri Madenciliği Teknikleri",
                journal: "Veri Bilimi Dergisi",
                year: 2023,
                category: "A2",
                isMainAuthor: true,
                points: 55,
                fileUrl: "/documents/pub2.pdf",
              },
            ],
            citations: [
              {
                id: "1",
                title: "Yapay Zeka Uygulamaları",
                source: "Google Scholar",
                year: 2024,
                points: 4,
                count: 12,
              },
            ],
            totalPoints: 175,
            categoryPoints: {
              A1: 60,
              A2: 55,
              A3: 0,
              A4: 0,
              A5: 0,
            },
          });
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError("Başvuru bilgileri yüklenirken bir hata oluştu.");
        setLoading(false);
        console.error("Error fetching application:", err);
      }
    };

    fetchApplication();
  }, [id]);

  if (loading) {
    return <div className="loading">Başvuru bilgileri yükleniyor...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Başvuru Detayları</h1>
        <Link to="/jury/dashboard" className="btn-secondary">
          Jüri Paneline Dön
        </Link>
      </div>

      <div className="application-details">
        <h2>Başvuru Bilgileri</h2>
        <div className="detail-card">
          <div className="detail-row">
            <div className="detail-label">Aday:</div>
            <div className="detail-value">{application.applicantName}</div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Pozisyon:</div>
            <div className="detail-value">{application.position}</div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Bölüm:</div>
            <div className="detail-value">{application.department}</div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Fakülte:</div>
            <div className="detail-value">{application.faculty}</div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Son Değerlendirme Tarihi:</div>
            <div className="detail-value">
              {new Date(application.dueDate).toLocaleDateString()}
            </div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Toplam Puan:</div>
            <div className="detail-value">{application.totalPoints}</div>
          </div>
        </div>
      </div>

      <div className="category-points">
        <h2>Kategori Puanları</h2>
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Kategori</th>
                <th>Puan</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(application.categoryPoints).map(
                ([category, points]) => (
                  <tr key={category}>
                    <td>{category}</td>
                    <td>{points}</td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="application-documents">
        <h2>Başvuru Belgeleri</h2>
        <div className="documents-list">
          {application.documents.map((doc) => (
            <div key={doc.id} className="document-item">
              <div className="document-icon">📄</div>
              <div className="document-info">
                <div className="document-name">{doc.name}</div>
                <div className="document-date">
                  Yükleme Tarihi:{" "}
                  {new Date(doc.uploadDate).toLocaleDateString()}
                </div>
              </div>
              <a
                href={doc.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-icon"
                title="Görüntüle"
              >
                👁️
              </a>
              <a href={doc.fileUrl} download className="btn-icon" title="İndir">
                ⬇️
              </a>
            </div>
          ))}
        </div>
      </div>

      <div className="application-publications">
        <h2>Yayınlar</h2>
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Başlık</th>
                <th>Dergi</th>
                <th>Yıl</th>
                <th>Kategori</th>
                <th>Başlıca Yazar</th>
                <th>Puan</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {application.publications.map((pub) => (
                <tr key={pub.id}>
                  <td>{pub.title}</td>
                  <td>{pub.journal}</td>
                  <td>{pub.year}</td>
                  <td>{pub.category}</td>
                  <td>{pub.isMainAuthor ? "Evet" : "Hayır"}</td>
                  <td>{pub.points}</td>
                  <td>
                    <div className="action-buttons">
                      <a
                        href={pub.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-icon"
                        title="Görüntüle"
                      >
                        👁️
                      </a>
                      <a
                        href={pub.fileUrl}
                        download
                        className="btn-icon"
                        title="İndir"
                      >
                        ⬇️
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="application-citations">
        <h2>Atıflar</h2>
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Başlık</th>
                <th>Kaynak</th>
                <th>Yıl</th>
                <th>Atıf Sayısı</th>
                <th>Puan</th>
              </tr>
            </thead>
            <tbody>
              {application.citations.map((citation) => (
                <tr key={citation.id}>
                  <td>{citation.title}</td>
                  <td>{citation.source}</td>
                  <td>{citation.year}</td>
                  <td>{citation.count}</td>
                  <td>{citation.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="action-buttons-container">
        <Link to={`/jury/evaluate/${id}`} className="btn-primary">
          Değerlendirmeye Başla
        </Link>
        <Link to="/jury/dashboard" className="btn-secondary">
          Jüri Paneline Dön
        </Link>
      </div>
    </div>
  );
};

export default ViewApplication;
