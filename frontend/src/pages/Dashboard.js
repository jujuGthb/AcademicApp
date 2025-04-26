"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import "./Dashboard.css"

const Dashboard = ({ user }) => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem("token")
        const response = await fetch("http://localhost:5000/api/activities/stats/summary", {
          headers: {
            "x-auth-token": token,
          },
        })

        if (!response.ok) {
          throw new Error("İstatistikler alınamadı")
        }

        const data = await response.json()
        setStats(data)
        setError(null)
      } catch (err) {
        setError("İstatistikler alınırken bir hata oluştu. Lütfen daha sonra tekrar deneyin.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return <div className="loading">İstatistikler yükleniyor...</div>
  }

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>

      {error && <div className="error-message">{error}</div>}

      {stats && (
        <div className="dashboard-content">
          <div className="dashboard-header">
            <div className="user-info">
              <h2>{stats.user.name}</h2>
              <p>{stats.user.title}</p>
              <p>
                {stats.user.department}, {stats.user.faculty}
              </p>
              <p>Temel Alan: {stats.user.fieldArea}</p>
            </div>
            <div className="action-buttons">
              <Link to="/activities/add" className="btn btn-primary">
                Yeni Faaliyet Ekle
              </Link>
              <Link to="/reports/add" className="btn btn-secondary">
                Yeni Rapor Oluştur
              </Link>
            </div>
          </div>

          <div className="stats-container">
            <div className="stats-card">
              <h3>Faaliyet İstatistikleri</h3>
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-value">{stats.counts.publications}</span>
                  <span className="stat-label">Yayın</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{stats.counts.mainAuthor}</span>
                  <span className="stat-label">Başlıca Yazar</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{stats.counts.projects}</span>
                  <span className="stat-label">Proje</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{stats.counts.theses}</span>
                  <span className="stat-label">Tez Danışmanlığı</span>
                </div>
              </div>
            </div>

            <div className="stats-card">
              <h3>Kategori Puanları</h3>
              <div className="category-stats">
                {stats.categoryStats.map((category) => (
                  <div key={category._id} className="category-item">
                    <span className="category-label">Kategori {category._id}</span>
                    <div className="category-bar-container">
                      <div
                        className="category-bar"
                        style={{
                          width: `${Math.min(100, (category.totalPoints / 100) * 100)}%`,
                          backgroundColor: getCategoryColor(category._id),
                        }}
                      ></div>
                    </div>
                    <span className="category-value">{category.totalPoints.toFixed(2)} puan</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="quick-links">
            <h3>Hızlı Erişim</h3>
            <div className="links-grid">
              <Link to="/activities" className="quick-link">
                <div className="quick-link-icon">📋</div>
                <span>Tüm Faaliyetler</span>
              </Link>
              <Link to="/activities/add" className="quick-link">
                <div className="quick-link-icon">➕</div>
                <span>Yeni Faaliyet</span>
              </Link>
              <Link to="/reports" className="quick-link">
                <div className="quick-link-icon">📊</div>
                <span>Raporlar</span>
              </Link>
              <Link to="/profile" className="quick-link">
                <div className="quick-link-icon">👤</div>
                <span>Profil</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Helper function to get color for category
const getCategoryColor = (category) => {
  const colors = {
    A: "#4285F4", // Blue
    B: "#EA4335", // Red
    C: "#FBBC05", // Yellow
    D: "#34A853", // Green
    E: "#FF6D01", // Orange
    F: "#46BDC6", // Teal
    G: "#9C27B0", // Purple
    H: "#795548", // Brown
    I: "#607D8B", // Blue Grey
    J: "#E91E63", // Pink
    K: "#9E9E9E", // Grey
    L: "#000000", // Black
  }

  return colors[category] || "#4285F4"
}

export default Dashboard
