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
    tcNumber: "",
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
      const success = await login(formData.tcNumber, formData.password);
      console.log(success);
      //return;
      if (success) {
        // Redirect based on selected role
        switch (success.user.role) {
          case "admin":
            navigate("/admin");
            break;
          case "manager":
            navigate("/manager");
            break;
          case "jury":
            navigate("/jury");
            break;
          case "applicant":
            navigate("/candidate");
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
            <label htmlFor="tcNumber">TC Kimlik Numarası</label>
            <input
              type="text"
              id="tcNumber"
              name="tcNumber"
              value={formData.tcNumber}
              onChange={handleChange}
              required
              className="form-control"
              placeholder="TC kimlik numaranızı girin"
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

{
  /* <div className="form-group">
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
</div> */
}
