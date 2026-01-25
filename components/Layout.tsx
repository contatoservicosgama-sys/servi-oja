
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  CalendarClock, 
  Wrench, 
  MapPin, 
  BarChart3, 
  MessageSquare, 
  Menu, 
  X,
  LogOut,
  ChevronRight,
  ExternalLink,
  Globe
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/prestadores', label: 'Prestadores', icon: Users },
  { path: '/admin/pagamentos', label: 'Pagamentos PIX', icon: CreditCard },
  { path: '/admin/vencimentos', label: 'Vencimentos', icon: CalendarClock },
  { path: '/admin/servicos', label: 'Serviços', icon: Wrench },
  { path: '/admin/cidades', label: 'Cidades', icon: MapPin },
  { path: '/admin/relatorios', label: 'Relatórios', icon: BarChart3 },
  { path: '/admin/mensagens', label: 'Mensagens', icon: MessageSquare },
];

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      {/* Sidebar Mobile Toggle */}
      <button 
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 right-4 z-50 p-3 bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-200"
      >
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed lg:sticky top-0 z-40 w-72 h-screen bg-white border-r border-slate-100 transition-all duration-300 ease-in-out lg:translate-x-0 flex flex-col`}
      >
        <div className="p-8">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform">
              <Wrench className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                Serviços <span className="text-indigo-600">Já</span>
              </h1>
              <p className="text-[10px] text-slate-400 uppercase font-black tracking-[0.2em]">Painel Admin</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.endsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 font-bold'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={20} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600 transition-colors'} />
                  <span className="text-sm tracking-tight">{item.label}</span>
                </div>
                {isActive && <ChevronRight size={14} className="opacity-50" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-slate-50 space-y-4">
          <Link 
            to="/" 
            className="flex items-center gap-3 w-full px-4 py-3.5 bg-slate-900 text-white rounded-2xl transition-all font-bold text-sm shadow-xl shadow-slate-200 hover:bg-slate-800"
          >
            <Globe size={18} className="text-indigo-400" />
            <span>Sair para o Site</span>
            <ExternalLink size={14} className="ml-auto opacity-50" />
          </Link>

          <div className="bg-slate-50 rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                AD
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black text-slate-900 truncate">Administrador</p>
                <p className="text-[10px] text-slate-400 truncate">admin@servicosja.com</p>
              </div>
            </div>
          </div>
          <button className="flex items-center gap-3 w-full px-4 py-3 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all font-bold text-sm">
            <LogOut size={18} />
            <span>Encerrar Sessão</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full min-h-screen overflow-x-hidden">
        <div className="max-w-7xl mx-auto p-6 lg:p-12 space-y-8 animate-in fade-in duration-500">
          {children}
        </div>
      </main>
    </div>
  );
};
