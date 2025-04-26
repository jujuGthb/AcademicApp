"use client"

import { Outlet } from "react-router-dom"
import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import AdminSidebar from "../components/admin/AdminSidebar"
import Header from "../components/common/Header"

const AdminLayout = () => {
  const { user } = useContext(AuthContext)

  return (
    <div className="layout admin-layout">
      <Header />
      <div className="layout-container">
        <AdminSidebar user={user} />
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
