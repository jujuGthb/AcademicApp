"use client";

import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "../admin/AdminStyles.css";

const EvaluateApplication = () => {
  const { id } = useParams();
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [application, setApplication] = useState(null);
  const [evaluation, setEvaluation] = useState({
    decision: "",
    comments: "",
    reportFile: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEvaluation({
      ...evaluation,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setEvaluation({
      ...evaluation,
      reportFile: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!evaluation.decision) {
      setError("Lütfen bir karar seçiniz (Olumlu/Olumsuz).");
      return;
    }

    if (!evaluation.reportFile) {
      setError("Lütfen değerlendirme raporunuzu yükleyiniz.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      // In a real app, this would be an API call to submit the evaluation
      // For now, we'll simulate it with a timeout
      setTimeout(() => {
        console.log("Evaluation submitted:", {
          applicationId: id,
          juryMemberId: user.id,
          decision: evaluation.decision,
          comments: evaluation.comments,
          reportFile: evaluation.reportFile.name,
        });

        setSuccess(true);
        setSubmitting(false);

        // Redirect after a short delay
        setTimeout(() => {
          navigate("/jury/dashboard");
        }, 2000);
      }, 1500);
    } catch (err) {
      setError("Değerlendirme gönderilirken bir hata oluştu.");
      setSubmitting(false);
      console.error("Error submitting evaluation:", err);
    }
  };

  if (loading) {
    return <div className="loading">Başvuru bilgileri yükleniyor...</div>;
  }

  if (error && !application) {
    return <div className="error-message">{error}</div>;
  }

  if (success) {
    return (
      <div className="success-container">
        <div className="success-message">
          <h2>Değerlendirme Başarıyla Gönderildi!</h2>
          <p>Değerlendirmeniz sistem tarafından kaydedilmiştir.</p>
          <p>Jüri paneline yönlendiriliyorsunuz...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Başvuru Değerlendirme</h1>
        <Link to="/jury/dashboard" className="btn-secondary">
          Jüri Paneline Dön
        </Link>
      </div>

      {error && <div className="error-message">{error}</div>}

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

      <div className="evaluation-form-container">
        <h2>Değerlendirme Formu</h2>
        <form onSubmit={handleSubmit} className="evaluation-form">
          <div className="form-group">
            <label htmlFor="decision">Nihai Değerlendirme Kararı:</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="decision"
                  value="positive"
                  checked={evaluation.decision === "positive"}
                  onChange={handleInputChange}
                />
                Olumlu
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="decision"
                  value="negative"
                  checked={evaluation.decision === "negative"}
                  onChange={handleInputChange}
                />
                Olumsuz
              </label>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="comments">Değerlendirme Yorumu:</label>
            <textarea
              id="comments"
              name="comments"
              value={evaluation.comments}
              onChange={handleInputChange}
              rows="5"
              placeholder="Değerlendirme yorumunuzu buraya yazınız..."
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="reportFile">Değerlendirme Raporu (PDF):</label>
            <input
              type="file"
              id="reportFile"
              name="reportFile"
              accept=".pdf"
              onChange={handleFileChange}
            />
            <small>
              Lütfen değerlendirme raporunuzu PDF formatında yükleyiniz.
            </small>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? "Gönderiliyor..." : "Değerlendirmeyi Tamamla"}
            </button>
            <Link to="/jury/dashboard" className="btn-secondary">
              İptal
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EvaluateApplication;
