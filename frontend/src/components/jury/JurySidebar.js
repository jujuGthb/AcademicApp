import { NavLink } from "react-router-dom"
import "./JurySidebar.css"

const JurySidebar = ({ user }) => {
  return (
    <aside className="sidebar jury-sidebar">
      <div className="sidebar-header">
        <h3>Jüri Paneli</h3>
        <div className="user-info">
          <p className="user-name">{user?.name}</p>
          <p className="user-title">{user?.title}</p>
        </div>
      </div>
      <nav className="sidebar-nav">
        <ul className="sidebar-menu">
          <li className="sidebar-item">
            <NavLink to="/jury/dashboard" className="sidebar-link">
              Dashboard
            </NavLink>
          </li>
          <li className="sidebar-item">
            <NavLink to="/jury/evaluations" className="sidebar-link">
              Değerlendirmelerim
            </NavLink>
          </li>
          <li className="sidebar-item">
            <NavLink to="/jury/completed" className="sidebar-link">
              Tamamlanan Değerlendirmeler
            </NavLink>
          </li>
          <li className="sidebar-item">
            <NavLink to="/jury/profile" className="sidebar-link">
              Profil
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  )
}

export default JurySidebar
