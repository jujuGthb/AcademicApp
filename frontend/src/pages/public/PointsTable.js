"use client";

import { useState, useEffect } from "react";
import { activityCategories, getSubcategories } from "../../utils/activityData";
import "./PointsTable.css";

const PointsTable = () => {
  const [selectedCategory, setSelectedCategory] = useState("A");
  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    setSubcategories(getSubcategories(selectedCategory));
  }, [selectedCategory]);

  return (
    <div className="points-table-container">
      <h1>Akademik Faaliyet Puanlama Tablosu</h1>

      <div className="category-selector">
        <label htmlFor="category-select">Kategori Seçiniz:</label>
        <select
          id="category-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {activityCategories.map((category) => (
            <option key={category.code} value={category.code}>
              {category.code} - {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="table-wrapper">
        <table className="points-table">
          <thead>
            <tr>
              <th>Kod</th>
              <th>Faaliyet</th>
              <th>Puan</th>
            </tr>
          </thead>
          <tbody>
            {subcategories.map((subcategory) => (
              <tr key={subcategory.code}>
                <td>{subcategory.code}</td>
                <td>{subcategory.name}</td>
                <td>{subcategory.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="points-info">
        <h2>Puanlama Bilgileri</h2>
        <ul>
          <li>Puanlar, faaliyetin türüne ve niteliğine göre belirlenmiştir.</li>
          <li>
            Çok yazarlı yayınlarda puan, yazar sayısına göre orantılı olarak
            hesaplanır.
          </li>
          <li>Başlıca yazar olma durumunda ek puan verilir.</li>
          <li>Bazı kategorilerde maksimum puan limitleri uygulanabilir.</li>
        </ul>
      </div>
    </div>
  );
};

export default PointsTable;
