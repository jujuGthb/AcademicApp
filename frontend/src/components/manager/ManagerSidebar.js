import { NavLink } from "react-router-dom"
import "./ManagerSidebar.css"

const ManagerSidebar = ({ user }) => {
  return (
    <aside className="sidebar manager-sidebar">
      <div className="sidebar-header">
        <h3>Yönetici Paneli</h3>
        <div className="user-info">
          <p className="user-name">{user?.name}</p>
          <p className="user-role">Yönetici</p>
        </div>
      </div>
      <nav className="sidebar-nav">
        <ul className="sidebar-menu">
          <li className="sidebar-item">
            <NavLink to="/manager/dashboard" className="sidebar-link">
              Dashboard
            </NavLink>
          </li>
          <li className="sidebar-item">
            <NavLink to="/manager/applications" className="sidebar-link">
              Başvurular
            </NavLink>
          </li>
          <li className="sidebar-item">
            <NavLink to="/manager/jury-assignments" className="sidebar-link">
              Jüri Atamaları
            </NavLink>
          </li>
          <li className="sidebar-item">
            <NavLink to="/manager/evaluations" className="sidebar-link">
              Değerlendirmeler
            </NavLink>
          </li>
          <li className="sidebar-item">
            <NavLink to="/manager/reports" className="sidebar-link">
              Raporlar
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  )
}

export default ManagerSidebar
