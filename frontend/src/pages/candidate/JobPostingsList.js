"use client"

import { useState, useEffect } from "react"
import "./JobPostingsList.css"

const JobPostingsList = () => {
  const [jobPostings, setJobPostings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchJobPostings = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem("token")
        const response = await fetch("http://localhost:5000/api/job-postings", {
          headers: {
            "x-auth-token": token
          }
        })
        
        if (!response.ok) {
          throw new Error("İş ilanları alınamadı")
        }

        const data = await response.json()
        setJobPostings(data)
        setError(null)
      } catch (err) {
        setError("İş ilanları alınırken bir hata oluştu.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchJobPostings()
  }, [])

  if (loading) {
    return <div className="loading">İş ilanları yükleniyor...</div>
  }

  if (error) {
    return <div className="error-message">{error}</div>
  }

  if (jobPostings.length === 0) {
    return <div className="no-job-postings">Şu anda aktif iş ilanı bulunmamaktadır.</div>
  }

  // Filter active job postings
  const activeJobPostings = jobPostings.filter(job => job.status === "published")

  return (
    <div className="job-postings-list">
      <h1>İş İlanları</h1>
      
      {activeJobPostings.length === 0 ? (
        <div className="no-job-postings">Şu anda aktif iş ilanı bulunmamaktadır.</div>
      ) : (
        <div className="job-postings-table-container">
          <table className="job-postings-table">
            <thead>
              <tr>
                <th>İlan Başlığı</th>
                <th>Fakülte</th>
                <th>Bölüm</th>
                <th>Pozisyon</th>
                <th>Son Başvuru</th>
                <th>İşlemler</th>
              </tr>
            </thead>\
