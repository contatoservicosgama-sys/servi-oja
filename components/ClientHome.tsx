
import React, { useMemo, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  MapPin,
  MessageCircle,
  User,
  Star,
  Briefcase
} from 'lucide-react';
import { dataService } from '../services/dataService';
import { ProviderStatus, Provider } from '../types';

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
  const allServices = dataService.getServices();
  const services = allServices.filter(s => s.active);
  const cities = dataService.getCities();
  const location = useLocation();
  
  const [providers, setProviders] = useState<Provider[]>([]);

  useEffect(() => {
    try {
      setProviders(dataService.getProviders());
    } catch (e) {
      console.error("Erro ao carregar prestadores:", e);
    }
  }, [location]);

  const featuredProviders = useMemo(() => {
    return providers
      .filter(p => p.status === ProviderStatus.ACTIVE)
      .sort((a, b) => {
        const timeA = new Date(a.activatedAt || a.createdAt).getTime();
        const timeB = new Date(b.activatedAt || b.createdAt).getTime();
        return timeB - timeA;
      })
      .slice(0, 4);
  }, [providers]);

  const openWhatsApp = (phone: string, name: string) => {
    const text = encodeURIComponent(`Olá ${name}, vi seu perfil de destaque no Pronto! e gostaria de um orçamento.`);
    window.open(`https://wa.me/55${phone.replace(/\D/g, '')}?text=${text}`, '_blank');
  };

  const getProviderServices = (ids: string[]) => {
    return ids
      .map(id => allServices.find(s => s.id === id)?.name)
      .filter(Boolean)
      .slice(0, 2);
  };

  return (
    <div className="space-y-16 animate-in fade-in duration-700 pb-12">
      {/* Hero Section */}
      <section className="text-center space-y-6 pt-6">
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-bold border border-indigo-100 shadow-sm">
          <CheckCircle2 size={16} /> Solução rápida para sua casa
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Pronto<span className="text-indigo-600">!</span> <br />
          <span className="text-indigo-600">Chamou, resolveu.</span>
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto px-4 leading-relaxed font-medium">
          Encontre os melhores profissionais em BH e Região. <br className="hidden sm:block" /> Atendimento direto via WhatsApp, sem intermediários.
        </p>
      </section>

      {/* Featured Providers Section */}
      {featuredProviders.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Star className="text-amber-500" fill="currentColor" size={20} />
              Profissionais em Destaque
            </h2>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">Disponíveis agora</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {featuredProviders.map(provider => (
              <div key={provider.id} className="bg-white p-5 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all flex items-center justify-between group">
                <div className="flex items-center gap-4 overflow-hidden">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-400 font-black overflow-hidden border border-indigo-100 shrink-0">
                    {provider.profileImage ? (
                      <img src={provider.profileImage} alt={provider.name} className="w-full h-full object-cover" />
                    ) : (
                      <User size={28} />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-black text-slate-900 leading-tight truncate">{provider.name}</h4>
                    <div className="flex items-center gap-1.5 mt-1">
                      <MapPin size={12} className="text-indigo-600" />
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        {cities.find(c => c.id === provider.cityId)?.name}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                       {getProviderServices(provider.serviceIds).map((s, idx) => (
                         <span key={idx} className="text-[8px] font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md uppercase tracking-tighter">
                           {s}
                         </span>
                       ))}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => openWhatsApp(provider.phone, provider.name)}
                  className="bg-emerald-500 text-white p-4 rounded-2xl shadow-lg shadow-emerald-100 group-hover:scale-110 transition-all active:scale-95 shrink-0 ml-4 flex flex-col items-center gap-1 border-none cursor-pointer"
                  title="Chamar agora no WhatsApp"
                >
                  <MessageCircle size={24} />
                  <span className="text-[8px] font-black uppercase tracking-widest">Zap</span>
                </button>
              </div>
            ))}
          </div>
          <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] pt-2">Fale direto com o profissional acima para agilizar seu serviço</p>
        </section>
      )}

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
            <p className="text-sm text-slate-500 leading-snug font-medium">Conectamos você ao prestador em menos de 2 minutos.</p>
          </div>
        </div>
        <div className="flex gap-4 items-start p-2">
          <div className="shrink-0 w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner">
            <Search size={24} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900">Contato Direto</h4>
            <p className="text-sm text-slate-500 leading-snug font-medium">Sem intermediários. Você negocia direto no WhatsApp.</p>
          </div>
        </div>
        <div className="flex gap-4 items-start p-2">
          <div className="shrink-0 w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shadow-inner">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900">Segurança</h4>
            <p className="text-sm text-slate-500 leading-snug font-medium">Apenas profissionais ativos e validados em nossa plataforma.</p>
          </div>
        </div>
      </section>
    </div>
  );
};
