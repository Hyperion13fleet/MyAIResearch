export interface AnalysisTag {
  name: string
  confidence: number // 0.0 ~ 1.0
}

export interface AnalysisRow {
  number: number
  chapter: string
  startTime: string // 開始時刻
  endTime: string // 終了時刻
  content: string
  tags: AnalysisTag[]
}

export interface AnalysisHistory {
  id: number
  title: string
  date: string
  summary: string
}

