"use client";

import { Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import ManagerSidebar from "../components/manager/ManagerSidebar";
import Header from "../components/common/Header";
import "./ManagerLayout.css";

const ManagerLayout = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="layout manager-layout">
      <Header />
      <div className="layout-container">
        <ManagerSidebar user={user} />
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ManagerLayout;
