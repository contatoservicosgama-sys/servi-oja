
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
    navigate(path);
  };

  const handleLogout = () => {
    if (confirm('Deseja encerrar sua sessão administrativa?')) {
      sessionStorage.removeItem('admin_auth');
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Mobile Toggle */}
      <button 
        onClick={toggleSidebar}
        className="lg:hidden fixed bottom-6 right-6 z-[60] p-4 bg-indigo-600 text-white rounded-full shadow-2xl hover:scale-110 active:scale-90 transition-all border-none"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed lg:sticky top-0 z-50 w-80 h-screen glass-card border-r border-white/50 transition-all duration-500 ease-in-out lg:translate-x-0 flex flex-col`}
      >
        <div className="p-10">
          <button onClick={handleSafeNavigate('/')} className="flex items-center gap-4 group bg-transparent border-none cursor-pointer text-left w-full outline-none">
            <div className="bg-gradient-to-tr from-indigo-600 to-violet-600 p-3 rounded-[1.25rem] shadow-xl shadow-indigo-200 group-hover:rotate-6 transition-transform">
              <Hammer className="text-white w-7 h-7" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tighter leading-none">
                Sua Mão <br/> <span className="text-indigo-600">de Obra</span>
              </h1>
            </div>
          </button>
        </div>

        <nav className="flex-1 px-6 space-y-1.5 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.endsWith(item.path));
            const badgeValue = item.badgeKey ? (counts as any)[item.badgeKey] : 0;
            
            return (
              <button
                key={item.path}
                onClick={handleSafeNavigate(item.path)}
                className={`flex items-center justify-between w-full px-5 py-4 rounded-[1.5rem] transition-all duration-300 group border-none cursor-pointer text-left outline-none ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200/50 font-bold'
                    : 'bg-transparent text-slate-500 hover:bg-white/50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-4">
                  <item.icon size={22} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600 transition-colors'} />
                  <span className="text-sm font-semibold tracking-tight">{item.label}</span>
                </div>
                {badgeValue > 0 && !isActive && (
                  <span className="bg-rose-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg shadow-rose-200">
                    {badgeValue}
                  </span>
                )}
                {isActive && <ChevronRight size={16} className="opacity-60" />}
              </button>
            );
          })}
        </nav>

        <div className="p-8 border-t border-slate-100/50 bg-white/30 space-y-4">
          <button 
            onClick={handleSafeNavigate('/')} 
            className="flex items-center gap-3 w-full px-5 py-4 bg-slate-900 text-white rounded-[1.5rem] transition-all font-bold text-sm shadow-xl shadow-slate-200 hover:bg-slate-800 hover:-translate-y-1 border-none cursor-pointer"
          >
            <Globe size={18} className="text-indigo-400" />
            <span>Ver Site Público</span>
          </button>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-5 py-3 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all font-bold text-sm border-none cursor-pointer bg-transparent"
          >
            <LogOut size={18} />
            <span>Sair do Painel</span>
          </button>
        </div>
      </aside>

      {/* Content Area */}
      <main className="flex-1 w-full min-h-screen">
        <div className="max-w-7xl mx-auto p-6 lg:p-14 space-y-12 animate-in fade-in duration-700">
          {children}
        </div>
      </main>
    </div>
  );
};
