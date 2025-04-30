"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./AdminStyles.css";

const ApplicationDetail = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const response = await fetch(
          `http://localhost:5000/api/applications/${applicationId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Başvuru bilgileri yüklenirken bir hata oluştu");
        }

        const data = await response.json();
        setApplication(data);
        setError(null);
      } catch (err) {
        setError("Başvuru yüklenirken hata: " + err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    //fetchApplication();
  }, [applicationId]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const getStatusText = (status) => {
    switch (status) {
      case "draft":
        return "Taslak";
      case "submitted":
        return "Gönderildi";
      case "under_review":
        return "İncelemede";
      case "approved":
        return "Onaylandı";
      case "rejected":
        return "Reddedildi";
      default:
        return status;
    }
  };

  const getJuryStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Beklemede";
      case "in_progress":
        return "İncelemede";
      case "completed":
        return "Tamamlandı";
      default:
        return status;
    }
  };

  const assignJury = () => {
    navigate(`/admin/applications/${applicationId}/assign-jury`);
  };

  if (loading) {
    return <div className="loading">Başvuru bilgileri yükleniyor...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!application) {
    return <div className="error-message">Başvuru bulunamadı.</div>;
  }

  return (
    <div className="admin-container">
      <div className="page-header">
        <h1 className="admin-title">Başvuru Detayı</h1>
        <button
          className="btn btn-secondary"
          onClick={() =>
            navigate(
              `/admin/job-postings/${application.jobPosting._id}/applications`
            )
          }
        >
          Başvurulara Dön
        </button>
      </div>

      <div className="application-header">
        <div className="application-info">
          <h2>{application.applicant.name}</h2>
          <div className="application-meta">
            <span className={`status-badge status-${application.status}`}>
              {getStatusText(application.status)}
            </span>
            <span className="application-date">
              Başvuru Tarihi:{" "}
              {application.submissionDate
                ? new Date(application.submissionDate).toLocaleDateString()
                : "Henüz Gönderilmedi"}
            </span>
          </div>
        </div>

        <div className="application-actions">
          {application.status === "submitted" && (
            <button className="btn btn-primary" onClick={assignJury}>
              Jüri Ata
            </button>
          )}
        </div>
      </div>

      <div className="job-details">
        <h3>İlan Bilgileri</h3>
        <div className="job-info">
          <p>
            <strong>İlan:</strong> {application.jobPosting.title}
          </p>
          <p>
            <strong>Fakülte:</strong> {application.jobPosting.faculty}
          </p>
          <p>
            <strong>Bölüm:</strong> {application.jobPosting.department}
          </p>
          <p>
            <strong>Pozisyon:</strong> {application.jobPosting.position}
          </p>
        </div>
      </div>

      <div className="application-tabs">
        <button
          className={`tab-button ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => handleTabChange("overview")}
        >
          Genel Bakış
        </button>
        <button
          className={`tab-button ${activeTab === "documents" ? "active" : ""}`}
          onClick={() => handleTabChange("documents")}
        >
          Belgeler
        </button>
        <button
          className={`tab-button ${
            activeTab === "publications" ? "active" : ""
          }`}
          onClick={() => handleTabChange("publications")}
        >
          Yayınlar
        </button>
        <button
          className={`tab-button ${activeTab === "jury" ? "active" : ""}`}
          onClick={() => handleTabChange("jury")}
        >
          Jüri Değerlendirmesi
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "overview" && (
          <div className="overview-tab">
            <div className="applicant-details">
              <h3>Aday Bilgileri</h3>
              <div className="applicant-info">
                <p>
                  <strong>Ad Soyad:</strong> {application.applicant.name}
                </p>
                <p>
                  <strong>E-posta:</strong> {application.applicant.email}
                </p>
                <p>
                  <strong>Toplam Puan:</strong> {application.totalPoints}
                </p>
              </div>
            </div>

            <div className="points-summary">
              <h3>Puan Özeti</h3>
              <div className="category-points">
                {Object.entries(application.categoryPoints || {}).map(
                  ([category, points]) =>
                    points > 0 && (
                      <div key={category} className="category-point-item">
                        <span className="category-label">
                          Kategori {category}:
                        </span>
                        <span className="category-value">{points} puan</span>
                      </div>
                    )
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "documents" && (
          <div className="documents-tab">
            <h3>Yüklenen Belgeler</h3>
            {application.documents && application.documents.length > 0 ? (
              <div className="documents-list">
                {application.documents.map((doc, index) => (
                  <div key={index} className="document-item">
                    <div className="document-info">
                      <h4>{doc.name}</h4>
                      {doc.description && <p>{doc.description}</p>}
                      <p className="upload-date">
                        Yükleme Tarihi:{" "}
                        {new Date(doc.uploadDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="document-actions">
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-view-doc"
                      >
                        Görüntüle
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-message">Henüz belge yüklenmemiş.</p>
            )}
          </div>
        )}

        {activeTab === "publications" && (
          <div className="publications-tab">
            <h3>Yayınlar</h3>
            {application.publications && application.publications.length > 0 ? (
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Başlık</th>
                      <th>Dergi</th>
                      <th>Yıl</th>
                      <th>Kategori</th>
                      <th>Ana Yazar</th>
                      <th>Puan</th>
                      <th>Dosya</th>
                    </tr>
                  </thead>
                  <tbody>
                    {application.publications.map((pub, index) => (
                      <tr key={index}>
                        <td>{pub.title}</td>
                        <td>{pub.journal}</td>
                        <td>{pub.year}</td>
                        <td>{pub.category}</td>
                        <td>{pub.isMainAuthor ? "Evet" : "Hayır"}</td>
                        <td>{pub.points}</td>
                        <td>
                          {pub.fileUrl ? (
                            <a
                              href={pub.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-view-doc"
                            >
                              Görüntüle
                            </a>
                          ) : (
                            "Dosya yok"
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="empty-message">Henüz yayın eklenmemiş.</p>
            )}
          </div>
        )}

        {activeTab === "jury" && (
          <div className="jury-tab">
            <div className="jury-header">
              <h3>Jüri Değerlendirmesi</h3>
              {application.status === "submitted" && (
                <button className="btn btn-primary" onClick={assignJury}>
                  Jüri Ata
                </button>
              )}
            </div>

            {application.juryMembers && application.juryMembers.length > 0 ? (
              <div className="jury-evaluations">
                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Jüri Üyesi</th>
                        <th>Durum</th>
                        <th>Karar</th>
                        <th>Değerlendirme Tarihi</th>
                        <th>Rapor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {application.juryMembers.map((jury, index) => (
                        <tr key={index}>
                          <td>{jury.juryMember.name}</td>
                          <td>
                            <span
                              className={`status-badge status-${jury.status}`}
                            >
                              {getJuryStatusText(jury.status)}
                            </span>
                          </td>
                          <td>
                            {jury.evaluation && jury.evaluation.decision ? (
                              <span
                                className={`decision-badge ${
                                  jury.evaluation.decision === "positive"
                                    ? "positive"
                                    : "negative"
                                }`}
                              >
                                {jury.evaluation.decision === "positive"
                                  ? "Olumlu"
                                  : "Olumsuz"}
                              </span>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td>
                            {jury.evaluation && jury.evaluation.submissionDate
                              ? new Date(
                                  jury.evaluation.submissionDate
                                ).toLocaleDateString()
                              : "-"}
                          </td>
                          <td>
                            {jury.evaluation && jury.evaluation.reportUrl ? (
                              <a
                                href={jury.evaluation.reportUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-view-doc"
                              >
                                Raporu Görüntüle
                              </a>
                            ) : (
                              "Rapor yok"
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {application.finalDecision &&
                  application.finalDecision.decision && (
                    <div className="final-decision">
                      <h4>Nihai Karar</h4>
                      <div className="decision-info">
                        <p>
                          <strong>Karar:</strong>
                          <span
                            className={`decision-badge ${
                              application.finalDecision.decision === "approved"
                                ? "positive"
                                : "negative"
                            }`}
                          >
                            {application.finalDecision.decision === "approved"
                              ? "Onaylandı"
                              : "Reddedildi"}
                          </span>
                        </p>
                        <p>
                          <strong>Açıklama:</strong>{" "}
                          {application.finalDecision.comments || "-"}
                        </p>
                        <p>
                          <strong>Karar Tarihi:</strong>{" "}
                          {new Date(
                            application.finalDecision.decisionDate
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}
              </div>
            ) : (
              <p className="empty-message">Henüz jüri ataması yapılmamış.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationDetail;
