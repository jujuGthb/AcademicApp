"use client"

import { Link } from "react-router-dom"
import { useContext } from "react"
import { AuthContext } from "../../context/AuthContext"
import JobPostings from "../../components/public/JobPostings"
import "./Home.css"

const Home = () => {
  const { isAuthenticated } = useContext(AuthContext)

  return (
    <div className="home">
      <div className="hero">
        <h1>Kocaeli Üniversitesi Akademik Yükseltme Sistemi</h1>
        <p>Akademik faaliyetlerinizi kaydedin, puanlarınızı hesaplayın ve yükseltme başvurularınızı kolayca yönetin.</p>
        <div className="cta-buttons">
          {!isAuthenticated && (
            <>
              <Link to="/register" className="btn btn-primary">
                Kayıt Ol
              </Link>
              <Link to="/login" className="btn btn-secondary">
                Giriş Yap
              </Link>
            </>
          )}
          {isAuthenticated && (
            <Link to="/candidate/dashboard" className="btn btn-primary">
              Dashboard'a Git
            </Link>
          )}
        </div>
      </div>

      <JobPostings isAuthenticated={isAuthenticated} />

      <div className="features">
        <h2>Özellikler</h2>
        <div className="feature-grid">
          <div className="feature">
            <h3>Faaliyet Yönetimi</h3>
            <p>Tüm akademik faaliyetlerinizi kolayca kaydedin ve yönetin</p>
          </div>
          <div className="feature">
            <h3>Otomatik Puanlama</h3>
            <p>Yönergeye uygun olarak faaliyetlerinizin puanlarını otomatik hesaplayın</p>
          </div>
          <div className="feature">
            <h3>Başvuru Yönetimi</h3>
            <p>Akademik yükseltme başvurularınızı online olarak yapın ve takip edin</p>
          </div>
          <div className="feature">
            <h3>Jüri Değerlendirme</h3>
            <p>Jüri üyeleri için kolay değerlendirme süreci</p>
          </div>
        </div>
      </div>

      <div className="info-section">
        <h2>Akademik Yükseltme Kriterleri</h2>
        <p>
          Kocaeli Üniversitesi Öğretim Üyeliği Atama ve Yükseltme Yönergesi'ne göre akademik yükseltme kriterleri
          belirlenmiştir. Sistem, bu kriterlere uygun olarak puanlama yapmaktadır.
        </p>
        <div className="info-grid">
          <div className="info-item">
            <h3>Dr. Öğretim Üyesi</h3>
            <p>İlk atama ve yeniden atama kriterleri</p>
            <Link to="/criteria" className="btn btn-info btn-sm mt-3">
              Kriterleri Görüntüle
            </Link>
          </div>
          <div className="info-item">
            <h3>Doçent</h3>
            <p>Doçentlik kadrosuna atanma kriterleri</p>
            <Link to="/criteria" className="btn btn-info btn-sm mt-3">
              Kriterleri Görüntüle
            </Link>
          </div>
          <div className="info-item">
            <h3>Profesör</h3>
            <p>Profesörlük kadrosuna atanma kriterleri</p>
            <Link to="/criteria" className="btn btn-info btn-sm mt-3">
              Kriterleri Görüntüle
            </Link>
          </div>
        </div>
      </div>

      <div className="points-section">
        <h2>Puan Tablosu</h2>
        <p>Akademik faaliyetlerinizin puanlarını hesaplamak için kullanılan puan tablosunu görüntüleyin.</p>
        <div className="text-center mt-3">
          <Link to="/points-table" className="btn btn-primary">
            Puan Tablosunu Görüntüle
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Home
