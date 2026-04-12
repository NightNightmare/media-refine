import os
import subprocess
import cv2  # Necessário: pip install opencv-python
import numpy as np
from PIL import Image

def compress_image(input_path: str, output_path: str, target_size_mb: float, original_size_mb: float):
    """ Processa a compressão de imagem utilizando a biblioteca Pillow. """
    img = Image.open(input_path)
    
    if img.mode in ("RGBA", "P"):
        img = img.convert("RGB")
    
    min_safe_size = original_size_mb * 0.15
    effective_target = max(target_size_mb, min_safe_size)
    
    quality = 95
    current_size = original_size_mb
    
    while quality > 10:
        img.save(output_path, "JPEG", optimize=True, quality=quality)
        current_size = os.path.getsize(output_path) / (1024 * 1024)
        
        if current_size <= effective_target:
            break
        quality -= 5
        
    return round(current_size, 2), quality

def compress_video(input_path: str, output_path: str, target_size_mb: float, original_size_mb: float):
    """ Comprime vídeos utilizando a ferramenta externa FFmpeg. """
    min_safe_size = original_size_mb * 0.15
    effective_target = max(target_size_mb, min_safe_size)
    
    crf_value = "28"
    if effective_target < (original_size_mb * 0.4):
        crf_value = "32"

    command = [
        'ffmpeg', '-i', input_path,
        '-vcodec', 'libx264', '-crf', crf_value,
        '-preset', 'medium', '-acodec', 'aac',
        '-b:a', '128k', '-y', output_path
    ]

    try:
        subprocess.run(command, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        final_size = os.path.getsize(output_path) / (1024 * 1024)
        return round(final_size, 2)
    except Exception as e:
        print(f"Erro no compressor de vídeo: {e}")
        return None

# --- FUNÇÕES MODO PRO (ENHANCE) CORRIGIDAS ---

def enhance_image_quality(input_path: str, output_path: str):
    """
    Melhora a nitidez e o contraste da imagem usando OpenCV.
    Implementação robusta para suportar acentos e caracteres especiais no Windows.
    """
    try:
        # 1. LEITURA ROBUSTA: Abrir via bytes para evitar erros de caminho com acentos
        with open(input_path, "rb") as f:
            chunk = f.read()
        nparr = np.frombuffer(chunk, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if img is None:
            print(f"Erro: Não foi possível decodificar a imagem em {input_path}")
            return False

        # Garante que a imagem tem 3 canais (RGB) para o processamento de ruído
        if len(img.shape) == 3 and img.shape[2] == 4:
            img = cv2.cvtColor(img, cv2.COLOR_BGRA2BGR)
        
        # 2. Redução de ruído suave (Denoising)
        dst = cv2.fastNlMeansDenoisingColored(img, None, 3, 3, 7, 21)
        
        # 3. Máscara de Nitidez (Unsharp Masking)
        gaussian_blur = cv2.GaussianBlur(dst, (0, 0), 3)
        sharpened = cv2.addWeighted(dst, 1.5, gaussian_blur, -0.5, 0)
        
        # 4. CLAHE (Contraste Adaptativo) para realçar detalhes
        lab = cv2.cvtColor(sharpened, cv2.COLOR_BGR2LAB)
        l, a, b = cv2.split(lab)
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
        cl = clahe.apply(l)
        limg = cv2.merge((cl,a,b))
        final_img = cv2.cvtColor(limg, cv2.COLOR_LAB2BGR)
        
        # 5. ESCRITA ROBUSTA: Salvar via buffer para garantir integridade do ficheiro
        is_success, buffer = cv2.imencode(".jpg", final_img, [cv2.IMWRITE_JPEG_QUALITY, 95])
        if is_success:
            with open(output_path, "wb") as f:
                f.write(buffer)
            return True
        return False
        
    except Exception as e:
        print(f"Erro ao melhorar imagem: {e}")
        return False

def enhance_video_quality(input_path: str, output_path: str):
    """
    Melhora a percepção de qualidade do vídeo usando filtros de 
    nitidez e saturação do FFmpeg.
    """
    # Filtros FFmpeg: nitidez adaptativa e leve correção de cor
    filters = "unsharp=5:5:1.0:5:5:0.0,eq=contrast=1.05:saturation=1.1"
    
    command = [
        'ffmpeg', '-i', input_path,
        '-vf', filters,
        '-c:v', 'libx264',
        '-crf', '18',  # Qualidade alta (perdas mínimas)
        '-preset', 'slow',
        '-c:a', 'copy', 
        '-y', output_path
    ]

    try:
        subprocess.run(command, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        return True
    except Exception as e:
        print(f"Erro ao melhorar vídeo: {e}")
        return False