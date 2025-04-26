import { NavLink } from "react-router-dom"
import "./AdminSidebar.css"

const AdminSidebar = ({ user }) => {
  return (
    <aside className="sidebar admin-sidebar">
      <div className="sidebar-header">
        <h3>Admin Paneli</h3>
        <div className="user-info">
          <p className="user-name">{user?.name}</p>
          <p className="user-role">Administrator</p>
        </div>
      </div>
      <nav className="sidebar-nav">
        <ul className="sidebar-menu">
          <li className="sidebar-item">
            <NavLink to="/admin/dashboard" className="sidebar-link">
              Dashboard
            </NavLink>
          </li>
          <li className="sidebar-item">
            <NavLink to="/admin/users" className="sidebar-link">
              Kullanıcılar
            </NavLink>
          </li>
          <li className="sidebar-item">
            <NavLink to="/admin/job-postings" className="sidebar-link">
              İş İlanları
            </NavLink>
          </li>
          <li className="sidebar-item">
            <NavLink to="/admin/applications" className="sidebar-link">
              Başvurular
            </NavLink>
          </li>
          <li className="sidebar-item">
            <NavLink to="/admin/criteria" className="sidebar-link">
              Kriterler
            </NavLink>
          </li>
          <li className="sidebar-item">
            <NavLink to="/admin/settings" className="sidebar-link">
              Ayarlar
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  )
}

export default AdminSidebar
