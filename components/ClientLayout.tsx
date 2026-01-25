
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Wrench, UserPlus, Home as HomeIcon, ShieldCheck } from 'lucide-react';

export const ClientLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  if (isAdminPath) return <>{children}</>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <Wrench className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">Serviços <span className="text-indigo-600">Já</span></span>
          </Link>
          
          <nav className="hidden sm:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Início</Link>
            <Link to="/cadastro" className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors">Seja um Parceiro</Link>
          </nav>

          <Link to="/cadastro" className="sm:hidden text-indigo-600">
            <UserPlus size={24} />
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        {children}
      </main>

      {/* Mobile Nav */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-3 flex justify-around items-center z-50">
        <Link to="/" className={`flex flex-col items-center gap-1 ${location.pathname === '/' ? 'text-indigo-600' : 'text-slate-400'}`}>
          <HomeIcon size={20} />
          <span className="text-[10px] font-bold">Início</span>
        </Link>
        <Link to="/cadastro" className={`flex flex-col items-center gap-1 ${location.pathname === '/cadastro' ? 'text-indigo-600' : 'text-slate-400'}`}>
          <UserPlus size={20} />
          <span className="text-[10px] font-bold">Cadastrar</span>
        </Link>
        <Link to="/admin" className="flex flex-col items-center gap-1 text-slate-400">
          <ShieldCheck size={20} />
          <span className="text-[10px] font-bold">Admin</span>
        </Link>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-10 pb-24 sm:pb-10 mt-auto">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-sm text-slate-400">© 2024 Serviços Já. Pequenos reparos, solução na hora.</p>
          <div className="mt-4 flex justify-center gap-4">
             <Link to="/admin" className="text-xs text-slate-300 hover:underline">Acesso Restrito</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
