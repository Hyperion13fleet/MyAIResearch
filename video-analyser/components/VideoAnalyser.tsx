"use client"

import { useState } from "react"
import Sidebar from "./Sidebar"
import HomePage from "./HomePage"
import AnalysisPage from "./AnalysisPage"
import HistoryPage from "./HistoryPage"
import SettingsPage from "./SettingsPage"

export type Page = "home" | "analysis" | "history" | "settings"

export const MAIN_COLOR = "#bb0a06"
export const SUB_COLOR = "#d9d9d9"

export default function VideoAnalyser() {
  const [currentPage, setCurrentPage] = useState<Page>("home")
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev)
  }

  return (
    <div className="min-h-screen flex flex-row relative" style={{ backgroundColor: SUB_COLOR }}>
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isSidebarCollapsed={isSidebarCollapsed}
        toggleSidebar={toggleSidebar}
      />

      <main className="flex-1 p-4">
        {currentPage === "home" && <HomePage />}
        {currentPage === "analysis" && <AnalysisPage />}
        {currentPage === "history" && <HistoryPage />}
        {currentPage === "settings" && <SettingsPage />}
      </main>
    </div>
  )
}

