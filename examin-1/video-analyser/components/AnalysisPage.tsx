"use client"

import type React from "react"
import { useState, useEffect, type DragEvent } from "react"
import { motion } from "framer-motion"
import { Film, Upload, FileText } from "lucide-react"
import { MAIN_COLOR, SUB_COLOR } from "./VideoAnalyser"
import type { AnalysisRow } from "./types"
import AnalysisSettings from "./AnalysisSettings"
import AnalysisResults from "./AnalysisResults"

export default function AnalysisPage() {
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null)
  const [analysisResults, setAnalysisResults] = useState<AnalysisRow[][]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isEditing, setIsEditing] = useState(false)
  const [showConfirmPopup, setShowConfirmPopup] = useState(false)
  const [referenceFile, setReferenceFile] = useState<File | null>(null)
  const [analysisPlans, setAnalysisPlans] = useState(1)
  const [useReferenceFile, setUseReferenceFile] = useState(false)
  const [systemPrompt, setSystemPrompt] = useState<string>(
    "動画分析用のデフォルトシステムプロンプト。ここを自由に編集してください。",
  )
  const [isPromptEditing, setIsPromptEditing] = useState(false)
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.5)
  const [activePlanIndex, setActivePlanIndex] = useState(0)
  const [isDragOver, setIsDragOver] = useState(false)
  const [jobId, setJobId] = useState<string | null>(null)

  // API endpoint configuration
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  useEffect(() => {
    // Poll for progress updates when a job is running
    if (!jobId || !isAnalyzing) return;

    const interval = setInterval(async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/progress/${jobId}`);
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        setProgress(data.progress);
        
        // Check if analysis is complete
        if (data.progress >= 100) {
          clearInterval(interval);
          fetchResults();
        }
      } catch (error) {
        console.error("Error fetching progress:", error);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [jobId, isAnalyzing]);

  const fetchResults = async () => {
    if (!jobId) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/results/${jobId}`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      setAnalysisResults(data.results);
      setIsAnalyzing(false);
      
    } catch (error) {
      console.error("Error fetching results:", error);
      setIsAnalyzing(false);
    }
  };

  const startAnalysis = async (file: File) => {
    setSelectedVideo(file);
    setIsAnalyzing(true);
    setAnalysisResults([]);
    setProgress(0);
    
    try {
      // Create form data to send files and parameters
      const formData = new FormData();
      formData.append('video', file);
      
      if (useReferenceFile && referenceFile) {
        formData.append('reference_file', referenceFile);
      }
      
      formData.append('plans', analysisPlans.toString());
      formData.append('system_prompt', systemPrompt);
      formData.append('confidence_threshold', confidenceThreshold.toString());
      
      // Send request to API
      const response = await fetch(`${API_BASE_URL}/api/analyze`, {
        method: 'POST',
        body: formData,
        // No need to set Content-Type as it's automatically set for FormData
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      setJobId(data.job_id);
      
    } catch (error) {
      console.error("Error starting analysis:", error);
      setIsAnalyzing(false);
    }
  };

  const handleVideoInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    if (file) {
      startAnalysis(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      startAnalysis(file);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center" style={{ backgroundColor: SUB_COLOR }}>
      <motion.div
        className="rounded-2xl shadow p-6 mb-6 w-full flex items-center gap-3"
        style={{
          background: `linear-gradient(to right, ${MAIN_COLOR} 0%, ${MAIN_COLOR}CC 100%)`,
        }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Film size={32} className="text-white" />
        <div>
          <h1 className="text-2xl font-bold text-white">ビデオ分析X</h1>
          <p className="text-white mt-1">アップロードした動画の内容を分析し、インテリジェントなプランを提案します。</p>
        </div>
      </motion.div>

      <div className="p-4 w-full max-w-5xl">
        <AnalysisSettings
          analysisPlans={analysisPlans}
          setAnalysisPlans={setAnalysisPlans}
          useReferenceFile={useReferenceFile}
          setUseReferenceFile={setUseReferenceFile}
          confidenceThreshold={confidenceThreshold}
          setConfidenceThreshold={setConfidenceThreshold}
          systemPrompt={systemPrompt}
          setSystemPrompt={setSystemPrompt}
          isPromptEditing={isPromptEditing}
          setIsPromptEditing={setIsPromptEditing}
        />

        <motion.div
          className="rounded-2xl shadow p-6 mb-6 border border-gray-300"
          style={{ backgroundColor: "#ffffff" }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div
            className={`flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
              isDragOver ? "bg-[#bb0a0610] border-[#bb0a06]" : "bg-white border-gray-300"
            }`}
          >
            <Upload size={36} className="mb-2" color={MAIN_COLOR} />
            <p className="text-sm mb-2" style={{ color: MAIN_COLOR }}>
              ここに動画ファイルをドラッグ&ドロップ
            </p>
            <p className="text-xs text-gray-400">または</p>
            <label
              className="mt-2 px-4 py-2 rounded-md text-white font-semibold flex items-center gap-2"
              style={{ backgroundColor: "#bb0a06" }}
            >
              ファイルを選択
              <input
                id="videoInput"
                type="file"
                accept="video/*"
                onChange={handleVideoInputChange}
                className="hidden"
              />
            </label>
          </div>
        </motion.div>

        {useReferenceFile && (
          <motion.div
            className="rounded-2xl shadow p-6 mb-6 border border-gray-300"
            style={{ backgroundColor: "#ffffff" }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center mb-4">
              <FileText size={24} className="mr-2" color={MAIN_COLOR} />
              <h3 className="text-lg font-semibold text-gray-700">参照用ファイルをアップロード</h3>
            </div>
            <input
              id="referenceUpload"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => {
                if (!e.target.files) return
                const f = e.target.files[0]
                if (f) {
                  setReferenceFile(f)
                }
              }}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white p-2 focus:outline-none"
            />
            {referenceFile && <p className="text-sm text-gray-600 mt-2">選択されたファイル: {referenceFile.name}</p>}
          </motion.div>
        )}

        {selectedVideo && !isAnalyzing && analysisResults.length === 0 && (
          <p className="text-gray-700 mb-6">分析結果を待機しています...</p>
        )}

        {isAnalyzing && (
          <motion.div
            className="rounded-2xl shadow p-6 mb-6 bg-white"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-gray-700 mb-2">分析中... {progress}%</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="h-2 rounded-full"
                style={{ backgroundColor: MAIN_COLOR }}
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>
        )}

        {selectedVideo && !isAnalyzing && analysisResults.length > 0 && (
          <AnalysisResults
            selectedVideo={selectedVideo}
            analysisResults={analysisResults}
            activePlanIndex={activePlanIndex}
            setActivePlanIndex={setActivePlanIndex}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            showConfirmPopup={showConfirmPopup}
            setShowConfirmPopup={setShowConfirmPopup}
            confidenceThreshold={confidenceThreshold}
            startAnalysis={startAnalysis}
          />
        )}
      </div>
    </div>
  )
}

