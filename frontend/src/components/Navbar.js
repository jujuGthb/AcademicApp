"use client"

import { Link } from "react-router-dom"
import "./Navbar.css"

const Navbar = ({ isAuthenticated, logout, user }) => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Akademik Yükseltme Sistemi
        </Link>
        <ul className="navbar-menu">
          <li className="navbar-item">
            <Link to="/points-table" className="navbar-link">
              Puan Tablosu
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/criteria" className="navbar-link">
              Kriterler
            </Link>
          </li>

          {isAuthenticated ? (
            <>
              <li className="navbar-item">
                <Link to="/dashboard" className="navbar-link">
                  Dashboard
                </Link>
              </li>
              <li className="navbar-item">
                <Link to="/activities" className="navbar-link">
                  Faaliyetler
                </Link>
              </li>
              <li className="navbar-item">
                <Link to="/reports" className="navbar-link">
                  Raporlar
                </Link>
              </li>
              <li className="navbar-item">
                <Link to="/profile" className="navbar-link">
                  Profil
                </Link>
              </li>
              <li className="navbar-item">
                <button onClick={logout} className="navbar-button">
                  Çıkış
                </button>
              </li>
              {user && (
                <li className="navbar-item navbar-user">
                  <span>{user.name}</span>
                  <span className="navbar-user-title">{user.title}</span>
                </li>
              )}
            </>
          ) : (
            <>
              <li className="navbar-item">
                <Link to="/login" className="navbar-link">
                  Giriş
                </Link>
              </li>
              <li className="navbar-item">
                <Link to="/register" className="navbar-link">
                  Kayıt
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
