"use client"
import { motion } from "framer-motion"
import { Settings } from "lucide-react"
import { MAIN_COLOR, SUB_COLOR } from "./VideoAnalyser"

export default function SettingsPage() {
  return (
    <motion.div
      className="h-full"
      style={{ backgroundColor: SUB_COLOR }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="rounded-2xl shadow p-6 mb-6"
        style={{
          background: `linear-gradient(to right, ${MAIN_COLOR} 0%, ${MAIN_COLOR}CC 100%)`,
        }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center">
          <Settings size={32} className="text-white mr-3" />
          <h2 className="text-2xl font-bold text-white">設定</h2>
        </div>
        <p className="text-white mt-2">サービスに関する設定を行います</p>
      </motion.div>
      <div className="p-4">
        <p className="text-gray-700">ここにユーザーアカウントや通知、テーマカラー変更などの設定UIを配置できます。</p>
      </div>
    </motion.div>
  )
}

