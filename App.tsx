
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import { ShieldCheck, Lock, ArrowRight, Wrench } from 'lucide-react';

// Client Components
import { ClientHome } from './components/ClientHome';
import { ClientProviderList } from './components/ClientProviderList';
import { RegistrationFlow } from './components/RegistrationFlow';

// Admin Auth Guard Component
const AdminGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    sessionStorage.getItem('admin_auth') === 'true'
  );
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

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
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-900 to-slate-900">
        <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="text-center space-y-4">
            <div className="inline-flex p-4 bg-indigo-600 rounded-[2rem] shadow-2xl shadow-indigo-500/20 text-white mb-2">
              <ShieldCheck size={48} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight">Área Restrita</h1>
              <p className="text-slate-400 font-medium mt-2">Identifique-se para acessar o Painel Administrativo.</p>
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
              {error && (
                <p className="text-rose-400 text-xs font-black text-center animate-bounce mt-2 uppercase tracking-widest">Senha Incorreta!</p>
              )}
            </div>

            <button 
              type="submit"
              className="w-full py-5 bg-indigo-600 text-white font-black rounded-[1.5rem] hover:bg-indigo-500 transition-all flex items-center justify-center gap-3 shadow-xl shadow-indigo-500/20 uppercase tracking-widest text-xs active:scale-95 group"
            >
              Acessar Painel 
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="text-center">
             <a href="/" className="text-slate-500 hover:text-white text-xs font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2">
                <Wrench size={14} /> Voltar para o Site
             </a>
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
        {/* Admin Routes */}
        <Route path="/admin/*" element={
          <AdminGuard>
            <AdminLayout>
              <Routes>
                <Route index element={<Dashboard />} />
                <Route path="prestadores" element={<ProviderList />} />
                <Route path="pagamentos" element={<PaymentList />} />
                <Route path="vencimentos" element={<ExpirationControl />} />
                <Route path="servicos" element={<ServiceManagement />} />
                <Route path="cidades" element={<CityManagement />} />
                <Route path="relatorios" element={<Reports />} />
                <Route path="mensagens" element={<MessageTemplates />} />
              </Routes>
            </AdminLayout>
          </AdminGuard>
        } />

        {/* Client/Public Routes */}
        <Route path="/*" element={
          <ClientLayout>
            <Routes>
              <Route index element={<ClientHome />} />
              <Route path="busca/:serviceId" element={<ClientProviderList />} />
              <Route path="cadastro" element={<RegistrationFlow />} />
            </Routes>
          </ClientLayout>
        } />
      </Routes>
    </Router>
  );
};

export default App;
