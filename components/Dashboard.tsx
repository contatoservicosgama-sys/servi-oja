
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
  CheckCircle2
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
      .filter(p => p.status === ProviderStatus.PENDING)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 4);
  }, [providers]);

  const chartData = useMemo(() => {
    return cities.map(city => ({
      name: city.name,
      count: providers.filter(p => p.cityId === city.id).length
    }));
  }, [cities, providers]);

  const handleQuickActivate = (id: string) => {
    const provider = providers.find(p => p.id === id);
    if (provider) {
      const newDueDate = new Date();
      newDueDate.setDate(newDueDate.getDate() + 30);
      
      const updated = { 
        ...provider, 
        status: ProviderStatus.ACTIVE,
        dueDate: newDueDate.toISOString()
      };
      
      dataService.saveProvider(updated);
      setProviders(dataService.getProviders());
      alert(`Prestador ${provider.name} ativado com sucesso! Plano válido até ${newDueDate.toLocaleDateString('pt-BR')}`);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Visão Geral</h2>
          <p className="text-slate-500 font-medium">Bem-vindo de volta! Aqui está o resumo da sua operação.</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm text-sm font-bold text-slate-600">
          <Calendar size={18} className="text-indigo-600" />
          {new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        <StatCard 
          title="Prestadores Ativos" 
          value={stats.active} 
          icon={Users} 
          gradient="bg-gradient-to-br from-emerald-400 to-emerald-600"
          trend="+4%"
        />
        <StatCard 
          title="Novas Propostas" 
          value={stats.pending} 
          icon={Clock} 
          gradient="bg-gradient-to-br from-amber-400 to-amber-600" 
        />
        <StatCard 
          title="Bloqueados" 
          value={stats.blocked} 
          icon={Ban} 
          gradient="bg-gradient-to-br from-rose-400 to-rose-600" 
        />
        <StatCard 
          title="Arrecadação" 
          value={`R$ ${stats.revenue.toFixed(0)}`} 
          icon={DollarSign} 
          gradient="bg-gradient-to-br from-indigo-500 to-indigo-700" 
          trend="+12%"
        />
        <StatCard 
          title="Vence Hoje" 
          value={stats.expiringToday} 
          icon={AlertCircle} 
          gradient="bg-gradient-to-br from-slate-700 to-slate-900" 
        />
      </div>

      {/* Main Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Quick Activations - THE NEW FEATURE */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-8">
               <div className="space-y-1">
                 <h3 className="text-xl font-black flex items-center gap-2 text-slate-900">
                   <Zap className="text-amber-500" fill="currentColor" />
                   Solicitações de Ativação
                 </h3>
                 <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Ações urgentes</p>
               </div>
               <Link to="/admin/prestadores" className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:underline">Ver todos</Link>
            </div>

            <div className="space-y-4">
              {pendingActivations.length > 0 ? pendingActivations.map(provider => (
                <div key={provider.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-3xl gap-4 hover:border-amber-200 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 font-bold overflow-hidden">
                      {provider.profileImage ? <img src={provider.profileImage} className="w-full h-full object-cover" /> : provider.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{provider.name}</p>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">{cities.find(c => c.id === provider.cityId)?.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleQuickActivate(provider.id)}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100 active:scale-95"
                    >
                      <CheckCircle2 size={16} /> Ativar Agora
                    </button>
                    <Link to="/admin/prestadores" className="p-3 bg-white text-slate-400 hover:text-indigo-600 rounded-2xl border border-slate-200 transition-all">
                      <ChevronRight size={18} />
                    </Link>
                  </div>
                </div>
              )) : (
                <div className="text-center py-10 opacity-40">
                  <CheckCircle2 size={40} className="mx-auto mb-2" />
                  <p className="font-bold text-sm">Nenhuma ativação pendente.</p>
                </div>
              )}
            </div>
          </div>

          {/* Chart */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-8">
              <div className="space-y-1">
                <h3 className="text-xl font-black flex items-center gap-2 text-slate-900">
                  <TrendingUp className="text-indigo-600" />
                  Densidade por Cidade
                </h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Distribuição Geográfica</p>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                  />
                  <Tooltip 
                    cursor={{ fill: '#F1F5F9', radius: 12 }}
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]} barSize={30}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#4f46e5' : '#e0e7ff'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-slate-900">Recentes</h3>
              <Link to="/admin/prestadores" className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:underline">Ver Todos</Link>
            </div>
            <div className="flex-1 space-y-4">
              {providers.slice(0, 6).map(provider => (
                <div key={provider.id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 flex items-center justify-center text-slate-400 font-bold">
                      {provider.profileImage ? (
                        <img src={provider.profileImage} className="w-full h-full object-cover" />
                      ) : provider.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 leading-tight">{provider.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{cities.find(c => c.id === provider.cityId)?.name}</p>
                    </div>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${
                    provider.status === ProviderStatus.ACTIVE ? 'bg-emerald-500' :
                    provider.status === ProviderStatus.PENDING ? 'bg-amber-500' : 'bg-rose-500'
                  }`}></div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-slate-50">
               <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
                  <div className="relative z-10">
                    <h4 className="font-black text-lg mb-1">Atenção!</h4>
                    <p className="text-xs font-medium opacity-90 leading-relaxed mb-4">
                       Existem <strong>{stats.pending}</strong> prestadores aguardando liberação. Ative-os para aumentar a oferta de serviços.
                    </p>
                    <Link to="/admin/prestadores" className="inline-flex items-center gap-2 bg-white text-indigo-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-50 transition-colors">
                      Ir para Lista <ChevronRight size={14} />
                    </Link>
                  </div>
                  <Zap size={80} className="absolute -right-4 -bottom-4 text-white/10 rotate-12" fill="currentColor" />
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
