"use client";

import { Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import CandidateSidebar from "../components/candidate/CandidateSidebar";
import Header from "../components/common/Header";

const CandidateLayout = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="layout candidate-layout">
      <Header />
      <div className="layout-container">
        <CandidateSidebar user={user} />
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CandidateLayout;
