# 🎬 MediaRefine.pro

![Next.js](https://img.shields.io/badge/Next.js-000?style=for-the-badge&logo=next.js&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![OpenCV](https://img.shields.io/badge/OpenCV-5C3EE8?style=for-the-badge&logo=opencv&logoColor=white)
![FFmpeg](https://img.shields.io/badge/FFmpeg-007800?style=for-the-badge&logo=ffmpeg&logoColor=white)

O **MediaRefine** é uma solução Full-Stack robusta para otimização e melhoria de media. A plataforma utiliza inteligência algorítmica para reduzir o tamanho de ficheiros sem sacrificar a estética, oferecendo ferramentas de refinamento visual de nível profissional.

## 🏗️ Arquitetura do Sistema

* **Frontend**: Interface reativa desenvolvida com **Next.js 14**, focada em UX/UI minimalista e feedback em tempo real.
* **Backend**: API assíncrona com **FastAPI**, integrando **OpenCV** para visão computacional e **FFmpeg** para engenharia de vídeo.

---

## ✨ Funcionalidades Principais

### 🍃 Modo Económico (Compressão Inteligente)
Otimização focada em reduzir o peso digital para armazenamento ou partilha rápida.
* **Imagens**: Processamento via Pillow com preservação de metadados essenciais.
* **Vídeos**: Re-encodagem via codec `libx264` com controlo dinâmico de CRF (Constant Rate Factor).

### ✨ Modo Pro (Refinamento de Qualidade)
Pipeline avançada de pós-processamento para transformar media comum em resultados de alta definição.
* **Imagens**: 
    * `Denoising`: Algoritmo de redução de ruído não-local.
    * `Unsharp Masking`: Realce de micro-contrastes e texturas.
    * `CLAHE`: Equalização de histograma adaptativa para iluminação equilibrada.
* **Vídeos**: Filtros de nitidez e saturação calibrados para aspeto cinematográfico.

---

## 🛠️ Instalação e Configuração

### 📋 Pré-requisitos
* **Python 3.10+**
* **Node.js 18+**
* **FFmpeg** (Instalado e configurado no `PATH` do sistema)

### 1️⃣ Servidor Backend
```bash
cd backend
python -m venv venv

# Ativação
# Windows: venv\Scripts\activate | Linux/Mac: source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload

API ativa em: http://127.0.0.1:8000

Interface Frontend

cd frontend
npm install
npm run dev

App disponível em: http://localhost:3000


📂 Gestão de Ficheiros

O sistema mantém a persistência local para auditoria e controlo manual:

backend/uploads/: Cache de ficheiros de entrada (identificados por UUID).

backend/outputs/: Histórico de ficheiros processados.


🚀 Stack Tecnológica

Core: Next.js 14, Tailwind CSS, FastAPI.

Processamento: OpenCV, FFmpeg, Pillow, NumPy.

Comunicação: Axios (Multipart/form-data).


Desenvolvido por Ângelo Vaz.


## 📝 Licença
Este projeto está sob a licença MIT - veja o ficheiro [LICENSE](LICENSE) para mais detalhes. Disponível para uso em portfólios e fins educativos.