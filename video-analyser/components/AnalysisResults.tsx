import { motion, AnimatePresence } from "framer-motion"
import { Edit3, CheckCircle2 } from "lucide-react"
import { MAIN_COLOR } from "./VideoAnalyser"
import type { AnalysisRow } from "./types"

interface AnalysisResultsProps {
  selectedVideo: File
  analysisResults: AnalysisRow[][]
  activePlanIndex: number
  setActivePlanIndex: (index: number) => void
  isEditing: boolean
  setIsEditing: (value: boolean) => void
  showConfirmPopup: boolean
  setShowConfirmPopup: (value: boolean) => void
  confidenceThreshold: number
  startAnalysis: (file: File) => void
  setAnalysisResults: (value: AnalysisRow[][]) => void
}

export default function AnalysisResults({
  selectedVideo,
  analysisResults,
  activePlanIndex,
  setActivePlanIndex,
  isEditing,
  setIsEditing,
  showConfirmPopup,
  setShowConfirmPopup,
  confidenceThreshold,
  startAnalysis,
  setAnalysisResults,
}: AnalysisResultsProps) {
  const getConfidenceColor = (confidence: number) => {
    const baseHue = 3
    const baseSat = 80
    const minLight = 80
    const maxLight = 40
    const currentLight = minLight - confidence * (minLight - maxLight)
    return `hsl(${baseHue}, ${baseSat}%, ${currentLight}%)`
  }

  const renderTableCell = (planIndex: number, rowIndex: number, colKey: keyof AnalysisRow, value: string) => {
    if (!isEditing || colKey === "tags" || colKey === "number") {
      return <span>{value}</span>
    } else {
      return (
        <input
          className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none"
          style={{ outlineColor: MAIN_COLOR }}
          value={value}
          onChange={(e) => {
            const newVal = e.target.value
            setAnalysisResults((prev) => {
              const newData = [...prev]
              const planData = [...newData[planIndex]]
              ;(planData[rowIndex] as any)[colKey] = newVal
              newData[planIndex] = planData
              return newData
            })
          }}
        />
      )
    }
  }

  return (
    <>
      <div className="flex items-center gap-4 mb-6">
        <motion.video
          key={selectedVideo.name}
          src={URL.createObjectURL(selectedVideo)}
          controls
          className="rounded-2xl shadow-lg w-full md:w-2/3"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        />
        <button
          className="px-4 py-2 rounded-md text-white font-semibold flex items-center gap-2"
          style={{ backgroundColor: MAIN_COLOR }}
          onClick={() => {
            if (selectedVideo) {
              startAnalysis(selectedVideo)
            }
          }}
        >
          再実行
        </button>
      </div>

      {analysisResults && analysisResults.length > 0 ? (
        <div className="mb-6 flex flex-wrap gap-2 items-center">
          {analysisResults.map((_, idx) => {
            const isActive = activePlanIndex === idx
            return (
              <button
                key={idx}
                onClick={() => setActivePlanIndex(idx)}
                className={`px-3 py-2 rounded-md border text-sm font-medium transition-colors ${
                  isActive
                    ? `text-white border-[${MAIN_COLOR}]`
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-200"
                }`}
                style={isActive ? { backgroundColor: MAIN_COLOR, borderColor: MAIN_COLOR } : {}}
              >
                分析プラン {idx + 1}
              </button>
            )
          })}
        </div>
      ) : (
        <p>分析結果がありません。</p>
      )}

      <motion.div
        className="rounded-2xl shadow p-6 relative bg-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold" style={{ color: MAIN_COLOR }}>
            分析プラン {activePlanIndex + 1}
          </h2>
        </div>
        {analysisResults && analysisResults[activePlanIndex] ? (
          <table className="w-full text-sm overflow-hidden rounded-lg">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-3 text-left font-medium">#</th>
                <th className="px-4 py-3 text-left font-medium">チャプター</th>
                <th className="px-4 py-3 text-left font-medium">開始時刻</th>
                <th className="px-4 py-3 text-left font-medium">終了時刻</th>
                <th className="px-4 py-3 text-left font-medium">内容</th>
                <th className="px-4 py-3 text-left font-medium">タグ</th>
              </tr>
            </thead>
            <tbody>
              {analysisResults[activePlanIndex].map((row, rowIndex) => (
                <tr key={row.number} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    {renderTableCell(activePlanIndex, rowIndex, "number", String(row.number))}
                  </td>
                  <td className="px-4 py-3">{renderTableCell(activePlanIndex, rowIndex, "chapter", row.chapter)}</td>
                  <td className="px-4 py-3">
                    {renderTableCell(activePlanIndex, rowIndex, "startTime", row.startTime)}
                  </td>
                  <td className="px-4 py-3">{renderTableCell(activePlanIndex, rowIndex, "endTime", row.endTime)}</td>
                  <td className="px-4 py-3">{renderTableCell(activePlanIndex, rowIndex, "content", row.content)}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      {row.tags
                        .filter((tag) => tag.confidence >= confidenceThreshold)
                        .map((tag, tagIndex) => {
                          const bgColor = getConfidenceColor(tag.confidence)
                          return (
                            <span
                              key={tagIndex}
                              className={`relative px-2 py-1 rounded-full text-xs text-white flex items-center gap-1 ${
                                isEditing ? "pr-6" : ""
                              }`}
                              style={{ backgroundColor: bgColor }}
                            >
                              {tag.name}
                              {isEditing && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newData = [...analysisResults]
                                    const planData = [...newData[activePlanIndex]]
                                    const newTags = [...planData[rowIndex].tags]
                                    newTags.splice(tagIndex, 1)
                                    planData[rowIndex] = {
                                      ...planData[rowIndex],
                                      tags: newTags,
                                    }
                                    newData[activePlanIndex] = planData
                                    setAnalysisResults(newData)
                                  }}
                                  className="absolute right-1 text-white text-xs hover:text-gray-100"
                                >
                                  ×
                                </button>
                              )}
                            </span>
                          )
                        })}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>選択された分析プランのデータがありません。</p>
        )}

        <p className="text-xs text-gray-400 mt-2">
          タグの濃さは信頼度を表しています。薄いほど低く、濃いほど高いことを示します。 （閾値{" "}
          {confidenceThreshold.toFixed(2)} 以上のみ表示中）
        </p>

        <div className="mt-6 flex justify-end gap-4">
          <button
            className="px-4 py-2 rounded-md text-white font-semibold flex items-center gap-2"
            style={{ backgroundColor: "#ff9f0f" }}
            onClick={() => setIsEditing(!isEditing)}
          >
            <Edit3 size={16} />
            {isEditing ? "編集終了" : "編集"}
          </button>
          <button
            className="px-4 py-2 rounded-md text-white font-semibold flex items-center gap-2"
            style={{ backgroundColor: "#00a12e" }}
            onClick={() => {
              setIsEditing(false)
              setShowConfirmPopup(true)
              setTimeout(() => {
                setShowConfirmPopup(false)
              }, 3000)
            }}
          >
            <CheckCircle2 size={16} />
            確定
          </button>

          <AnimatePresence>
            {showConfirmPopup && (
              <motion.div
                key="confirm"
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <div className="px-4 py-2 rounded-md shadow-md text-white" style={{ backgroundColor: "#00a12e" }}>
                  <p>DBへの書き込みが完了しました</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  )
}

