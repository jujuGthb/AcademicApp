"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { activityCategories, getSubcategories, getBasePoints } from "../utils/activityData"
import "./ActivityForm.css"

const ActivityForm = ({ user }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [formData, setFormData] = useState({
    category: "",
    subcategory: "",
    title: "",
    description: "",
    authors: "",
    date: "",
    journal: "",
    volume: "",
    issue: "",
    pages: "",
    doi: "",
    indexType: "",
    quartile: "",
    authorCount: "1",
    isMainAuthor: "false",
    basePoints: "0",
  })
  const [attachments, setAttachments] = useState([])
  const [existingAttachments, setExistingAttachments] = useState([])
  const [attachmentsToRemove, setAttachmentsToRemove] = useState([])
  const [subcategories, setSubcategories] = useState([])

  useEffect(() => {
    if (id) {
      fetchActivity()
    }
  }, [id])

  useEffect(() => {
    if (formData.category) {
      setSubcategories(getSubcategories(formData.category))
    } else {
      setSubcategories([])
    }
  }, [formData.category])

  useEffect(() => {
    if (formData.category && formData.subcategory) {
      const basePoints = getBasePoints(formData.category, formData.subcategory)
      setFormData({ ...formData, basePoints: basePoints.toString() })
    }
  }, [formData.category, formData.subcategory])

  const fetchActivity = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:5000/api/activities/${id}`, {
        headers: {
          "x-auth-token": token,
        },
      })

      if (!response.ok) {
        throw new Error("Faaliyet alınamadı")
      }

      const data = await response.json()

      setFormData({
        category: data.category,
        subcategory: data.subcategory,
        title: data.title,
        description: data.description || "",
        authors: data.authors || "",
        date: new Date(data.date).toISOString().split("T")[0],
        journal: data.journal || "",
        volume: data.volume || "",
        issue: data.issue || "",
        pages: data.pages || "",
        doi: data.doi || "",
        indexType: data.indexType || "",
        quartile: data.quartile || "",
        authorCount: data.authorCount.toString(),
        isMainAuthor: data.isMainAuthor.toString(),
        basePoints: data.basePoints.toString(),
      })

      setExistingAttachments(data.attachments || [])
      setSubcategories(getSubcategories(data.category))
    } catch (err) {
      setError("Faaliyet alınırken bir hata oluştu. Lütfen daha sonra tekrar deneyin.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    setAttachments([...e.target.files])
  }

  const handleRemoveExistingAttachment = (attachmentId) => {
    setAttachmentsToRemove([...attachmentsToRemove, attachmentId])
    setExistingAttachments(existingAttachments.filter((a) => a._id !== attachmentId))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const token = localStorage.getItem("token")
      const formDataToSend = new FormData()

      // Append form fields
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key])
      })

      // Append attachments
      attachments.forEach((file) => {
        formDataToSend.append("attachments", file)
      })

      // Append attachments to remove
      if (attachmentsToRemove.length > 0) {
        formDataToSend.append("removeAttachments", attachmentsToRemove.join(","))
      }

      const url = id ? `http://localhost:5000/api/activities/${id}` : "http://localhost:5000/api/activities"

      const method = id ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "x-auth-token": token,
        },
        body: formDataToSend,
      })

      if (!response.ok) {
        throw new Error("Faaliyet kaydedilemedi")
      }

      const data = await response.json()
      setSuccess("Faaliyet başarıyla kaydedildi")

      // Redirect after a short delay
      setTimeout(() => {
        navigate("/activities")
      }, 2000)
    } catch (err) {
      setError("Faaliyet kaydedilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading && !id) {
    return <div className="loading">Yükleniyor...</div>
  }

  return (
    <div className="activity-form-container">
      <h1>{id ? "Faaliyet Düzenle" : "Yeni Faaliyet Ekle"}</h1>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form className="activity-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="category">Kategori</label>
          <select id="category" name="category" value={formData.category} onChange={handleChange} required>
            <option value="">Seçiniz</option>
            {activityCategories.map((category) => (
              <option key={category.code} value={category.code}>
                {category.code} - {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="subcategory">Alt Kategori</label>
          <select
            id="subcategory"
            name="subcategory"
            value={formData.subcategory}
            onChange={handleChange}
            required
            disabled={!formData.category}
          >
            <option value="">Seçiniz</option>
            {subcategories.map((subcategory) => (
              <option key={subcategory.code} value={subcategory.code}>
                {subcategory.code} - {subcategory.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="title">Başlık</label>
          <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="description">Açıklama</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="authors">Yazarlar</label>
          <input
            type="text"
            id="authors"
            name="authors"
            value={formData.authors}
            onChange={handleChange}
            placeholder="Örn: Ahmet Yılmaz, Mehmet Demir, Ayşe Kaya"
          />
        </div>

        <div className="form-group">
          <label htmlFor="date">Tarih</label>
          <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} required />
        </div>

        {formData.category === "A" && (
          <>
            <div className="form-group">
              <label htmlFor="journal">Dergi</label>
              <input type="text" id="journal" name="journal" value={formData.journal} onChange={handleChange} />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="volume">Cilt</label>
                <input type="text" id="volume" name="volume" value={formData.volume} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label htmlFor="issue">Sayı</label>
                <input type="text" id="issue" name="issue" value={formData.issue} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label htmlFor="pages">Sayfalar</label>
                <input
                  type="text"
                  id="pages"
                  name="pages"
                  value={formData.pages}
                  onChange={handleChange}
                  placeholder="Örn: 123-145"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="doi">DOI</label>
              <input type="text" id="doi" name="doi" value={formData.doi} onChange={handleChange} />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="indexType">İndeks Türü</label>
                <select id="indexType" name="indexType" value={formData.indexType} onChange={handleChange}>
                  <option value="">Seçiniz</option>
                  <option value="SCI-E">SCI-E</option>
                  <option value="SSCI">SSCI</option>
                  <option value="AHCI">AHCI</option>
                  <option value="ESCI">ESCI</option>
                  <option value="Scopus">Scopus</option>
                  <option value="TR Dizin">TR Dizin</option>
                  <option value="Diğer Uluslararası">Diğer Uluslararası</option>
                  <option value="Diğer Ulusal">Diğer Ulusal</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="quartile">Çeyreklik (Q)</label>
                <select
                  id="quartile"
                  name="quartile"
                  value={formData.quartile}
                  onChange={handleChange}
                  disabled={!["SCI-E", "SSCI", "AHCI"].includes(formData.indexType)}
                >
                  <option value="">Seçiniz</option>
                  <option value="Q1">Q1</option>
                  <option value="Q2">Q2</option>
                  <option value="Q3">Q3</option>
                  <option value="Q4">Q4</option>
                </select>
              </div>
            </div>
          </>
        )}

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="authorCount">Yazar Sayısı</label>
            <input
              type="number"
              id="authorCount"
              name="authorCount"
              value={formData.authorCount}
              onChange={handleChange}
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="isMainAuthor">Başlıca Yazar mı?</label>
            <select
              id="isMainAuthor"
              name="isMainAuthor"
              value={formData.isMainAuthor}
              onChange={handleChange}
              required
            >
              <option value="false">Hayır</option>
              <option value="true">Evet</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="basePoints">Baz Puan</label>
            <input
              type="number"
              id="basePoints"
              name="basePoints"
              value={formData.basePoints}
              onChange={handleChange}
              required
              readOnly
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="attachments">Ekler</label>
          <input type="file" id="attachments" name="attachments" onChange={handleFileChange} multiple />
          <small className="form-text">
            Makale, kitap, sertifika vb. belgeleri ekleyebilirsiniz. Maksimum 5 dosya, her biri en fazla 10MB.
          </small>
        </div>

        {existingAttachments.length > 0 && (
          <div className="existing-attachments">
            <h3>Mevcut Ekler</h3>
            <ul className="attachments-list">
              {existingAttachments.map((attachment) => (
                <li key={attachment._id} className="attachment-item">
                  <span className="attachment-name">{attachment.name}</span>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => handleRemoveExistingAttachment(attachment._id)}
                  >
                    Kaldır
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Kaydediliyor..." : id ? "Güncelle" : "Kaydet"}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/activities")}
            disabled={loading}
          >
            İptal
          </button>
        </div>
      </form>
    </div>
  )
}

export default ActivityForm
