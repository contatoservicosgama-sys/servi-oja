
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  Phone, 
  MapPin, 
  MessageCircle,
  Clock,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  User
} from 'lucide-react';
import { dataService } from '../services/dataService';
import { ProviderStatus } from '../types';

export const ClientProviderList: React.FC = () => {
  const { serviceId } = useParams();
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [expandedDescriptions, setExpandedDescriptions] = useState<Record<string, boolean>>({});
  
  const services = dataService.getServices();
  const cities = dataService.getCities();
  const providers = dataService.getProviders().filter(p => 
    p.status === ProviderStatus.ACTIVE && 
    p.serviceIds.includes(serviceId || '')
  );

  const activeCities = cities.filter(c => 
    providers.some(p => p.cityId === c.id)
  );

  const filteredProviders = selectedCity === 'all' 
    ? providers 
    : providers.filter(p => p.cityId === selectedCity);

  const currentService = services.find(s => s.id === serviceId);

  const openWhatsApp = (phone: string, name: string) => {
    const text = encodeURIComponent(`Olá ${name}, vi seu perfil no Serviços Já e preciso de um orçamento para ${currentService?.name}.`);
    window.open(`https://wa.me/55${phone.replace(/\D/g, '')}?text=${text}`, '_blank');
  };

  const toggleDescription = (id: string) => {
    setExpandedDescriptions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/" className="p-2 bg-white border border-slate-100 rounded-xl text-slate-600 hover:text-indigo-600 shadow-sm">
          <ChevronLeft size={24} />
        </Link>
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">{currentService?.name}</h2>
          <p className="text-sm text-slate-500 font-medium">Profissionais disponíveis na sua região</p>
        </div>
      </div>

      {/* City Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button 
          onClick={() => setSelectedCity('all')}
          className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap border transition-all shadow-sm ${
            selectedCity === 'all' 
              ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100' 
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          Todas as cidades
        </button>
        {activeCities.map(city => (
          <button 
            key={city.id}
            onClick={() => setSelectedCity(city.id)}
            className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap border transition-all shadow-sm ${
              selectedCity === city.id
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100' 
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {city.name}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-6">
        {filteredProviders.length > 0 ? filteredProviders.map(provider => (
          <div key={provider.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-50/50 transition-all flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-50 flex items-center justify-center text-indigo-400 font-black text-xl overflow-hidden border border-indigo-100 shadow-inner">
                  {provider.profileImage ? (
                    <img src={provider.profileImage} alt={provider.name} className="w-full h-full object-cover" />
                  ) : (
                    <User size={24} />
                  )}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-black text-slate-900 leading-tight">{provider.name}</h3>
                    <div className="bg-emerald-50 text-emerald-600 text-[10px] uppercase font-black tracking-widest px-2 py-0.5 rounded-full border border-emerald-100">Profissional Verificado</div>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-slate-500">
                    <div className="flex items-center gap-1.5 text-xs font-bold">
                      <MapPin size={14} className="text-indigo-600" />
                      {cities.find(c => c.id === provider.cityId)?.name}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-bold">
                      <Clock size={14} className="text-indigo-600" />
                      Responde rápido
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2">
                {provider.portfolioUrl && (
                  <button 
                    onClick={() => window.open(provider.portfolioUrl, '_blank')}
                    className="flex items-center justify-center gap-2 bg-slate-50 text-slate-600 px-6 py-3.5 rounded-2xl font-black hover:bg-slate-100 transition-all border border-slate-100 text-xs uppercase tracking-widest"
                  >
                    <ImageIcon size={18} />
                    Portfólio
                  </button>
                )}
                <button 
                  onClick={() => openWhatsApp(provider.phone, provider.name)}
                  className="flex items-center justify-center gap-2 bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-100 uppercase tracking-widest text-xs"
                >
                  <MessageCircle size={18} />
                  Orçamento Grátis
                </button>
              </div>
            </div>

            {/* Expandable Description */}
            {provider.description && (
              <div className="border-t border-slate-50 pt-4">
                <button 
                  onClick={() => toggleDescription(provider.id)}
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-indigo-600 transition-colors mb-2"
                >
                  Sobre o Profissional
                  {expandedDescriptions[provider.id] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
                {expandedDescriptions[provider.id] && (
                  <p className="text-sm text-slate-600 leading-relaxed font-medium animate-in slide-in-from-top-1 duration-300">
                    {provider.description}
                  </p>
                )}
              </div>
            )}
          </div>
        )) : (
          <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200 mb-4">
              <User size={40} />
            </div>
            <p className="text-slate-400 font-black text-lg">Nenhum profissional disponível no momento.</p>
            <p className="text-slate-400 text-sm mt-1">Tente trocar a cidade ou volte em breve.</p>
            <Link to="/cadastro" className="text-indigo-600 text-sm font-black mt-6 inline-flex items-center gap-2 hover:translate-x-1 transition-all">
              Seja o primeiro a oferecer este serviço aqui <ChevronLeft className="rotate-180" size={16} />
            </Link>
          </div>
        )}
      </div>

      <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 p-8 rounded-[2.5rem] border border-white/10 mt-12 text-white shadow-2xl shadow-indigo-200 relative overflow-hidden">
        <div className="relative z-10">
          <h4 className="font-black text-xl mb-2">Compromisso com Qualidade</h4>
          <p className="text-sm text-indigo-100 leading-relaxed font-medium max-w-lg">
            O Serviços Já conecta você aos melhores profissionais. Combine valores, prazos e detalhes diretamente no WhatsApp.
          </p>
        </div>
        <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
      </div>
    </div>
  );
};
