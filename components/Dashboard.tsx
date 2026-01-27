
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
  ChevronRight,
  MessageCircle,
  Zap,
  CheckCircle2,
  Search
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
import { Link } from 'react-router-dom';

const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ElementType;
  gradient: string;
  trend?: string;
}> = ({ title, value, icon: Icon, gradient, trend }) => (
  <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl ${gradient} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
        <Icon size={24} />
      </div>
      {trend && (
        <span className="flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full uppercase tracking-wider">
          <ArrowUpRight size={12} /> {trend}
        </span>
      )}
    </div>
    <div>
      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{title}</p>
      <h3 className="text-3xl font-black mt-1 text-slate-900 tracking-tight">{value}</h3>
    </div>
  </div>
);

export const Dashboard: React.FC = () => {
  const [providers, setProviders] = useState(dataService.getProviders());
  const payments = dataService.getPayments();
  const cities = dataService.getCities();

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
        
        const updated = { 
          ...provider, 
          status: ProviderStatus.ACTIVE,
          dueDate: newDueDate.toISOString(),
          activatedAt: now.toISOString() // Tracking activation time
        };
        
        dataService.saveProvider(updated);
        setProviders(dataService.getProviders());
        alert(`Ativação Manual Concluída!\n\nPrestador: ${provider.name}\nNovo Vencimento: ${newDueDate.toLocaleDateString('pt-BR')}`);
      }
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Visão Geral</h2>
          <p className="text-slate-500 font-medium">Controle de ativações e saúde da plataforma.</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm text-sm font-bold text-slate-600">
          <Calendar size={18} className="text-indigo-600" />
          {new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        <StatCard 
          title="Ativos" 
          value={stats.active} 
          icon={Users} 
          gradient="bg-gradient-to-br from-emerald-400 to-emerald-600"
          trend="+4%"
        />
        <StatCard 
          title="Aguardando PIX" 
          value={stats.pending} 
          icon={Clock} 
          gradient="bg-gradient-to-br from-amber-400 to-amber-600" 
        />
        <StatCard 
          title="Inativos" 
          value={stats.blocked} 
          icon={Ban} 
          gradient="bg-gradient-to-br from-rose-400 to-rose-600" 
        />
        <StatCard 
          title="Total Recebido" 
          value={`R$ ${stats.revenue.toFixed(0)}`} 
          icon={DollarSign} 
          gradient="bg-gradient-to-br from-indigo-500 to-indigo-700" 
        />
        <StatCard 
          title="Vence Hoje" 
          value={stats.expiringToday} 
          icon={AlertCircle} 
          gradient="bg-gradient-to-br from-slate-700 to-slate-900" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-8">
               <div className="space-y-1">
                 <h3 className="text-xl font-black flex items-center gap-2 text-slate-900">
                   <Zap className="text-amber-500" fill="currentColor" />
                   Central de Ativação Manual
                 </h3>
                 <p className="text-xs text-slate-400 font-black uppercase tracking-widest">Confira o banco antes de ativar</p>
               </div>
               <Link to="/admin/prestadores" className="text-xs font-black text-indigo-600 hover:underline uppercase tracking-widest">Ver todos</Link>
            </div>

            <div className="space-y-4">
              {pendingActivations.length > 0 ? pendingActivations.map(provider => (
                <div key={provider.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-3xl gap-4 hover:border-indigo-200 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 font-bold overflow-hidden shadow-sm">
                      {provider.profileImage ? <img src={provider.profileImage} className="w-full h-full object-cover" /> : provider.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-black text-slate-900 leading-tight">{provider.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">{cities.find(c => c.id === provider.cityId)?.name}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                        <span className={`text-[9px] font-black uppercase ${provider.status === ProviderStatus.PENDING ? 'text-amber-600' : 'text-rose-600'}`}>
                          {provider.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => handleManualActivate(provider.id)}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95"
                    >
                      <CheckCircle2 size={14} /> Confirmar PIX e Ativar
                    </button>
                    <a 
                      href={`https://wa.me/55${provider.phone.replace(/\D/g, '')}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="p-3 bg-white text-emerald-500 hover:text-white hover:bg-emerald-500 rounded-2xl border border-slate-200 transition-all shadow-sm"
                      title="Chamar no Zap"
                    >
                      <MessageCircle size={18} />
                    </a>
                  </div>
                </div>
              )) : (
                <div className="text-center py-16 opacity-30">
                  <CheckCircle2 size={48} className="mx-auto mb-3" />
                  <p className="font-black text-sm uppercase tracking-widest">Tudo em dia! Sem pendências.</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-2">
              <TrendingUp className="text-indigo-600" /> Prestadores por Cidade
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }} />
                  <Tooltip cursor={{ fill: '#f8fafc', radius: 12 }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="count" radius={[10, 10, 0, 0]} barSize={32}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#4f46e5' : '#818cf8'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-xl font-black mb-4">Ação Necessária</h3>
              <p className="text-slate-400 text-sm font-medium leading-relaxed mb-6">
                Lembre-se: O sistema **não** ativa ninguém automaticamente. Você deve verificar o extrato bancário e usar os botões de ativação manual.
              </p>
              <div className="flex items-center gap-3 p-4 bg-white/10 rounded-2xl border border-white/10">
                <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-white shrink-0">
                  <Zap size={20} fill="currentColor" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Total Pendente</p>
                  <p className="text-lg font-black">{stats.pending} Prestadores</p>
                </div>
              </div>
            </div>
            <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
               <ShieldCheck size={200} />
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
             <h3 className="text-lg font-black text-slate-900 mb-6 uppercase tracking-tight">Vencendo Hoje</h3>
             <div className="space-y-4">
                {providers.filter(p => p.dueDate.startsWith(new Date().toISOString().split('T')[0])).length > 0 ? (
                  providers.filter(p => p.dueDate.startsWith(new Date().toISOString().split('T')[0])).map(p => (
                    <div key={p.id} className="flex items-center gap-3 p-3 bg-rose-50 border border-rose-100 rounded-2xl">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-rose-500 font-bold border border-rose-100">
                        {p.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-900 leading-tight">{p.name}</p>
                        <p className="text-[10px] font-bold text-rose-600">EXPIRA HOJE</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 font-bold italic text-center py-4">Nenhum vencimento para hoje.</p>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function ShieldCheck({ size }: { size: number }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}