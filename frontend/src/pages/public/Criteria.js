"use client";

import { useState, useEffect } from "react";
import { useCriteria } from "../../hooks/use-criteria";
import "./Criteria.css";

const Criteria = () => {
  const { criteria, loading, error } = useCriteria();
  const [selectedFieldArea, setSelectedFieldArea] = useState("");
  const [selectedTitle, setSelectedTitle] = useState("");
  const [isFirstAppointment, setIsFirstAppointment] = useState("true");
  const [filteredCriteria, setFilteredCriteria] = useState(null);

  const fieldAreas = [
    "Sağlık Bilimleri",
    "Fen Bilimleri ve Matematik",
    "Mühendislik",
    "Ziraat, Orman ve Su Ürünleri",
    "Eğitim Bilimleri",
    "Filoloji",
    "Mimarlık, Planlama ve Tasarım",
    "Sosyal, Beşeri ve İdari Bilimler",
    "Spor Bilimleri",
    "Hukuk",
    "İlahiyat",
    "Güzel Sanatlar",
  ];

  const titles = ["Dr. Öğretim Üyesi", "Doçent", "Profesör"];

  useEffect(() => {
    if (selectedFieldArea && selectedTitle && criteria.length > 0) {
      const filtered = criteria.find(
        (c) =>
          c.fieldArea === selectedFieldArea &&
          c.targetTitle === selectedTitle &&
          c.isFirstAppointment === (isFirstAppointment === "true")
      );
      setFilteredCriteria(filtered || null);
    } else {
      setFilteredCriteria(null);
    }
  }, [selectedFieldArea, selectedTitle, isFirstAppointment, criteria]);

  const handleSearch = (e) => {
    e.preventDefault();
    // The search is already handled by the useEffect above
  };

  if (loading) {
    return <div className="loading">Kriterler yükleniyor...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="criteria-container">
      <h1>Akademik Yükseltme ve Atama Kriterleri</h1>

      <div className="criteria-search-form">
        <form onSubmit={handleSearch}>
          <div className="form-group">
            <label htmlFor="fieldArea">Temel Alan</label>
            <select
              id="fieldArea"
              value={selectedFieldArea}
              onChange={(e) => setSelectedFieldArea(e.target.value)}
              required
            >
              <option value="">Seçiniz</option>
              {fieldAreas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="targetTitle">Hedef Ünvan</label>
            <select
              id="targetTitle"
              value={selectedTitle}
              onChange={(e) => setSelectedTitle(e.target.value)}
              required
            >
              <option value="">Seçiniz</option>
              {titles.map((title) => (
                <option key={title} value={title}>
                  {title}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="isFirstAppointment">Atama Türü</label>
            <select
              id="isFirstAppointment"
              value={isFirstAppointment}
              onChange={(e) => setIsFirstAppointment(e.target.value)}
              required
            >
              <option value="true">İlk Atama</option>
              <option value="false">Yeniden Atama</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary">
            Kriterleri Göster
          </button>
        </form>
      </div>

      {filteredCriteria ? (
        <div className="criteria-results">
          <h2>
            {filteredCriteria.fieldArea} - {filteredCriteria.targetTitle} -
            {filteredCriteria.isFirstAppointment
              ? " İlk Atama"
              : " Yeniden Atama"}
          </h2>

          <div className="criteria-section">
            <h3>Minimum Gereksinimler</h3>

            <div className="criteria-item">
              <span className="criteria-label">Toplam Puan:</span>
              <span className="criteria-value">
                {filteredCriteria.minimumRequirements.totalPoints}
              </span>
            </div>

            <h4>Kategori Puanları</h4>
            <div className="criteria-table">
              <table>
                <thead>
                  <tr>
                    <th>Kategori</th>
                    <th>Minimum Puan</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(
                    filteredCriteria.minimumRequirements.categoryPoints
                  ).map(
                    ([category, points]) =>
                      points > 0 && (
                        <tr key={category}>
                          <td>
                            {category} - {getCategoryName(category)}
                          </td>
                          <td>{points}</td>
                        </tr>
                      )
                  )}
                </tbody>
              </table>
            </div>

            <h4>Faaliyet Sayıları</h4>
            <div className="criteria-table">
              <table>
                <thead>
                  <tr>
                    <th>Faaliyet Türü</th>
                    <th>Minimum Sayı</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(
                    filteredCriteria.minimumRequirements.activityCounts
                  ).map(
                    ([countType, count]) =>
                      count > 0 && (
                        <tr key={countType}>
                          <td>{getCountTypeName(countType)}</td>
                          <td>{count}</td>
                        </tr>
                      )
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {filteredCriteria.maximumLimits && (
            <div className="criteria-section">
              <h3>Maksimum Limitler</h3>

              <h4>Kategori Puanları</h4>
              <div className="criteria-table">
                <table>
                  <thead>
                    <tr>
                      <th>Kategori</th>
                      <th>Maksimum Puan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(
                      filteredCriteria.maximumLimits.categoryPoints
                    ).map(([category, limit]) => (
                      <tr key={category}>
                        <td>
                          {category} - {getCategoryName(category)}
                        </td>
                        <td>{limit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="criteria-notes">
            <h3>Önemli Notlar</h3>
            <ul>
              <li>
                Belirtilen minimum puanlar ve faaliyet sayıları, başvurunun
                değerlendirmeye alınması için gerekli asgari koşullardır.
              </li>
              <li>
                Maksimum limitler, ilgili kategorilerde toplanabilecek en yüksek
                puanı belirtir.
              </li>
              <li>
                Başvuru sahibinin akademik faaliyetlerinin niteliği ve
                çeşitliliği de değerlendirmede dikkate alınır.
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="criteria-empty">
          <p>Lütfen kriter aramak için yukarıdaki alanları doldurun.</p>
        </div>
      )}
    </div>
  );
};

// Helper functions
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

const getCountTypeName = (countType) => {
  const countTypeMap = {
    publications: "Yayın Sayısı",
    mainAuthor: "Başlıca Yazar Olduğu Yayın Sayısı",
    projects: "Proje Sayısı",
    theses: "Tez Danışmanlığı Sayısı",
    sciPublications: "SCI/SSCI/AHCI Yayın Sayısı",
    internationalPublications: "Uluslararası Yayın Sayısı",
    nationalPublications: "Ulusal Yayın Sayısı",
    personalExhibitions: "Kişisel Sergi Sayısı",
    groupExhibitions: "Karma Sergi Sayısı",
  };
  return countTypeMap[countType] || countType;
};

export default Criteria;
