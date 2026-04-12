from fastapi import FastAPI, UploadFile, File, HTTPException, Query
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import os
import shutil
import uuid

# Importamos todas as funções (Compressão e Melhoria) do processor.py
from processor import (
    compress_image, 
    compress_video, 
    enhance_image_quality, 
    enhance_video_quality
)

app = FastAPI(
    title="MediaRefine API Pro", 
    description="Backend para compressão e melhoria de media com armazenamento persistente",
    version="1.2.0"
)

# Configuração de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Caminhos absolutos
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
OUTPUT_DIR = os.path.join(BASE_DIR, "outputs")

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

@app.get("/", tags=["Status"])
def read_root():
    """Endpoint de verificação: armazenamento persistente ativo."""
    return {"status": "online", "message": "MediaRefine API Pro a funcionar com armazenamento permanente!"}

# --- ENDPOINTS DE COMPRESSÃO (MODO ECONÓMICO) ---

@app.post("/compress-image/", tags=["Modo Económico"])
async def api_compress_image(
    target_mb: float = Query(..., description="Tamanho final desejado em MB"),
    file: UploadFile = File(...)
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="O ficheiro enviado não é uma imagem válida.")

    file_id = str(uuid.uuid4())[:8]
    input_path = os.path.join(UPLOAD_DIR, f"{file_id}_{file.filename}")
    output_path = os.path.join(OUTPUT_DIR, f"{file_id}_optimized.jpg")
    
    with open(input_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    original_size = os.path.getsize(input_path) / (1024 * 1024)
    compress_image(input_path, output_path, target_mb, original_size)
    
    return FileResponse(output_path, filename=f"optimized_{file.filename}", media_type='image/jpeg')

@app.post("/compress-video/", tags=["Modo Económico"])
async def api_compress_video(
    target_mb: float = Query(..., description="Tamanho final desejado em MB"),
    file: UploadFile = File(...)
):
    if not file.content_type.startswith("video/"):
        raise HTTPException(status_code=400, detail="O ficheiro enviado não é um vídeo válido.")

    file_id = str(uuid.uuid4())[:8]
    input_path = os.path.join(UPLOAD_DIR, f"{file_id}_{file.filename}")
    output_path = os.path.join(OUTPUT_DIR, f"{file_id}_optimized.mp4")
    
    with open(input_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    original_size = os.path.getsize(input_path) / (1024 * 1024)
    success = compress_video(input_path, output_path, target_mb, original_size)
    
    if not success:
        raise HTTPException(status_code=500, detail="O motor FFmpeg falhou ao processar o vídeo.")

    return FileResponse(output_path, filename=f"optimized_{file.filename}", media_type='video/mp4')

# --- ENDPOINTS DE MELHORIA (MODO PRO) ---

@app.post("/upscale-image/", tags=["Modo Pro"])
async def api_upscale_image(file: UploadFile = File(...)):
    """Melhora nitidez e contraste da imagem."""
    file_id = str(uuid.uuid4())[:8]
    input_path = os.path.join(UPLOAD_DIR, f"{file_id}_{file.filename}")
    output_path = os.path.join(OUTPUT_DIR, f"{file_id}_pro.jpg")
    
    with open(input_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    success = enhance_image_quality(input_path, output_path)
    if not success:
        raise HTTPException(status_code=500, detail="Erro ao melhorar imagem.")

    return FileResponse(output_path, filename=f"pro_{file.filename}", media_type='image/jpeg')

@app.post("/upscale-video/", tags=["Modo Pro"])
async def api_upscale_video(file: UploadFile = File(...)):
    """Melhora nitidez e cores do vídeo."""
    file_id = str(uuid.uuid4())[:8]
    input_path = os.path.join(UPLOAD_DIR, f"{file_id}_{file.filename}")
    output_path = os.path.join(OUTPUT_DIR, f"{file_id}_pro.mp4")
    
    with open(input_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    success = enhance_video_quality(input_path, output_path)
    if not success:
        raise HTTPException(status_code=500, detail="Erro ao melhorar vídeo.")

    return FileResponse(output_path, filename=f"pro_{file.filename}", media_type='video/mp4')