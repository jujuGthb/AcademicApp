"use client";

import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./AuthForms.css";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    title: "",
    department: "",
    faculty: "",
    fieldArea: "",
    doctorateDate: "",
    lastPromotionDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const { register, error } = useContext(AuthContext);
  const navigate = useNavigate();

  const {
    name,
    email,
    password,
    confirmPassword,
    title,
    department,
    faculty,
    fieldArea,
    doctorateDate,
    lastPromotionDate,
  } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (password !== confirmPassword) {
      setFormError("Şifreler eşleşmiyor");
      return;
    }

    setLoading(true);

    try {
      const userData = {
        name,
        email,
        password,
        title,
        department,
        faculty,
        fieldArea,
        doctorateDate: doctorateDate || undefined,
        lastPromotionDate: lastPromotionDate || undefined,
      };

      const user = await register(userData);
      navigate("/candidate/dashboard");
    } catch (err) {
      console.error("Registration error:", err);
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <h1>Kayıt Ol</h1>
      {(formError || error) && (
        <div className="error-message">{formError || error}</div>
      )}
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Ad Soyad</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">E-posta</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Şifre</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={handleChange}
            minLength="6"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Şifre Tekrar</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleChange}
            minLength="6"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="title">Akademik Ünvan</label>
          <select
            id="title"
            name="title"
            value={title}
            onChange={handleChange}
            required
          >
            <option value="">Seçiniz</option>
            <option value="Dr. Öğretim Üyesi">Dr. Öğretim Üyesi</option>
            <option value="Doçent">Doçent</option>
            <option value="Profesör">Profesör</option>
            <option value="Araştırma Görevlisi">Araştırma Görevlisi</option>
            <option value="Öğretim Görevlisi">Öğretim Görevlisi</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="department">Bölüm</label>
          <input
            type="text"
            id="department"
            name="department"
            value={department}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="faculty">Fakülte</label>
          <input
            type="text"
            id="faculty"
            name="faculty"
            value={faculty}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="fieldArea">Temel Alan</label>
          <select
            id="fieldArea"
            name="fieldArea"
            value={fieldArea}
            onChange={handleChange}
            required
          >
            <option value="">Seçiniz</option>
            <option value="Sağlık Bilimleri">Sağlık Bilimleri</option>
            <option value="Fen Bilimleri ve Matematik">
              Fen Bilimleri ve Matematik
            </option>
            <option value="Mühendislik">Mühendislik</option>
            <option value="Ziraat, Orman ve Su Ürünleri">
              Ziraat, Orman ve Su Ürünleri
            </option>
            <option value="Eğitim Bilimleri">Eğitim Bilimleri</option>
            <option value="Filoloji">Filoloji</option>
            <option value="Mimarlık, Planlama ve Tasarım">
              Mimarlık, Planlama ve Tasarım
            </option>
            <option value="Sosyal, Beşeri ve İdari Bilimler">
              Sosyal, Beşeri ve İdari Bilimler
            </option>
            <option value="Spor Bilimleri">Spor Bilimleri</option>
            <option value="Hukuk">Hukuk</option>
            <option value="İlahiyat">İlahiyat</option>
            <option value="Güzel Sanatlar">Güzel Sanatlar</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="doctorateDate">Doktora/Uzmanlık Tarihi</label>
          <input
            type="date"
            id="doctorateDate"
            name="doctorateDate"
            value={doctorateDate}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="lastPromotionDate">Son Yükseltme Tarihi</label>
          <input
            type="date"
            id="lastPromotionDate"
            name="lastPromotionDate"
            value={lastPromotionDate}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Kayıt yapılıyor..." : "Kayıt Ol"}
        </button>
      </form>
      <p className="auth-redirect">
        Zaten hesabınız var mı? <Link to="/login">Giriş Yap</Link>
      </p>
    </div>
  );
};

export default Register;
