
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Wrench, UserPlus, Home as HomeIcon, ShieldCheck, LogIn, CheckCircle2, Hammer } from 'lucide-react';

export const ClientLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminPath = location.pathname.startsWith('/admin');

  if (isAdminPath) return <>{children}</>;

  const handleNavigate = (path: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" onClick={handleNavigate('/')} className="flex items-center gap-2 no-underline group">
            <div className="bg-indigo-600 p-1.5 rounded-lg shadow-md group-hover:scale-110 transition-transform">
              <Hammer className="text-white w-5 h-5" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900">
              Sua Mão <span className="text-indigo-600">de Obra</span>
            </span>
          </Link>
          
          <nav className="hidden sm:flex items-center gap-6">
            <Link to="/" onClick={handleNavigate('/')} className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors no-underline">Início</Link>
            <Link to="/cadastro" onClick={handleNavigate('/cadastro')} className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors no-underline">Seja um Parceiro</Link>
            <div className="w-px h-4 bg-slate-200"></div>
            <button 
              onClick={handleNavigate('/admin')}
              className="flex items-center gap-1.5 text-sm font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full hover:bg-indigo-100 transition-all border-none cursor-pointer"
            >
              <ShieldCheck size={16} />
              Painel Admin
            </button>
          </nav>

          <button 
            onClick={handleNavigate('/admin')}
            className="sm:hidden text-slate-400 p-2 bg-transparent border-none cursor-pointer"
          >
            <ShieldCheck size={22} />
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        {children}
      </main>

      {/* Mobile Nav */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-3 flex justify-around items-center z-50 shadow-[0_-4px_10px_-1px_rgba(0,0,0,0.08)]">
        <button 
          onClick={handleNavigate('/')} 
          className={`flex flex-col items-center gap-1 bg-transparent border-none cursor-pointer ${location.pathname === '/' ? 'text-indigo-600' : 'text-slate-400'}`}
        >
          <HomeIcon size={20} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Início</span>
        </button>
        <button 
          onClick={handleNavigate('/cadastro')} 
          className={`flex flex-col items-center gap-1 bg-transparent border-none cursor-pointer ${location.pathname === '/cadastro' ? 'text-indigo-600' : 'text-slate-400'}`}
        >
          <UserPlus size={20} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Cadastro</span>
        </button>
        <button 
          onClick={handleNavigate('/admin')}
          className={`flex flex-col items-center gap-1 bg-transparent border-none cursor-pointer ${location.pathname.startsWith('/admin') ? 'text-indigo-600' : 'text-slate-400'}`}
        >
          <ShieldCheck size={20} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Admin</span>
        </button>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-10 pb-24 sm:pb-10 mt-auto">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-sm text-slate-400 font-medium">© 2024 Sua Mão de Obra. Qualidade e confiança perto de você.</p>
        </div>
      </footer>
    </div>
  );
};
