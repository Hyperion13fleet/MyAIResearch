from fastapi import FastAPI, UploadFile, File, Form, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import List, Optional
import os
import time
import uuid
from pydantic import BaseModel
import json

app = FastAPI(title="Video Analysis API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for analysis results (replace with DB in production)
analysis_results = {}
analysis_progress = {}

class AnalysisTag(BaseModel):
    name: str
    confidence: float

class AnalysisRow(BaseModel):
    number: int
    chapter: str
    startTime: str
    endTime: str
    content: str
    tags: List[AnalysisTag]

# Mock function to simulate video analysis
def analyze_video_task(video_path: str, job_id: str, plans: int, system_prompt: str, reference_file_path: Optional[str] = None):
    # Simulate processing time
    total_steps = 10
    for step in range(total_steps):
        time.sleep(1)  # Simulate work
        progress = int((step + 1) / total_steps * 100)
        analysis_progress[job_id] = progress
    
    # Generate mock analysis results (multiple plans as requested)
    all_results = []
    
    for plan_index in range(plans):
        results = []
        for i in range(5):  # Generate 5 analysis rows per plan
            tags = [
                AnalysisTag(name=f"タグ{i*2+1}", confidence=0.7 + (0.2 * (i % 3))/10),
                AnalysisTag(name=f"タグ{i*2+2}", confidence=0.6 + (0.3 * (i % 2))/10)
            ]
            
            row = AnalysisRow(
                number=i+1,
                chapter=f"チャプター {i+1}",
                startTime=f"00:{i*5:02d}:00",
                endTime=f"00:{(i+1)*5:02d}:00",
                content=f"Plan {plan_index+1}: コンテンツ解析の結果サンプル {i+1}。システムプロンプト: '{system_prompt[:20]}...'",
                tags=tags
            )
            results.append(row)
        all_results.append(results)
    
    # Store results
    analysis_results[job_id] = all_results
    
    # Clean up
    if os.path.exists(video_path):
        os.remove(video_path)
    if reference_file_path and os.path.exists(reference_file_path):
        os.remove(reference_file_path)

@app.post("/api/analyze")
async def analyze_video(
    background_tasks: BackgroundTasks,
    video: UploadFile = File(...),
    reference_file: Optional[UploadFile] = None,
    plans: int = Form(1),
    system_prompt: str = Form("Default system prompt"),
    confidence_threshold: float = Form(0.5)
):
    # Generate unique job ID
    job_id = str(uuid.uuid4())
    
    # Create temporary directory if it doesn't exist
    os.makedirs("temp", exist_ok=True)
    
    # Save the uploaded video
    video_path = f"temp/{job_id}_{video.filename}"
    with open(video_path, "wb") as f:
        f.write(await video.read())
    
    # Save reference file if provided
    reference_file_path = None
    if reference_file:
        reference_file_path = f"temp/{job_id}_{reference_file.filename}"
        with open(reference_file_path, "wb") as f:
            f.write(await reference_file.read())
    
    # Initialize progress
    analysis_progress[job_id] = 0
    
    # Start analysis in background
    background_tasks.add_task(
        analyze_video_task,
        video_path,
        job_id,
        plans,
        system_prompt,
        reference_file_path
    )
    
    return {"job_id": job_id, "message": "Analysis started"}

@app.get("/api/progress/{job_id}")
async def get_progress(job_id: str):
    if job_id not in analysis_progress:
        return JSONResponse(status_code=404, content={"message": "Job not found"})
    
    progress = analysis_progress[job_id]
    return {"progress": progress}

@app.get("/api/results/{job_id}")
async def get_results(job_id: str):
    if job_id not in analysis_results:
        return JSONResponse(status_code=404, content={"message": "Results not found or analysis still in progress"})
    
    results = analysis_results[job_id]
    return {"results": results}

@app.delete("/api/results/{job_id}")
async def delete_results(job_id: str):
    if job_id in analysis_results:
        del analysis_results[job_id]
    if job_id in analysis_progress:
        del analysis_progress[job_id]
    return {"message": "Results deleted successfully"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)