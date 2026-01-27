
import React, { useState, useMemo } from 'react';
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
  Globe,
  Hammer
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { dataService } from '../services/dataService';
import { ProviderStatus, PaymentStatus } from '../types';

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/prestadores', label: 'Prestadores', icon: Users, badgeKey: 'pendingProviders' },
  { path: '/admin/pagamentos', label: 'Pagamentos PIX', icon: CreditCard, badgeKey: 'pendingPayments' },
  { path: '/admin/vencimentos', label: 'Vencimentos', icon: CalendarClock },
  { path: '/admin/servicos', label: 'Serviços', icon: Wrench },
  { path: '/admin/cidades', label: 'Cidades', icon: MapPin },
  { path: '/admin/relatorios', label: 'Relatórios', icon: BarChart3 },
  { path: '/admin/mensagens', label: 'Mensagens', icon: MessageSquare },
];

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const counts = useMemo(() => {
    try {
      const providers = dataService.getProviders();
      const payments = dataService.getPayments();
      return {
        pendingProviders: providers.filter(p => p.status === ProviderStatus.PENDING).length,
        pendingPayments: payments.filter(p => p.status === PaymentStatus.PENDING).length
      };
    } catch (e) {
      return { pendingProviders: 0, pendingPayments: 0 };
    }
  }, [location.pathname]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleSafeNavigate = (path: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      navigate(path);
    } catch (err) {
      console.warn("Navegação interceptada pelo sandbox.");
    }
  };

  const handleLogout = () => {
    if (confirm('Deseja encerrar sua sessão administrativa?')) {
      try {
        sessionStorage.removeItem('admin_auth');
      } catch (e) {}
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      <button 
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 right-4 z-50 p-3 bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-200 border-none cursor-pointer"
      >
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <aside 
        className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed lg:sticky top-0 z-40 w-72 h-screen bg-white border-r border-slate-100 transition-all duration-300 ease-in-out lg:translate-x-0 flex flex-col`}
      >
        <div className="p-8">
          <button onClick={handleSafeNavigate('/')} className="flex items-center gap-3 group bg-transparent border-none cursor-pointer text-left w-full">
            <div className="bg-indigo-600 p-2.5 rounded-xl shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform">
              <Hammer className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-900 tracking-tight leading-none">
                Sua Mão <br/> <span className="text-indigo-600">de Obra</span>
              </h1>
            </div>
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.endsWith(item.path));
            const badgeValue = item.badgeKey ? (counts as any)[item.badgeKey] : 0;
            
            return (
              <button
                key={item.path}
                onClick={handleSafeNavigate(item.path)}
                className={`flex items-center justify-between w-full px-4 py-3.5 rounded-2xl transition-all duration-200 group border-none cursor-pointer text-left ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 font-bold'
                    : 'bg-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={20} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600 transition-colors'} />
                  <span className="text-sm tracking-tight">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {badgeValue > 0 && !isActive && (
                    <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                      {badgeValue}
                    </span>
                  )}
                  {isActive && <ChevronRight size={14} className="opacity-50" />}
                </div>
              </button>
            );
          })}
        </nav>

        <div className="p-6 border-t border-slate-50 space-y-4">
          <button 
            onClick={handleSafeNavigate('/')} 
            className="flex items-center gap-3 w-full px-4 py-3.5 bg-slate-900 text-white rounded-2xl transition-all font-bold text-sm shadow-xl shadow-slate-200 hover:bg-slate-800 border-none cursor-pointer"
          >
            <Globe size={18} className="text-indigo-400" />
            <span>Sair para o Site</span>
          </button>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all font-bold text-sm border-none cursor-pointer bg-transparent"
          >
            <LogOut size={18} />
            <span>Encerrar Sessão</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 w-full min-h-screen overflow-x-hidden">
        <div className="max-w-7xl mx-auto p-6 lg:p-12 space-y-8 animate-in fade-in duration-500">
          {children}
        </div>
      </main>
    </div>
  );
};
