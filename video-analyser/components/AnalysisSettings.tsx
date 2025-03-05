import { MAIN_COLOR } from "./VideoAnalyser"
import { motion } from "framer-motion"
import { Edit3, CheckCircle2 } from "lucide-react"

interface AnalysisSettingsProps {
  analysisPlans: number
  setAnalysisPlans: (value: number) => void
  useReferenceFile: boolean
  setUseReferenceFile: (value: boolean) => void
  confidenceThreshold: number
  setConfidenceThreshold: (value: number) => void
  systemPrompt: string
  setSystemPrompt: (value: string) => void
  isPromptEditing: boolean
  setIsPromptEditing: (value: boolean) => void
}

export default function AnalysisSettings({
  analysisPlans,
  setAnalysisPlans,
  useReferenceFile,
  setUseReferenceFile,
  confidenceThreshold,
  setConfidenceThreshold,
  systemPrompt,
  setSystemPrompt,
  isPromptEditing,
  setIsPromptEditing,
}: AnalysisSettingsProps) {
  return (
    <motion.div
      className="rounded-2xl shadow-xl p-6 mb-6 bg-white"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-4">
        <h3 className="text-xl font-bold mb-2" style={{ color: MAIN_COLOR }}>
          分析設定
        </h3>
        <p className="text-sm text-gray-500">
          分析プランの数や参照ファイルの有無など、動画分析のための各種設定を行います。
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium" style={{ color: MAIN_COLOR }}>
            分析プラン数: {analysisPlans}
          </label>
          <input
            type="range"
            min={1}
            max={5}
            value={analysisPlans}
            onChange={(e) => setAnalysisPlans(Number.parseInt(e.target.value, 10))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            style={{ accentColor: MAIN_COLOR }}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium" style={{ color: MAIN_COLOR }}>
            参照ファイル使用
          </label>
          <div className="flex items-center">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={useReferenceFile}
                onChange={(e) => setUseReferenceFile(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#bb0a06] peer-checked:bg-[#bb0a06] relative">
                <div className="absolute top-[2px] left-[2px] bg-white border border-gray-300 rounded-full h-5 w-5 transition-all peer-checked:translate-x-5" />
              </div>
            </label>
            <span className="ml-2 text-sm" style={{ color: MAIN_COLOR }}>
              {useReferenceFile ? "ON" : "OFF"}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <label className="text-sm font-medium block mb-2" style={{ color: MAIN_COLOR }}>
          タグ信頼度閾値: {confidenceThreshold.toFixed(2)}
        </label>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={confidenceThreshold}
          onChange={(e) => setConfidenceThreshold(Number.parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          style={{ accentColor: MAIN_COLOR }}
        />
        <p className="text-xs text-gray-500 mt-1">この閾値以下の信頼度タグは無視するなどの処理に利用できます</p>
      </div>

      <div className="mt-6">
        <label className="text-sm font-medium block mb-2" style={{ color: MAIN_COLOR }}>
          システムプロンプト
        </label>
        <textarea
          className="w-full border border-gray-300 rounded p-3 text-sm h-32 focus:outline-none"
          style={{ outlineColor: MAIN_COLOR }}
          value={systemPrompt}
          onChange={(e) => {
            if (isPromptEditing) {
              setSystemPrompt(e.target.value)
            }
          }}
          readOnly={!isPromptEditing}
        />
        <p className="text-xs text-gray-500 mt-1 mb-3">動画分析時に使用するシステムプロンプトを編集できます。</p>

        <div className="flex gap-3">
          {!isPromptEditing ? (
            <button
              className="px-4 py-2 rounded-md text-white font-semibold flex items-center gap-2"
              style={{ backgroundColor: "#bb0a06" }}
              onClick={() => setIsPromptEditing(true)}
            >
              <Edit3 size={16} />
              システムプロンプトを編集
            </button>
          ) : (
            <button
              className="px-4 py-2 rounded-md text-white font-semibold flex items-center gap-2"
              style={{ backgroundColor: "#bb0a06" }}
              onClick={() => setIsPromptEditing(false)}
            >
              <CheckCircle2 size={16} />
              システムプロンプトを確定
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

