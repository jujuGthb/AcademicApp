// frontend/src/pages/public/Login.js
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/use-auth";
import "./Login.css";
import { AuthContext } from "../../context/AuthContext";

const Login = () => {
  //const { login } = useAuth();
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  //console.log(typeof navigate);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "candidate", // Default role
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Pass the email and password to the login function
      const success = await login(formData.email, formData.password);
      //console.log(success);
      //console.log(formData);
      //navigate("/candidate/dashboard");

      if (success) {
        // Redirect based on selected role
        switch (formData.role) {
          case "admin":
            navigate("/admin/dashboard");
            break;
          case "manager":
            navigate("/manager/dashboard");
            break;
          case "jury":
            navigate("/jury/dashboard");
            break;
          case "candidate":
            navigate("/candidate/dashboard");
          default:
            break;
        }
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } catch (err) {
      setError(err.message || "An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-wrapper">
        <h1>Akademik Başvuru Sistemi</h1>
        <h2>Giriş Yap</h2>

        {error && <div className="error-message">{error}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="role">Kullanıcı Tipi</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="form-control"
            >
              <option value="candidate">Aday / Başvuran</option>
              <option value="admin">Yönetici</option>
              <option value="manager">Yönetmen</option>
              <option value="jury">Jüri Üyesi</option>
            </select>
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
              className="form-control"
              placeholder="E-posta adresinizi girin"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Şifre</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="form-control"
              placeholder="Şifrenizi girin"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Hesabınız yok mu? <a href="/register">Kayıt Ol</a>
          </p>
          <p>
            <a href="/forgot-password">Şifremi Unuttum</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
