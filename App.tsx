
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Layout as AdminLayout } from './components/Layout';
import { ClientLayout } from './components/ClientLayout';
import { Dashboard } from './components/Dashboard';
import { ProviderList } from './components/ProviderList';
import { PaymentList } from './components/PaymentList';
import { ExpirationControl } from './components/ExpirationControl';
import { ServiceManagement } from './components/ServiceManagement';
import { CityManagement } from './components/CityManagement';
import { Reports } from './components/Reports';
import { MessageTemplates } from './components/MessageTemplates';
import { ShieldCheck, Lock, ArrowRight, Hammer, AlertTriangle } from 'lucide-react';

// Client Components
import { ClientHome } from './components/ClientHome';
import { ClientProviderList } from './components/ClientProviderList';
import { RegistrationFlow } from './components/RegistrationFlow';

const AdminGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('admin_auth') === 'true';
    } catch (e) {
      return false;
    }
  });
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '235600') {
      sessionStorage.setItem('admin_auth', 'true');
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
      setPassword('');
      setTimeout(() => setError(false), 2000);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen relative flex items-center justify-center p-8 overflow-hidden bg-slate-950">
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/40 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-600/40 rounded-full blur-[120px] animate-pulse transition-all duration-1000 delay-500"></div>
        </div>

        <div className="w-full max-w-lg space-y-10 relative z-10">
          <div className="text-center space-y-6">
            <div className="inline-flex p-6 bg-indigo-600 rounded-[3rem] shadow-[0_0_50px_rgba(99,102,241,0.5)] text-white mb-2 transform hover:rotate-12 transition-all duration-500 animate-float">
              <ShieldCheck size={56} />
            </div>
            <div className="space-y-2">
              <h1 className="text-5xl font-black text-white tracking-tighter">Painel <span className="text-indigo-400">Admin</span></h1>
              <p className="text-slate-400 font-medium text-lg tracking-tight">Sua Mão de Obra — Acesso Restrito</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="glass-card backdrop-blur-3xl p-12 rounded-[4rem] border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.5)] space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] px-2 block text-center">Chave de Segurança</label>
              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={24} />
                <input 
                  autoFocus
                  type="password" 
                  placeholder="••••••"
                  className={`w-full pl-16 pr-6 py-7 bg-white/5 border ${error ? 'border-rose-500/50 bg-rose-500/5' : 'border-white/10'} rounded-[2rem] focus:ring-8 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-black text-3xl tracking-[1em] text-white placeholder:text-slate-800 text-center`}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
              {error && (
                <div className="flex items-center justify-center gap-2 text-rose-400 font-black text-[10px] uppercase tracking-widest animate-bounce mt-4">
                  <AlertTriangle size={14} /> Acesso Negado
                </div>
              )}
            </div>

            <button type="submit" className="w-full py-7 bg-indigo-600 text-white font-black rounded-[2rem] hover:bg-indigo-500 transition-all flex items-center justify-center gap-4 shadow-2xl shadow-indigo-500/40 uppercase tracking-[0.2em] text-sm active:scale-95 group border-none cursor-pointer outline-none">
              Iniciar Sessão <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </form>

          <div className="text-center">
             <button onClick={() => navigate('/')} className="text-slate-500 hover:text-indigo-400 text-xs font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 bg-transparent border-none cursor-pointer w-full group outline-none">
                <Hammer size={18} className="group-hover:-rotate-12 transition-transform" /> Retornar ao Ambiente Público
             </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ClientLayout><ClientHome /></ClientLayout>} />
        <Route path="/busca/:serviceId" element={<ClientLayout><ClientProviderList /></ClientLayout>} />
        <Route path="/cadastro" element={<ClientLayout><RegistrationFlow /></ClientLayout>} />

        <Route path="/admin" element={<AdminGuard><AdminLayout><Dashboard /></AdminLayout></AdminGuard>} />
        <Route path="/admin/prestadores" element={<AdminGuard><AdminLayout><ProviderList /></AdminLayout></AdminGuard>} />
        <Route path="/admin/pagamentos" element={<AdminGuard><AdminLayout><PaymentList /></AdminLayout></AdminGuard>} />
        <Route path="/admin/vencimentos" element={<AdminGuard><AdminLayout><ExpirationControl /></AdminLayout></AdminGuard>} />
        <Route path="/admin/servicos" element={<AdminGuard><AdminLayout><ServiceManagement /></AdminLayout></AdminGuard>} />
        <Route path="/admin/cidades" element={<AdminGuard><AdminLayout><CityManagement /></AdminLayout></AdminGuard>} />
        <Route path="/admin/relatorios" element={<AdminGuard><AdminLayout><Reports /></AdminLayout></AdminGuard>} />
        <Route path="/admin/mensagens" element={<AdminGuard><AdminLayout><MessageTemplates /></AdminLayout></AdminGuard>} />
      </Routes>
    </Router>
  );
};

export default App;
