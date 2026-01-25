
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Zap, 
  Droplets, 
  Hammer, 
  Layout, 
  ArrowRight,
  Search,
  CheckCircle2,
  Paintbrush,
  Layers,
  Sprout,
  Wind,
  Trash2,
  Settings,
  UserPlus,
  MapPin
} from 'lucide-react';
import { dataService } from '../services/dataService';

const getServiceIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('elétrica')) return <Zap className="w-8 h-8" />;
  if (n.includes('hidráulica')) return <Droplets className="w-8 h-8" />;
  if (n.includes('móveis')) return <Layout className="w-8 h-8" />;
  if (n.includes('chuveiro')) return <Zap className="w-8 h-8" />;
  if (n.includes('pintura') || n.includes('pintor')) return <Paintbrush className="w-8 h-8" />;
  if (n.includes('gesso')) return <Layers className="w-8 h-8" />;
  if (n.includes('jardim') || n.includes('jardinagem')) return <Sprout className="w-8 h-8" />;
  if (n.includes('ar condicionado')) return <Wind className="w-8 h-8" />;
  if (n.includes('limpeza')) return <Trash2 className="w-8 h-8" />;
  if (n.includes('instalações')) return <Settings className="w-8 h-8" />;
  return <Hammer className="w-8 h-8" />;
};

export const ClientHome: React.FC = () => {
  const services = dataService.getServices().filter(s => s.active);

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-12">
      {/* Hero */}
      <section className="text-center space-y-6 pt-6">
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-bold border border-indigo-100 shadow-sm">
          <CheckCircle2 size={16} /> Solução rápida para sua casa
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Serviços Já. <br />
          <span className="text-indigo-600">Chamou, resolveu.</span>
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto px-4 leading-relaxed">
          Encontre pintores, eletricistas, gesseiros e montadores confiáveis em Belo Horizonte, Contagem e Betim. Direto no seu WhatsApp.
        </p>
      </section>

      {/* Categories Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-xl font-bold text-slate-900">Qual serviço você precisa?</h2>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {services.map((service) => (
            <Link 
              key={service.id}
              to={`/busca/${service.id}`}
              className="group bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-100 hover:border-indigo-200 transition-all duration-300 flex flex-col items-center text-center gap-4 active:scale-95"
            >
              <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 transform group-hover:rotate-6">
                {getServiceIcon(service.name)}
              </div>
              <span className="font-bold text-slate-800 text-sm sm:text-base leading-tight group-hover:text-indigo-600 transition-colors">
                {service.name}
              </span>
            </Link>
          ))}
          
          <Link 
            to="/cadastro"
            className="group bg-slate-900 p-6 rounded-[2rem] border border-slate-800 shadow-xl hover:bg-slate-800 transition-all flex flex-col items-center justify-center text-center gap-3 active:scale-95"
          >
            <div className="bg-slate-800 p-3 rounded-xl group-hover:bg-slate-700 transition-colors">
              <UserPlus className="w-6 h-6 text-indigo-400" />
            </div>
            <span className="text-white font-bold text-sm">É profissional?</span>
            <span className="text-indigo-400 text-xs flex items-center gap-1 font-semibold">
              Comece agora <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>
      </section>

      {/* Trust Points */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-8 border-t border-slate-200">
        <div className="flex gap-4 items-start p-2">
          <div className="shrink-0 w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner">
            <Zap size={24} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900">Agilidade Total</h4>
            <p className="text-sm text-slate-500 leading-snug">Conectamos você ao prestador em menos de 2 minutos.</p>
          </div>
        </div>
        <div className="flex gap-4 items-start p-2">
          <div className="shrink-0 w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner">
            <Search size={24} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900">Contato Direto</h4>
            <p className="text-sm text-slate-500 leading-snug">Sem intermediários. Você negocia direto no WhatsApp.</p>
          </div>
        </div>
        <div className="flex gap-4 items-start p-2">
          <div className="shrink-0 w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shadow-inner">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900">Segurança</h4>
            <p className="text-sm text-slate-500 leading-snug">Apenas profissionais ativos e validados em nossa plataforma.</p>
          </div>
        </div>
      </section>

      {/* Region Promo */}
      <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
        <div className="relative z-10 max-w-md">
          <h3 className="text-2xl font-black mb-2">Grande BH e Região</h3>
          <p className="text-indigo-100 font-medium text-sm leading-relaxed mb-6">
            Presença consolidada em Belo Horizonte, Contagem e Betim. Os melhores prestadores da região metropolitana estão aqui.
          </p>
          <div className="flex gap-3">
            <span className="bg-white/20 backdrop-blur-md border border-white/10 px-4 py-1 rounded-full text-xs font-bold">Belo Horizonte</span>
            <span className="bg-white/20 backdrop-blur-md border border-white/10 px-4 py-1 rounded-full text-xs font-bold">Contagem</span>
            <span className="bg-white/20 backdrop-blur-md border border-white/10 px-4 py-1 rounded-full text-xs font-bold">Betim</span>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4">
          <MapPin size={240} />
        </div>
      </div>
    </div>
  );
};
