"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [targetSize, setTargetSize] = useState<number>(60);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'compress' | 'enhance'>('compress');
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'info' | null, msg: string }>({ type: null, msg: "" });

  useEffect(() => {
    if (status.type === 'success') {
      const timer = setTimeout(() => {
        setFile(null);
        setStatus({ type: null, msg: "" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setStatus({ type: null, msg: "" });
    }
  };

  const processMedia = async () => {
    if (!file) return;
    setLoading(true);
    setStatus({ type: 'info', msg: activeTab === 'compress' ? "A otimizar ficheiro..." : "A melhorar qualidade..." });

    const formData = new FormData();
    formData.append("file", file);
    
    const isVideo = file.type.startsWith("video/");
    let endpoint = "";
    let urlParams = "";

    // Lógica de Seleção de Endpoint baseada na Tab Ativa
    if (activeTab === 'enhance') {
      endpoint = isVideo ? "upscale-video" : "upscale-image";
    } else {
      endpoint = isVideo ? "compress-video" : "compress-image";
      const originalSizeMB = file.size / (1024 * 1024);
      const calculatedTarget = (originalSizeMB * (targetSize / 100)).toFixed(2);
      urlParams = `?target_mb=${calculatedTarget}`;
    }

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/${endpoint}/${urlParams}`,
        formData, { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      const prefix = activeTab === 'enhance' ? "pro_" : "optimized_";
      link.setAttribute("download", `${prefix}${file.name}`);
      document.body.appendChild(link);
      link.click();
      
      setStatus({ type: 'success', msg: "Sucesso! Ficheiro processado. A limpar em 5s..." });
    } catch (error) {
      setStatus({ type: 'error', msg: "Erro na ligação ao servidor." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa]">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter mb-6">
            Media sem limites, <br />
            <span className="text-blue-600 italic">qualidade sem perdas.</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto mb-10">
            A ferramenta definitiva para criadores. Comprime vídeos e melhora imagens com inteligência artificial.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => setActiveTab('compress')}
              className={`px-8 py-4 rounded-2xl font-bold transition-all ${activeTab === 'compress' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white text-gray-400 border border-gray-100 hover:text-gray-600'}`}
            >
              Comprimir Agora
            </button>
            <button 
              onClick={() => setActiveTab('enhance')}
              className={`px-8 py-4 rounded-2xl font-bold transition-all ${activeTab === 'enhance' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white text-gray-400 border border-gray-100 hover:text-gray-600'}`}
            >
              Melhorar Qualidade
            </button>
          </div>
        </div>
      </section>

      {/* Container Centralizado da Ferramenta */}
      <section className="pb-20 px-6 flex justify-center">
        <div className="w-full max-w-md">
          <div className="bg-gray-100 p-2 rounded-[2.5rem] shadow-inner">
            <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm">
              
              {/* Status Badge de Modo */}
              <div className="flex justify-center mb-6">
                <span className={`text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest ${activeTab === 'enhance' ? 'bg-indigo-50 text-indigo-600' : 'bg-blue-50 text-blue-600'}`}>
                  {activeTab === 'enhance' ? '✨ Modo Profissional' : '🍃 Modo Económico'}
                </span>
              </div>

              {/* Drag and Drop Area */}
              <div className="relative group border-2 border-dashed border-gray-200 rounded-3xl p-8 text-center hover:border-blue-400 hover:bg-blue-50/20 transition-all">
                <input 
                  type="file" 
                  onChange={handleFileChange} 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  accept="image/*,video/*" 
                />
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform ${activeTab === 'enhance' ? 'bg-indigo-50 text-indigo-600' : 'bg-blue-50 text-blue-600'}`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <p className="text-gray-900 font-bold text-sm">
                  {file ? file.name : "Solta o teu ficheiro aqui"}
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  {file ? `${(file.size/(1024*1024)).toFixed(2)} MB` : "Imagens ou Vídeos"}
                </p>
              </div>

              {/* Opções dinâmicas */}
              {file && !loading && (
                <div className="mt-6 space-y-6 animate-in fade-in slide-in-from-bottom-2">
                  
                  {/* Se for modo compressão, mostra intensidade */}
                  {activeTab === 'compress' && (
                    <div>
                      <p className="text-[10px] font-black text-gray-400 mb-3 text-center uppercase tracking-[0.2em]">Intensidade</p>
                      <div className="grid grid-cols-3 gap-2">
                        {[40, 60, 80].map(v => (
                          <button 
                            key={v} 
                            onClick={() => setTargetSize(v)} 
                            className={`py-3 rounded-xl text-xs font-black transition-all ${targetSize === v ? 'bg-gray-900 text-white shadow-lg' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                          >
                            {v}%
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Info Modo Melhoria */}
                  {activeTab === 'enhance' && (
                    <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 text-center">
                      <p className="text-[11px] font-bold text-indigo-700">
                        O algoritmo aplicará correção de nitidez e balanço de cores inteligente.
                      </p>
                    </div>
                  )}
                  
                  <button 
                    onClick={processMedia} 
                    className={`w-full py-4 rounded-2xl font-black shadow-xl transition-all uppercase text-sm tracking-wider text-white ${activeTab === 'enhance' ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-100'}`}
                  >
                    {activeTab === 'enhance' ? 'Melhorar Agora' : 'Otimizar Agora'}
                  </button>
                </div>
              )}

              {/* Loading State */}
              {loading && (
                <div className="mt-8 text-center">
                  <div className={`inline-block w-10 h-10 border-4 border-t-transparent rounded-full animate-spin mb-3 ${activeTab === 'enhance' ? 'border-indigo-600' : 'border-blue-600'}`}></div>
                  <p className={`font-black text-xs uppercase tracking-widest animate-pulse ${activeTab === 'enhance' ? 'text-indigo-600' : 'text-blue-600'}`}>Processando...</p>
                </div>
              )}

              {/* Status Message */}
              {status.msg && !loading && (
                <div className={`mt-4 p-4 rounded-2xl text-center text-xs font-bold ${status.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                  {status.msg}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}