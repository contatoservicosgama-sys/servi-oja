
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
import { ShieldCheck, Lock, ArrowRight, Hammer } from 'lucide-react';

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
      try {
        sessionStorage.setItem('admin_auth', 'true');
      } catch (err) {}
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
      setPassword('');
      setTimeout(() => setError(false), 2000);
    }
  };

  const handleGoHome = (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      navigate('/');
    } catch (err) {}
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-900 to-slate-900">
        <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="text-center space-y-4">
            <div className="inline-flex p-5 bg-indigo-600 rounded-[2.5rem] shadow-2xl shadow-indigo-500/40 text-white mb-2 transform hover:rotate-6 transition-transform">
              <ShieldCheck size={48} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight">Painel Admin</h1>
              <p className="text-slate-400 font-medium mt-2">Sua Mão de Obra - Controle Restrito</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="bg-white/5 backdrop-blur-xl p-10 rounded-[3rem] border border-white/10 shadow-2xl space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">Senha de Acesso</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
                <input 
                  autoFocus
                  type="password" 
                  placeholder="••••••"
                  className={`w-full pl-14 pr-6 py-5 bg-white/5 border ${error ? 'border-rose-500/50' : 'border-white/10'} rounded-[1.5rem] focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-black text-xl tracking-[0.5em] text-white placeholder:text-slate-700 text-center`}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
              {error && <p className="text-rose-400 text-xs font-black text-center animate-pulse mt-2 uppercase tracking-widest">Senha Incorreta!</p>}
            </div>

            <button type="submit" className="w-full py-5 bg-indigo-600 text-white font-black rounded-[1.5rem] hover:bg-indigo-500 transition-all flex items-center justify-center gap-3 shadow-xl shadow-indigo-500/20 uppercase tracking-widest text-xs active:scale-95 group border-none cursor-pointer">
              Entrar Agora <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
          <div className="text-center">
             <button onClick={handleGoHome} className="text-slate-500 hover:text-indigo-400 text-[10px] font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2 bg-transparent border-none cursor-pointer w-full">
                <Hammer size={14} /> Voltar para o Site Público
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
        <Route path="/admin" element={<AdminGuard><AdminLayout><Dashboard /></AdminLayout></AdminGuard>} />
        <Route path="/admin/prestadores" element={<AdminGuard><AdminLayout><ProviderList /></AdminLayout></AdminGuard>} />
        <Route path="/admin/pagamentos" element={<AdminGuard><AdminLayout><PaymentList /></AdminLayout></AdminGuard>} />
        <Route path="/admin/vencimentos" element={<AdminGuard><AdminLayout><ExpirationControl /></AdminLayout></AdminGuard>} />
        <Route path="/admin/servicos" element={<AdminGuard><AdminLayout><ServiceManagement /></AdminLayout></AdminGuard>} />
        <Route path="/admin/cidades" element={<AdminGuard><AdminLayout><CityManagement /></AdminLayout></AdminGuard>} />
        <Route path="/admin/relatorios" element={<AdminGuard><AdminLayout><Reports /></AdminLayout></AdminGuard>} />
        <Route path="/admin/mensagens" element={<AdminGuard><AdminLayout><MessageTemplates /></AdminGuard>} />
        <Route path="/" element={<ClientLayout><ClientHome /></ClientLayout>} />
        <Route path="/busca/:serviceId" element={<ClientLayout><ClientProviderList /></ClientLayout>} />
        <Route path="/cadastro" element={<ClientLayout><RegistrationFlow /></ClientLayout>} />
        <Route path="*" element={<ClientLayout><ClientHome /></ClientLayout>} />
      </Routes>
    </Router>
  );
};

export default App;
