"use client";

import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminStyles.css";
import { AuthContext } from "../../context/AuthContext";

const JobPostingManagement = () => {
  const [jobPostings, setJobPostings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    faculty: "",
    department: "",
    position: "",
    fieldArea: "",
    description: "",
    requirements: "",
    startDate: "",
    endDate: "",
    status: "draft",
    requiredDocuments: [],
  });
  const [documentInput, setDocumentInput] = useState({
    name: "",
    description: "",
    required: true,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  // Fetch all job postings
  useEffect(() => {
    fetchJobPostings();
  }, []);

  const fetchJobPostings = async () => {
    try {
      setLoading(true);
      console.log(token);
      const response = await fetch("http://localhost:5000/api/job-postings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("İlanlar yüklenirken bir hata oluştu");
      }

      const data = await response.json();
      setJobPostings(data);
      setError(null);
    } catch (err) {
      setError("İlanlar yüklenirken hata: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDocumentInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDocumentInput({
      ...documentInput,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const addDocument = () => {
    if (!documentInput.name.trim()) {
      return;
    }

    setFormData({
      ...formData,
      requiredDocuments: [...formData.requiredDocuments, { ...documentInput }],
    });

    // Reset document input
    setDocumentInput({ name: "", description: "", required: true });
  };

  const removeDocument = (index) => {
    const updatedDocuments = [...formData.requiredDocuments];
    updatedDocuments.splice(index, 1);
    setFormData({
      ...formData,
      requiredDocuments: updatedDocuments,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let url = isEditing
        ? `http://localhost:5000/api/job-postings/${currentId}`
        : "http://localhost:5000/api/job-postings";
      const method = isEditing ? "PUT" : "POST";

      url = "http://localhost:5000/api/job-postings";

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "İlan kaydedilirken bir hata oluştu"
        );
      }

      // Reset form and refresh job postings
      resetForm();
      fetchJobPostings();
    } catch (err) {
      setError("İlan kaydedilirken hata: " + err.message);
      console.error(err);
    }
  };

  const handleEdit = (jobPosting) => {
    setFormData({
      title: jobPosting.title,
      faculty: jobPosting.faculty,
      department: jobPosting.department,
      position: jobPosting.position,
      fieldArea: jobPosting.fieldArea,
      description: jobPosting.description,
      requirements: jobPosting.requirements,
      startDate: new Date(jobPosting.startDate).toISOString().split("T")[0],
      endDate: new Date(jobPosting.endDate).toISOString().split("T")[0],
      status: jobPosting.status,
      requiredDocuments: jobPosting.requiredDocuments || [],
    });
    setIsEditing(true);
    setCurrentId(jobPosting._id);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bu ilanı silmek istediğinizden emin misiniz?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/job-postings/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("İlan silinirken bir hata oluştu");
      }

      // Refresh job postings
      fetchJobPostings();
    } catch (err) {
      setError("İlan silinirken hata: " + err.message);
      console.error(err);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/job-postings/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("İlan durumu güncellenirken bir hata oluştu");
      }

      // Refresh job postings
      fetchJobPostings();
    } catch (err) {
      setError("İlan durumu güncellenirken hata: " + err.message);
      console.error(err);
    }
  };

  const viewApplications = (jobId) => {
    navigate(`/admin/job-postings/${jobId}/applications`);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      faculty: "",
      department: "",
      position: "",
      fieldArea: "",
      description: "",
      requirements: "",
      startDate: "",
      endDate: "",
      status: "draft",
      requiredDocuments: [],
    });
    setIsEditing(false);
    setCurrentId(null);
  };

  return (
    <div className="admin-container">
      <h1 className="admin-title">İlan Yönetimi</h1>
      {error && <div className="error-message">{error}</div>}

      <div className="admin-form-container">
        <h2>{isEditing ? "İlanı Düzenle" : "Yeni İlan Oluştur"}</h2>
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label htmlFor="title">İlan Başlığı</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="faculty">Fakülte</label>
              <input
                type="text"
                id="faculty"
                name="faculty"
                value={formData.faculty}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="department">Bölüm</label>
              <input
                type="text"
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="position">Pozisyon</label>
              <select
                id="position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                required
              >
                <option value="">Pozisyon Seçin</option>
                <option value="Dr. Öğretim Üyesi">Dr. Öğretim Üyesi</option>
                <option value="Doçent">Doçent</option>
                <option value="Profesör">Profesör</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="fieldArea">Alan</label>
              <select
                id="fieldArea"
                name="fieldArea"
                value={formData.fieldArea}
                onChange={handleChange}
                required
              >
                <option value="">Alan Seçin</option>
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
          </div>

          <div className="form-group">
            <label htmlFor="description">İlan Açıklaması</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="requirements">Başvuru Koşulları</label>
            <textarea
              id="requirements"
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              required
              rows="4"
            ></textarea>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startDate">Başlangıç Tarihi</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="endDate">Bitiş Tarihi</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="status">Durum</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="draft">Taslak</option>
              <option value="published">Yayında</option>
              <option value="closed">Kapalı</option>
            </select>
          </div>

          <div className="form-group">
            <label>Gerekli Belgeler</label>
            <div className="required-documents">
              {formData.requiredDocuments.map((doc, index) => (
                <div key={index} className="document-item">
                  <div className="document-info">
                    <strong>{doc.name}</strong>
                    {doc.description && <p>{doc.description}</p>}
                    <span
                      className={
                        doc.required ? "required-badge" : "optional-badge"
                      }
                    >
                      {doc.required ? "Zorunlu" : "İsteğe Bağlı"}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="btn-remove"
                    onClick={() => removeDocument(index)}
                  >
                    Kaldır
                  </button>
                </div>
              ))}

              <div className="document-input">
                <div className="form-row">
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="Belge Adı"
                      name="name"
                      value={documentInput.name}
                      onChange={handleDocumentInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="Açıklama (İsteğe Bağlı)"
                      name="description"
                      value={documentInput.description}
                      onChange={handleDocumentInputChange}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        name="required"
                        checked={documentInput.required}
                        onChange={handleDocumentInputChange}
                      />
                      Zorunlu Belge
                    </label>
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={addDocument}
                  >
                    Belge Ekle
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {isEditing ? "İlanı Güncelle" : "İlan Oluştur"}
            </button>
            {isEditing && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={resetForm}
              >
                İptal
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="admin-list-container">
        <h2>İlanlar</h2>
        {loading ? (
          <div className="loading">İlanlar yükleniyor...</div>
        ) : jobPostings.length === 0 ? (
          <div className="empty-message">Henüz ilan bulunmamaktadır.</div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Başlık</th>
                  <th>Fakülte</th>
                  <th>Bölüm</th>
                  <th>Pozisyon</th>
                  <th>Tarihler</th>
                  <th>Durum</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {jobPostings.map((job) => (
                  <tr key={job._id}>
                    <td>{job.title}</td>
                    <td>{job.faculty}</td>
                    <td>{job.department}</td>
                    <td>{job.position}</td>
                    <td>
                      {new Date(job.startDate).toLocaleDateString()} -{" "}
                      {new Date(job.endDate).toLocaleDateString()}
                    </td>
                    <td>
                      <span className={`status-badge status-${job.status}`}>
                        {job.status === "draft"
                          ? "Taslak"
                          : job.status === "published"
                          ? "Yayında"
                          : "Kapalı"}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-icon"
                          onClick={() => handleEdit(job)}
                          title="Düzenle"
                        >
                          ✏️
                        </button>
                        <button
                          className="btn-icon"
                          onClick={() => handleDelete(job._id)}
                          title="Sil"
                        >
                          🗑️
                        </button>
                        <button
                          className="btn-icon"
                          onClick={() => viewApplications(job._id)}
                          title="Başvuruları Görüntüle"
                        >
                          👥
                        </button>
                        {job.status === "draft" && (
                          <button
                            className="btn-icon"
                            onClick={() =>
                              handleStatusChange(job._id, "published")
                            }
                            title="Yayınla"
                          >
                            📢
                          </button>
                        )}
                        {job.status === "published" && (
                          <button
                            className="btn-icon"
                            onClick={() =>
                              handleStatusChange(job._id, "closed")
                            }
                            title="Kapat"
                          >
                            🔒
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobPostingManagement;
