import type React from "react"
import { Home, Film, History, Settings, Video, ChevronLeft, ChevronRight } from "lucide-react"
import { MAIN_COLOR } from "./VideoAnalyser"
import type { Page } from "./VideoAnalyser"

interface SidebarProps {
  currentPage: Page
  setCurrentPage: (page: Page) => void
  isSidebarCollapsed: boolean
  toggleSidebar: () => void
}

export default function Sidebar({ currentPage, setCurrentPage, isSidebarCollapsed, toggleSidebar }: SidebarProps) {
  return (
    <aside
      className={`shadow-md relative transition-all duration-300 flex flex-col bg-white ${
        isSidebarCollapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex items-center px-4 py-4" style={{ backgroundColor: MAIN_COLOR, color: "#ffffff" }}>
        <Video className="mr-2" />
        {!isSidebarCollapsed && <span className="font-bold text-lg">VideoAnalyser</span>}
      </div>

      <button onClick={toggleSidebar} className="absolute top-4 right-4 text-gray-100 hover:text-gray-300">
        {isSidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>

      <nav className="mt-4 space-y-4 px-2 flex-1">
        <SidebarButton
          icon={<Home className="mr-2" />}
          text="ホーム"
          onClick={() => setCurrentPage("home")}
          isActive={currentPage === "home"}
          isSidebarCollapsed={isSidebarCollapsed}
        />
        <SidebarButton
          icon={<Film className="mr-2" />}
          text="分析"
          onClick={() => setCurrentPage("analysis")}
          isActive={currentPage === "analysis"}
          isSidebarCollapsed={isSidebarCollapsed}
        />
        <SidebarButton
          icon={<History className="mr-2" />}
          text="履歴"
          onClick={() => setCurrentPage("history")}
          isActive={currentPage === "history"}
          isSidebarCollapsed={isSidebarCollapsed}
        />
      </nav>

      <div className="px-2 pb-4">
        <SidebarButton
          icon={<Settings className="mr-2" />}
          text="設定"
          onClick={() => setCurrentPage("settings")}
          isActive={currentPage === "settings"}
          isSidebarCollapsed={isSidebarCollapsed}
        />
      </div>
    </aside>
  )
}

interface SidebarButtonProps {
  icon: React.ReactNode
  text: string
  onClick: () => void
  isActive: boolean
  isSidebarCollapsed: boolean
}

function SidebarButton({ icon, text, onClick, isActive, isSidebarCollapsed }: SidebarButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full text-left px-2 py-2 rounded hover:bg-[#bb0a0610] font-medium ${
        isActive ? "bg-[#bb0a0610]" : ""
      }`}
    >
      {icon}
      {!isSidebarCollapsed && text}
    </button>
  )
}

