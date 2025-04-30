"use client";

import { useState, useEffect } from "react";
import "./AdminStyles.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "applicant",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    //fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Kullanıcılar yüklenirken bir hata oluştu");
      }

      const data = await response.json();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError("Kullanıcılar yüklenirken hata: " + err.message);
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

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      let url, method;

      if (isEditing) {
        url = `http://localhost:5000/api/users/${currentId}`;
        method = "PUT";
      } else {
        url = "http://localhost:5000/api/auth/register";
        method = "POST";
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Kullanıcı kaydedilirken bir hata oluştu"
        );
      }

      // Reset form and refresh users
      resetForm();
      fetchUsers();
    } catch (err) {
      setError("Kullanıcı kaydedilirken hata: " + err.message);
      console.error(err);
    }
  };

  const handleEdit = (user) => {
    setFormData({
      name: user.name,
      email: user.email,
      password: "", // Don't show password
      role: user.role,
    });
    setIsEditing(true);
    setCurrentId(user._id);
    window.scrollTo(0, 0);
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/auth/users/${userId}/role`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ role: newRole }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Kullanıcı rolü güncellenirken bir hata oluştu"
        );
      }

      // Refresh users
      fetchUsers();
    } catch (err) {
      setError("Kullanıcı rolü güncellenirken hata: " + err.message);
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "applicant",
    });
    setIsEditing(false);
    setCurrentId(null);
  };

  const filteredUsers =
    filter === "all" ? users : users.filter((user) => user.role === filter);

  const getRoleText = (role) => {
    switch (role) {
      case "admin":
        return "Admin";
      case "manager":
        return "Yönetici";
      case "jury":
        return "Jüri Üyesi";
      case "applicant":
        return "Aday";
      default:
        return role;
    }
  };

  return (
    <div className="admin-container">
      <h1 className="admin-title">Kullanıcı Yönetimi</h1>
      {error && <div className="error-message">{error}</div>}

      <div className="admin-form-container">
        <h2>{isEditing ? "Kullanıcıyı Düzenle" : "Yeni Kullanıcı Ekle"}</h2>
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label htmlFor="name">Ad Soyad</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
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
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Şifre {isEditing && "(Değiştirmek için doldurun)"}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required={!isEditing}
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Rol</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="applicant">Aday</option>
              <option value="jury">Jüri Üyesi</option>
              <option value="manager">Yönetici</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {isEditing ? "Güncelle" : "Kullanıcı Ekle"}
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
        <div className="list-header">
          <h2>Kullanıcılar</h2>
          <div className="filter-container">
            <label htmlFor="roleFilter">Role Göre Filtrele:</label>
            <select
              id="roleFilter"
              value={filter}
              onChange={handleFilterChange}
            >
              <option value="all">Tümü</option>
              <option value="admin">Admin</option>
              <option value="manager">Yönetici</option>
              <option value="jury">Jüri Üyesi</option>
              <option value="applicant">Aday</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading">Kullanıcılar yükleniyor...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="empty-message">Kullanıcı bulunamadı.</div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Ad Soyad</th>
                  <th>E-posta</th>
                  <th>Rol</th>
                  <th>Kayıt Tarihi</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role-badge role-${user.role}`}>
                        {getRoleText(user.role)}
                      </span>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-icon"
                          onClick={() => handleEdit(user)}
                          title="Düzenle"
                        >
                          ✏️
                        </button>
                        <div className="role-change-dropdown">
                          <button className="btn-icon" title="Rol Değiştir">
                            👤
                          </button>
                          <div className="dropdown-content">
                            <button
                              onClick={() =>
                                handleRoleChange(user._id, "admin")
                              }
                            >
                              Admin
                            </button>
                            <button
                              onClick={() =>
                                handleRoleChange(user._id, "manager")
                              }
                            >
                              Yönetici
                            </button>
                            <button
                              onClick={() => handleRoleChange(user._id, "jury")}
                            >
                              Jüri Üyesi
                            </button>
                            <button
                              onClick={() =>
                                handleRoleChange(user._id, "applicant")
                              }
                            >
                              Aday
                            </button>
                          </div>
                        </div>
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

export default UserManagement;
