"use client"

import { Outlet } from "react-router-dom"
import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import JurySidebar from "../components/jury/JurySidebar"
import Header from "../components/common/Header"

const JuryLayout = () => {
  const { user } = useContext(AuthContext)

  return (
    <div className="layout jury-layout">
      <Header />
      <div className="layout-container">
        <JurySidebar user={user} />
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default JuryLayout
