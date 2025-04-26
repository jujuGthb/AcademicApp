"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/use-auth";
import AuthService from "../../services/auth-service";
import "./Profile.css";

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    department: "",
    faculty: "",
    fieldArea: "",
    doctorateDate: "",
    lastPromotionDate: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        title: user.title || "",
        department: user.department || "",
        faculty: user.faculty || "",
        fieldArea: user.fieldArea || "",
        doctorateDate: user.doctorateDate
          ? formatDateForInput(user.doctorateDate)
          : "",
        lastPromotionDate: user.lastPromotionDate
          ? formatDateForInput(user.lastPromotionDate)
          : "",
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await updateProfile(formData);
      setSuccess("Profil bilgileriniz başarıyla güncellendi.");
    } catch (err) {
      setError(err.message || "Profil güncellenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Yeni şifreler eşleşmiyor.");
      setLoading(false);
      return;
    }

    try {
      await AuthService.changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );
      setSuccess("Şifreniz başarıyla güncellendi.");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "Şifre güncellenirken bir hata oluştu."
      );
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format date for input field
  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  if (!user) {
    return <div className="loading">Yükleniyor...</div>;
  }

  return (
    <div className="profile-page">
      <h1>Profil</h1>

      <div className="profile-tabs">
        <button
          className={`profile-tab ${activeTab === "profile" ? "active" : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          Profil Bilgileri
        </button>
        <button
          className={`profile-tab ${activeTab === "password" ? "active" : ""}`}
          onClick={() => setActiveTab("password")}
        >
          Şifre Değiştir
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {activeTab === "profile" && (
        <div className="profile-form-container">
          <form className="profile-form" onSubmit={handleProfileSubmit}>
            <div className="form-group">
              <label htmlFor="name">Ad Soyad</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleProfileChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="title">Akademik Ünvan</label>
              <select
                id="title"
                name="title"
                value={formData.title}
                onChange={handleProfileChange}
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
                value={formData.department}
                onChange={handleProfileChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="faculty">Fakülte</label>
              <input
                type="text"
                id="faculty"
                name="faculty"
                value={formData.faculty}
                onChange={handleProfileChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="fieldArea">Temel Alan</label>
              <select
                id="fieldArea"
                name="fieldArea"
                value={formData.fieldArea}
                onChange={handleProfileChange}
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
                value={formData.doctorateDate}
                onChange={handleProfileChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastPromotionDate">Son Yükseltme Tarihi</label>
              <input
                type="date"
                id="lastPromotionDate"
                name="lastPromotionDate"
                value={formData.lastPromotionDate}
                onChange={handleProfileChange}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Güncelleniyor..." : "Güncelle"}
            </button>
          </form>
        </div>
      )}

      {activeTab === "password" && (
        <div className="profile-form-container">
          <form className="profile-form" onSubmit={handlePasswordSubmit}>
            <div className="form-group">
              <label htmlFor="currentPassword">Mevcut Şifre</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">Yeni Şifre</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                required
                minLength={6}
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Yeni Şifre (Tekrar)</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Güncelleniyor..." : "Şifreyi Değiştir"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Profile;
