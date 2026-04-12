export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-white border-t border-gray-100 py-10 mt-auto">
      <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-sm text-gray-400 font-medium">
          © {currentYear} <span className="text-gray-900 font-bold">MediaRefine</span>. Todos os direitos reservados.
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>Desenvolvido com ⚡ por</span>
          <a 
            href="https://portifolio-angelo.vercel.app/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 font-bold hover:underline"
          >
            Ângelo Vaz
          </a>
        </div>
      </div>
    </footer>
  );
}