"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import "./Activities.css"

const Activities = () => {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem("token")
        const response = await fetch("http://localhost:5000/api/activities", {
          headers: {
            "x-auth-token": token,
          },
        })

        if (!response.ok) {
          throw new Error("Faaliyetler alınamadı")
        }

        const data = await response.json()
        setActivities(data)
        setError(null)
      } catch (err) {
        setError("Faaliyetler alınırken bir hata oluştu. Lütfen daha sonra tekrar deneyin.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [])

  const handleDelete = async (id) => {
    if (window.confirm("Bu faaliyeti silmek istediğinizden emin misiniz?")) {
      try {
        const token = localStorage.getItem("token")
        const response = await fetch(`http://localhost:5000/api/activities/${id}`, {
          method: "DELETE",
          headers: {
            "x-auth-token": token,
          },
        })

        if (!response.ok) {
          throw new Error("Faaliyet silinemedi")
        }

        setActivities(activities.filter((activity) => activity._id !== id))
      } catch (err) {
        setError("Faaliyet silinirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.")
        console.error(err)
      }
    }
  }

  const filteredActivities = activities
    .filter((activity) => {
      if (filter === "all") return true
      return activity.category === filter
    })
    .filter((activity) => {
      if (!searchTerm) return true
      return (
        activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.authors?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })

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
    }
    return categories[category] || category
  }

  if (loading) {
    return <div className="loading">Faaliyetler yükleniyor...</div>
  }

  return (
    <div className="activities">
      <div className="activities-header">
        <h1>Faaliyetler</h1>
        <Link to="/activities/add" className="btn btn-primary">
          Yeni Faaliyet Ekle
        </Link>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="activities-filters">
        <div className="filter-group">
          <label htmlFor="category-filter">Kategori:</label>
          <select
            id="category-filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">Tümü</option>
            <option value="A">A - Makaleler</option>
            <option value="B">B - Bilimsel Toplantı Faaliyetleri</option>
            <option value="C">C - Kitaplar</option>
            <option value="D">D - Atıflar</option>
            <option value="E">E - Eğitim Öğretim Faaliyetleri</option>
            <option value="F">F - Tez Yöneticiliği</option>
            <option value="G">G - Patentler</option>
            <option value="H">H - Araştırma Projeleri</option>
            <option value="I">I - Editörlük, Yayın Kurulu Üyeliği ve Hakemlik</option>
            <option value="J">J - Ödüller</option>
            <option value="K">K - İdari Görevler ve Üniversiteye Katkı</option>
            <option value="L">L - Güzel Sanatlar Faaliyetleri</option>
          </select>
        </div>
        <div className="search-group">
          <input
            type="text"
            placeholder="Faaliyet ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {filteredActivities.length === 0 ? (
        <div className="no-activities">
          <p>Faaliyet bulunamadı.</p>
          <Link to="/activities/add" className="btn btn-primary">
            Yeni Faaliyet Ekle
          </Link>
        </div>
      ) : (
        <div className="activities-list">
          {filteredActivities.map((activity) => (
            <div key={activity._id} className="activity-card">
              <div className="activity-header">
                <div className="activity-category">
                  <span className={`badge badge-${activity.category}`}>{activity.category}</span>
                  <span className="activity-subcategory">{activity.subcategory}</span>
                </div>
                <div className="activity-date">{new Date(activity.date).toLocaleDateString("tr-TR")}</div>
              </div>
              <div className="activity-body">
                <h3 className="activity-title">{activity.title}</h3>
                {activity.authors && <p className="activity-authors">{activity.authors}</p>}
                {activity.description && <p className="activity-description">{activity.description}</p>}
                {activity.journal && (
                  <p className="activity-journal">
                    <strong>Dergi:</strong> {activity.journal}
                    {activity.volume && `, Cilt: ${activity.volume}`}
                    {activity.issue && `, Sayı: ${activity.issue}`}
                    {activity.pages && `, Sayfa: ${activity.pages}`}
                  </p>
                )}
                {activity.indexType && (
                  <p className="activity-index">
                    <strong>İndeks:</strong> {activity.indexType}
                    {activity.quartile && ` (${activity.quartile})`}
                  </p>
                )}
                <div className="activity-points">
                  <span className="activity-base-points">Baz Puan: {activity.basePoints}</span>
                  <span className="activity-calculated-points">
                    Hesaplanan Puan: {activity.calculatedPoints.toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="activity-footer">
                <Link to={`/activities/${activity._id}`} className="btn btn-info btn-sm">
                  Detay
                </Link>
                <Link to={`/activities/edit/${activity._id}`} className="btn btn-secondary btn-sm">
                  Düzenle
                </Link>
                <button onClick={() => handleDelete(activity._id)} className="btn btn-danger btn-sm">
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Activities
