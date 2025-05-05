"use client";

import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./Header.css";

const Header = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };
  //  logout();
  const getDashboardLink = () => {
    if (!user) return "/";

    switch (user.role) {
      case "candidate":
        return "/candidate/dashboard";
      case "admin":
        return "/admin/dashboard";
      case "manager":
        return "/manager/dashboard";
      case "jury":
        return "/jury/dashboard";
      default:
        return "/";
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          Akademik Yükseltme Sistemi
        </Link>
        <nav className="nav">
          <ul className="nav-menu">
            <li className="nav-item">
              <Link to="/points-table" className="nav-link">
                Puan Tablosu
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/criteria" className="nav-link">
                Kriterler
              </Link>
            </li>

            {isAuthenticated ? (
              <>
                {/* <li className="nav-item">
                  <Link to={getDashboardLink()} className="nav-link">
                    Dashboard
                  </Link>
                </li> */}
                <li className="nav-item">
                  <button onClick={handleLogout} className="nav-button">
                    Çıkış
                  </button>
                </li>
                {user && (
                  <li className="nav-item user-info">
                    <span className="user-name">{user.name}</span>
                    <span className="user-role">{user.role}</span>
                  </li>
                )}
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/login" className="nav-link">
                    Giriş
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/register" className="nav-link">
                    Kayıt
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
