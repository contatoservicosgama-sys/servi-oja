
import React, { useMemo, useState } from 'react';
import { 
  Users, 
  Clock, 
  Ban, 
  DollarSign, 
  AlertCircle,
  TrendingUp,
  ArrowUpRight,
  MapPin,
  Calendar,
  MessageCircle,
  Zap,
  CheckCircle2,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { dataService } from '../services/dataService';
import { ProviderStatus, PaymentStatus } from '../types';
import { useNavigate } from 'react-router-dom';

const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ElementType;
  gradient: string;
  trend?: string;
}> = ({ title, value, icon: Icon, gradient, trend }) => (
  <div className="glass-card p-7 rounded-[2.5rem] premium-shadow border border-white/60 hover:premium-shadow-hover transition-all duration-500 group relative overflow-hidden">
    <div className="relative z-10">
      <div className="flex justify-between items-start mb-6">
        <div className={`p-4 rounded-[1.5rem] ${gradient} text-white shadow-xl shadow-indigo-100 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>
          <Icon size={26} />
        </div>
        {trend && (
          <span className="flex items-center gap-1.5 text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full uppercase tracking-widest">
            <ArrowUpRight size={14} /> {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{title}</p>
        <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{value}</h3>
      </div>
    </div>
    <div className="absolute -right-6 -bottom-6 opacity-[0.03] group-hover:opacity-[0.07] group-hover:scale-125 transition-all duration-700 text-slate-900">
      <Icon size={120} />
    </div>
  </div>
);

export const Dashboard: React.FC = () => {
  const [providers, setProviders] = useState(dataService.getProviders());
  const payments = dataService.getPayments();
  const cities = dataService.getCities();
  const navigate = useNavigate();

  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return {
      active: providers.filter(p => p.status === ProviderStatus.ACTIVE).length,
      pending: providers.filter(p => p.status === ProviderStatus.PENDING).length,
      blocked: providers.filter(p => p.status === ProviderStatus.BLOCKED).length,
      revenue: payments
        .filter(p => p.status === PaymentStatus.APPROVED)
        .reduce((acc, curr) => acc + curr.value, 0),
      expiringToday: providers.filter(p => p.dueDate.startsWith(today)).length
    };
  }, [providers, payments]);

  const pendingActivations = useMemo(() => {
    return providers
      .filter(p => p.status !== ProviderStatus.ACTIVE)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [providers]);

  const chartData = useMemo(() => {
    return cities.map(city => ({
      name: city.name,
      count: providers.filter(p => p.cityId === city.id).length
    }));
  }, [cities, providers]);

  const handleManualActivate = (id: string) => {
    const provider = providers.find(p => p.id === id);
    if (provider) {
      const confirmMsg = `ATENÇÃO: Você confirmou o recebimento do PIX de R$ 39,90 de "${provider.name}" no seu banco?`;
      if (confirm(confirmMsg)) {
        const now = new Date();
        const currentDue = new Date(provider.dueDate);
        const baseDate = currentDue > now ? currentDue : now;
        const newDueDate = new Date(baseDate);
        newDueDate.setDate(newDueDate.getDate() + 30);
        
        const updated = { ...provider, status: ProviderStatus.ACTIVE, dueDate: newDueDate.toISOString(), activatedAt: now.toISOString() };
        dataService.saveProvider(updated);
        setProviders(dataService.getProviders());
      }
    }
  };

  return (
    <div className="space-y-14">
      {/* Header com Saudação Profissional */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] bg-indigo-50 w-fit px-4 py-1.5 rounded-full">
            <ShieldCheck size={14} /> Sistema Autenticado
          </div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">Visão <span className="text-indigo-600">Geral</span></h2>
          <p className="text-slate-500 font-medium text-lg">Seja bem-vindo ao controle de inteligência da sua plataforma.</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-[1.5rem] shadow-xl shadow-slate-200 border border-slate-100 font-bold text-slate-600">
          <Calendar size={20} className="text-indigo-600" />
          {new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </header>

      {/* Grid de Estatísticas Flutuantes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
        <StatCard title="Ativos" value={stats.active} icon={Users} gradient="bg-gradient-to-tr from-emerald-500 to-teal-600" trend="+12%" />
        <StatCard title="Aguardando" value={stats.pending} icon={Clock} gradient="bg-gradient-to-tr from-amber-500 to-orange-600" />
        <StatCard title="Bloqueados" value={stats.blocked} icon={Ban} gradient="bg-gradient-to-tr from-rose-500 to-red-600" />
        <StatCard title="Receita Total" value={`R$ ${stats.revenue.toLocaleString('pt-BR', {minimumFractionDigits: 0})}`} icon={DollarSign} gradient="bg-gradient-to-tr from-indigo-600 to-violet-700" />
        <StatCard title="Vence Hoje" value={stats.expiringToday} icon={AlertCircle} gradient="bg-gradient-to-tr from-slate-700 to-slate-900" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          {/* Central de Ativação Manual Proeminente */}
          <div className="glass-card p-10 rounded-[3.5rem] premium-shadow border border-white/50 relative overflow-hidden">
            <div className="flex items-center justify-between mb-10 relative z-10">
               <div className="space-y-1">
                 <h3 className="text-2xl font-black flex items-center gap-3 text-slate-900 tracking-tight">
                   <Zap className="text-amber-500 animate-pulse" fill="currentColor" size={28} />
                   Central de Ativação PIX
                 </h3>
                 <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Aprove somente após conferir no extrato bancário</p>
               </div>
               <button onClick={() => navigate('/admin/prestadores')} className="group flex items-center gap-2 text-[10px] font-black text-indigo-600 hover:text-indigo-800 uppercase tracking-widest bg-transparent border-none cursor-pointer p-3 rounded-2xl hover:bg-indigo-50 transition-all outline-none">
                Gerenciar Lista <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
               </button>
            </div>

            <div className="space-y-5 relative z-10">
              {pendingActivations.length > 0 ? pendingActivations.map(provider => (
                <div key={provider.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-white/60 hover:bg-white rounded-[2rem] border border-white shadow-sm hover:premium-shadow transition-all group">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-400 font-bold overflow-hidden shadow-inner group-hover:scale-105 transition-transform">
                      {provider.profileImage ? <img src={provider.profileImage} className="w-full h-full object-cover" /> : provider.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xl font-black text-slate-900 tracking-tight leading-none mb-1">{provider.name}</p>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-[10px] text-slate-400 font-black uppercase tracking-wider">
                          <MapPin size={12} className="text-indigo-600" />
                          {cities.find(c => c.id === provider.cityId)?.name}
                        </span>
                        <div className={`w-2 h-2 rounded-full ${provider.status === ProviderStatus.PENDING ? 'bg-amber-400 animate-pulse' : 'bg-rose-400'}`}></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Status {provider.status}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-4 sm:mt-0">
                    <button 
                      onClick={() => handleManualActivate(provider.id)}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-indigo-700 hover:-translate-y-1 transition-all shadow-xl shadow-indigo-100 active:scale-95 border-none cursor-pointer outline-none"
                    >
                      <CheckCircle2 size={18} /> Validar PIX
                    </button>
                    <a 
                      href={`https://wa.me/55${provider.phone.replace(/\D/g, '')}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="p-4 bg-white text-emerald-500 hover:text-white hover:bg-emerald-500 rounded-2xl border border-slate-100 transition-all shadow-sm outline-none"
                    >
                      <MessageCircle size={24} />
                    </a>
                  </div>
                </div>
              )) : (
                <div className="text-center py-20 opacity-30 flex flex-col items-center gap-4">
                  <div className="p-8 bg-emerald-50 text-emerald-600 rounded-[3rem]">
                    <CheckCircle2 size={64} />
                  </div>
                  <p className="font-black text-lg uppercase tracking-[0.2em] text-slate-900">Plataforma em Dia</p>
                  <p className="text-sm font-medium">Nenhum prestador aguardando ativação no momento.</p>
                </div>
              )}
            </div>
            {/* Elementos Decorativos de Fundo */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl -z-0"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-50/50 rounded-full blur-3xl -z-0"></div>
          </div>

          {/* Gráfico Estilizado */}
          <div className="glass-card p-10 rounded-[3.5rem] premium-shadow border border-white/50">
            <h3 className="text-2xl font-black text-slate-900 mb-10 flex items-center gap-3 tracking-tight">
              <TrendingUp className="text-indigo-600" /> Presença por Cidade
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 11, fontWeight: 800 }} 
                    dy={15}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 11, fontWeight: 800 }} 
                  />
                  <Tooltip 
                    cursor={{ fill: 'rgba(99, 102, 241, 0.05)', radius: 24 }} 
                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)', padding: '16px' }} 
                  />
                  <Bar dataKey="count" radius={[20, 20, 20, 20]} barSize={40}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#6366f1' : '#a855f7'} fillOpacity={0.8} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-10">
          {/* Alerta Premium */}
          <div className="bg-slate-900 p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group">
            <div className="relative z-10 space-y-6">
              <div className="w-14 h-14 bg-indigo-600 rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-indigo-500/50">
                <ShieldCheck size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-black mb-3 tracking-tight">Protocolo de Ativação</h3>
                <p className="text-slate-400 text-sm font-medium leading-relaxed">
                  Lembre-se: O sistema opera em modo semi-manual para garantir que nenhum anúncio seja ativado sem o devido pagamento bancário.
                </p>
              </div>
              <div className="bg-white/10 p-6 rounded-[2rem] border border-white/10 flex items-center gap-4 group-hover:bg-white/20 transition-all">
                <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-amber-500/20">
                  <Zap size={24} fill="currentColor" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300 mb-1">Impacto Financeiro</p>
                  <p className="text-xl font-black">{stats.pending} em espera</p>
                </div>
              </div>
            </div>
            <div className="absolute -right-16 -bottom-16 opacity-[0.05] group-hover:scale-110 group-hover:rotate-12 transition-transform duration-1000">
               <ShieldCheck size={280} />
            </div>
          </div>

          {/* Vencimentos Hoje */}
          <div className="glass-card p-10 rounded-[3.5rem] shadow-sm border border-white/50">
             <div className="flex items-center justify-between mb-8">
               <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest">Expira Hoje</h3>
               <span className="w-8 h-8 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center font-black text-xs">{stats.expiringToday}</span>
             </div>
             <div className="space-y-4">
                {providers.filter(p => p.dueDate.startsWith(new Date().toISOString().split('T')[0])).length > 0 ? (
                  providers.filter(p => p.dueDate.startsWith(new Date().toISOString().split('T')[0])).map(p => (
                    <div key={p.id} className="flex items-center gap-4 p-4 bg-rose-50/50 hover:bg-rose-50 border border-rose-100/50 rounded-[1.75rem] transition-all group">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-rose-500 font-black border border-rose-100 shadow-sm group-hover:scale-110 transition-transform">
                        {p.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-black text-slate-900 leading-none mb-1 truncate">{p.name}</p>
                        <div className="flex items-center gap-1">
                          <Clock className="text-rose-500" size={12} />
                          <p className="text-[10px] font-black text-rose-600 uppercase">Bloqueio iminente</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-200">
                      <Calendar size={32} />
                    </div>
                    <p className="text-xs text-slate-400 font-bold italic">Sem vencimentos hoje.</p>
                  </div>
                )}
             </div>
             <button onClick={() => navigate('/admin/vencimentos')} className="w-full mt-8 py-4 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border-none cursor-pointer outline-none">Ver Todos Vencimentos</button>
          </div>
        </div>
      </div>
    </div>
  );
};
