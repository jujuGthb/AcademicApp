"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import "./JobPostingDetail.css"

const JobPostingDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [jobPosting, setJobPosting] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [applying, setApplying] = useState(false)
  const [applicationSuccess, setApplicationSuccess] = useState(false)

  useEffect(() => {
    const fetchJobPosting = async () => {
      try {
        setLoading(true)
        const response = await fetch(`http://localhost:5000/api/job-postings/${id}`)

        if (!response.ok) {
          throw new Error("İş ilanı alınamadı")
        }

        const data = await response.json()
        setJobPosting(data)
        setError(null)
      } catch (err) {
        setError("İş ilanı alınırken bir hata oluştu.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchJobPosting()
  }, [id])

  const handleApply = async () => {
    try {
      setApplying(true)
      const token = localStorage.getItem("token")

      // Create a simple application
      const response = await fetch("http://localhost:5000/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify({
          jobPostingId: id,
          // In a real application, you would include activityIds or reportId
        }),
      })

      if (!response.ok) {
        throw new Error("Başvuru yapılamadı")
      }

      setApplicationSuccess(true)

      // Redirect to applications page after a delay
      setTimeout(() => {
        navigate("/candidate/applications")
      }, 2000)
    } catch (err) {
      setError("Başvuru yapılırken bir hata oluştu.")
      console.error(err)
    } finally {
      setApplying(false)
    }
  }

  if (loading) {
    return <div className="loading">İş ilanı yükleniyor...</div>
  }

  if (error) {
    return <div className="error-message">{error}</div>
  }

  if (!jobPosting) {
    return <div className="error-message">İş ilanı bulunamadı.</div>
  }

  return (
    <div className="job-posting-detail">
      <h1>{jobPosting.title}</h1>

      <div className="job-posting-info">
        <div className="info-section">
          <h2>İlan Bilgileri</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Fakülte:</span>
              <span className="info-value">{jobPosting.faculty}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Bölüm:</span>
              <span className="info-value">{jobPosting.department}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Pozisyon:</span>
              <span className="info-value">{jobPosting.position}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Alan:</span>
              <span className="info-value">{jobPosting.fieldArea}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Başlangıç Tarihi:</span>
              <span className="info-value">{new Date(jobPosting.startDate).toLocaleDateString("tr-TR")}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Bitiş Tarihi:</span>
              <span className="info-value">{new Date(jobPosting.endDate).toLocaleDateString("tr-TR")}</span>
            </div>
          </div>
        </div>

        <div className="description-section">
          <h2>Açıklama</h2>
          <p>{jobPosting.description}</p>
        </div>

        {jobPosting.requiredDocuments && jobPosting.requiredDocuments.length > 0 && (
          <div className="documents-section">
            <h2>Gerekli Belgeler</h2>
            <ul className="documents-list">
              {jobPosting.requiredDocuments.map((doc, index) => (
                <li key={index} className={doc.required ? "required" : ""}>
                  {doc.name}
                  {doc.required && <span className="required-badge">Zorunlu</span>}
                  {doc.description && <p className="document-description">{doc.description}</p>}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="application-section">
          <h2>Başvuru</h2>
          {applicationSuccess ? (
            <div className="success-message">
              Başvurunuz başarıyla alınmıştır. Başvurularım sayfasına yönlendiriliyorsunuz...
            </div>
          ) : (
            <>
              <p>Bu ilana başvurmak için aşağıdaki butona tıklayın.</p>
              <p className="note">Not: Başvuru yapmadan önce faaliyetlerinizi sisteme eklemeniz gerekmektedir.</p>
              <div className="action-buttons">
                <button className="btn btn-primary" onClick={handleApply} disabled={applying}>
                  {applying ? "Başvuru Yapılıyor..." : "Başvuru Yap"}
                </button>
                <button className="btn btn-secondary" onClick={() => navigate("/candidate/activities")}>
                  Faaliyetlerime Git
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default JobPostingDetail
