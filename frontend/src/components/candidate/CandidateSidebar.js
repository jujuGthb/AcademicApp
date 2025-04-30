import { NavLink } from "react-router-dom";
import "./CandidateSidebar.css";

const CandidateSidebar = ({ user }) => {
  return (
    <aside className="sidebar candidate-sidebar">
      <div className="sidebar-header">
        <h3>Aday Paneli</h3>
        <div className="user-info">
          <p className="user-name">{user?.name}</p>
          <p className="user-title">{user?.title}</p>
        </div>
      </div>
      <nav className="sidebar-nav">
        <ul className="sidebar-menu">
          <li className="sidebar-item">
            <NavLink to="/candidate/dashboard" className="sidebar-link">
              Dashboard
            </NavLink>
          </li>
          <li className="sidebar-item">
            <NavLink to="/candidate/activities" className="sidebar-link">
              Faaliyetler
            </NavLink>
          </li>
          <li className="sidebar-item">
            <NavLink to="/candidate/job-postings" className="sidebar-link">
              İş İlanları
            </NavLink>
          </li>
          <li className="sidebar-item">
            <NavLink to="/candidate/applications" className="sidebar-link">
              Başvurularım
            </NavLink>
          </li>
          <li className="sidebar-item">
            <NavLink to="/candidate/reports" className="sidebar-link">
              Raporlar
            </NavLink>
          </li>
          <li className="sidebar-item">
            <NavLink to="/candidate/profile" className="sidebar-link">
              Profil
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default CandidateSidebar;
