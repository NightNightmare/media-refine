export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold italic">
            MR
          </div>
          <span className="text-lg font-black tracking-tighter text-gray-900">
            MEDIA<span className="text-blue-600">REFINE</span>
          </span>
        </div>

        {/* Botão de Início comentado para referência futura:
        <button className="text-xs font-bold bg-gray-900 text-white px-5 py-2 rounded-full hover:bg-blue-600 transition-all">
          Início
        </button> 
        */}
      </div>
    </nav>
  );
}