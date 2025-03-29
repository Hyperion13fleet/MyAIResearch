"use client"
import { motion } from "framer-motion"
import { Home } from "lucide-react"
import { MAIN_COLOR, SUB_COLOR } from "./VideoAnalyser"
import type { AnalysisHistory } from "./types"

const analysisHistory: AnalysisHistory[] = [
  {
    id: 1,
    title: "ノートPC初期セットアップ手順",
    date: "2025-02-01",
    summary: "OSインストールやアカウント設定、ドライバ導入の流れを解説したマニュアル",
  },
  {
    id: 2,
    title: "ハンバーグ調理マニュアル",
    date: "2025-02-05",
    summary: "材料の準備から焼き加減の目安、盛り付けまでを工程化",
  },
  {
    id: 3,
    title: "DIYで棚を組み立てる作業手順",
    date: "2025-02-10",
    summary: "必要な工具や安全上の注意、具体的な組み立てプロセスを段階的にまとめたマニュアル",
  },
]

export default function HomePage() {
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
          <Home size={32} className="text-white mr-3" />
          <h2 className="text-2xl font-bold text-white">ホーム</h2>
        </div>
        <p className="text-white mt-2">これまでの分析結果を確認できます</p>
      </motion.div>

      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {analysisHistory.map((item) => (
            <motion.div
              key={item.id}
              className="bg-white rounded-2xl shadow p-4 flex flex-col justify-between"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-500 text-sm mb-2">{item.date}</p>
              <p className="text-gray-700 flex-1">{item.summary}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

