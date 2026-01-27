
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  MapPin, 
  MessageCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  User
} from 'lucide-react';
import { dataService } from '../services/dataService';
import { ProviderStatus } from '../types';

export const ClientProviderList: React.FC = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [expandedDescriptions, setExpandedDescriptions] = useState<Record<string, boolean>>({});
  
  const services = dataService.getServices();
  const cities = dataService.getCities();
  const providers = dataService.getProviders().filter(p => 
    p.status === ProviderStatus.ACTIVE && 
    p.serviceIds.includes(serviceId || '')
  );

  const activeCities = cities.filter(c => providers.some(p => p.cityId === c.id));
  const filteredProviders = selectedCity === 'all' ? providers : providers.filter(p => p.cityId === selectedCity);
  const currentService = services.find(s => s.id === serviceId);

  const openWhatsApp = (phone: string, name: string) => {
    const text = encodeURIComponent(`Olá ${name}, vi seu perfil na plataforma Sua Mão de Obra e preciso de um orçamento para ${currentService?.name}.`);
    window.open(`https://wa.me/55${phone.replace(/\D/g, '')}?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/')} className="p-2 bg-white border border-slate-100 rounded-xl text-slate-600 hover:text-indigo-600 shadow-sm cursor-pointer">
          <ChevronLeft size={24} />
        </button>
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">{currentService?.name}</h2>
          <p className="text-sm text-slate-500 font-medium">Profissionais disponíveis na sua região</p>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button onClick={() => setSelectedCity('all')} className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap border transition-all cursor-pointer border-none ${selectedCity === 'all' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-600 border-slate-200'}`}>Todas as cidades</button>
        {activeCities.map(city => (
          <button key={city.id} onClick={() => setSelectedCity(city.id)} className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap border transition-all cursor-pointer border-none ${selectedCity === city.id ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-600 border-slate-200'}`}>{city.name}</button>
        ))}
      </div>

      <div className="space-y-6">
        {filteredProviders.length > 0 ? filteredProviders.map(provider => (
          <div key={provider.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-50 flex items-center justify-center text-indigo-400 font-black text-xl overflow-hidden border border-indigo-100">
                  {provider.profileImage ? <img src={provider.profileImage} className="w-full h-full object-cover" /> : <User size={24} />}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-black text-slate-900 leading-tight">{provider.name}</h3>
                    <div className="bg-emerald-50 text-emerald-600 text-[10px] uppercase font-black tracking-widest px-2 py-0.5 rounded-full border border-emerald-100">Verificado</div>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-slate-500">
                    <div className="flex items-center gap-1.5 text-xs font-bold"><MapPin size={14} className="text-indigo-600" />{cities.find(c => c.id === provider.cityId)?.name}</div>
                    <div className="flex items-center gap-1.5 text-xs font-bold"><Clock size={14} className="text-indigo-600" />Responde rápido</div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                {provider.portfolioUrl && <button onClick={() => window.open(provider.portfolioUrl, '_blank')} className="flex items-center justify-center gap-2 bg-slate-50 text-slate-600 px-6 py-3.5 rounded-2xl font-black hover:bg-slate-100 transition-all border-none text-xs uppercase tracking-widest cursor-pointer"><ImageIcon size={18} />Portfólio</button>}
                <button onClick={() => openWhatsApp(provider.phone, provider.name)} className="flex items-center justify-center gap-2 bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black hover:bg-emerald-600 transition-all shadow-xl uppercase tracking-widest text-xs border-none cursor-pointer"><MessageCircle size={18} />Orçamento Grátis</button>
              </div>
            </div>
            {provider.description && (
              <div className="border-t border-slate-50 pt-4">
                <button onClick={() => setExpandedDescriptions(prev => ({ ...prev, [provider.id]: !prev[provider.id] }))} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-indigo-600 transition-colors mb-2 bg-transparent border-none cursor-pointer">Sobre o Profissional {expandedDescriptions[provider.id] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}</button>
                {expandedDescriptions[provider.id] && <p className="text-sm text-slate-600 leading-relaxed font-medium animate-in slide-in-from-top-1 duration-300">{provider.description}</p>}
              </div>
            )}
          </div>
        )) : (
          <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200 mb-4"><User size={40} /></div>
            <p className="text-slate-400 font-black text-lg">Nenhum profissional disponível no momento.</p>
            <button onClick={() => navigate('/cadastro')} className="text-indigo-600 text-sm font-black mt-6 inline-flex items-center gap-2 hover:translate-x-1 transition-all bg-transparent border-none cursor-pointer">Seja o primeiro a oferecer este serviço aqui <ChevronLeft className="rotate-180" size={16} /></button>
          </div>
        )}
      </div>
    </div>
  );
};
