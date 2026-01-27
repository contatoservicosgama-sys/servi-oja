
import React, { useState, useRef } from 'react';
import { 
  CheckCircle2, 
  Smartphone, 
  ArrowRight,
  ClipboardCheck,
  Info,
  PartyPopper,
  Home,
  Camera,
  Briefcase,
  Link as LinkIcon,
  User,
  Trash2,
  Mail,
  FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { dataService } from '../services/dataService';
import { ProviderStatus } from '../types';

export const RegistrationFlow: React.FC = () => {
  const [step, setStep] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cities = dataService.getCities();
  const services = dataService.getServices().filter(s => s.active);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    document: '',
    cityId: cities[0]?.id || '',
    serviceIds: [] as string[],
    profileImage: '',
    description: '',
    portfolioUrl: ''
  });

  const toggleService = (id: string) => {
    setFormData(prev => ({
      ...prev,
      serviceIds: prev.serviceIds.includes(id) 
        ? prev.serviceIds.filter(sid => sid !== id)
        : [...prev.serviceIds, id]
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1 * 1024 * 1024) {
        alert('A foto deve ter no máximo 1MB para o cadastro.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profileImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.name.trim()) { alert('Informe seu nome profissional.'); return; }
      if (!formData.phone.trim() || formData.phone.length < 10) { alert('Informe um WhatsApp válido.'); return; }
      if (!formData.email.trim() || !formData.email.includes('@')) { alert('Informe um e-mail válido.'); return; }
      if (formData.serviceIds.length === 0) { alert('Selecione ao menos um serviço que você oferece.'); return; }
      
      dataService.saveProvider({
        id: 'reg_' + Date.now(),
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        document: formData.document,
        cityId: formData.cityId,
        serviceIds: formData.serviceIds,
        profileImage: formData.profileImage,
        description: formData.description,
        portfolioUrl: formData.portfolioUrl,
        status: ProviderStatus.PENDING,
        dueDate: new Date().toISOString(),
        createdAt: new Date().toISOString()
      });
      
      setStep(2);
      window.scrollTo(0, 0);
    }
  };

  const handleComplete = () => {
    const msg = encodeURIComponent(`Olá, sou o ${formData.name} e acabei de fazer o PIX de R$ 39,90 para ativar meu plano no Pronto!.`);
    window.open(`https://wa.me/5531984279865?text=${msg}`, '_blank');
    setStep(3);
  };

  if (step === 3) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center space-y-8 animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-emerald-100">
          <PartyPopper size={48} />
        </div>
        <div className="space-y-4">
          <h2 className="text-3xl font-black text-slate-900">Solicitação Enviada!</h2>
          <p className="text-slate-500 font-medium leading-relaxed">
            Recebemos seus dados. Assim que confirmarmos o seu PIX no WhatsApp, seu anúncio ficará visível para todos os clientes da região na plataforma Pronto!.
          </p>
        </div>
        <div className="pt-6">
          <Link to="/" className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black hover:bg-slate-800 transition-all shadow-xl active:scale-95">
            <Home size={20} /> Voltar para o Início
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 animate-in slide-in-from-bottom-4 duration-500">
      {/* Steps Indicator */}
      <div className="flex items-center justify-center gap-4">
        <div className={`flex items-center gap-3 ${step >= 1 ? 'text-indigo-600' : 'text-slate-300'}`}>
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm border-2 transition-all ${step >= 1 ? 'border-indigo-600 bg-indigo-50 shadow-lg shadow-indigo-100' : 'border-slate-200 bg-white'}`}>1</div>
          <span className="text-xs font-black uppercase tracking-widest hidden sm:inline">Cadastro</span>
        </div>
        <div className="w-12 h-1 bg-slate-200 rounded-full">
           <div className={`h-full bg-indigo-600 rounded-full transition-all duration-500 ${step >= 2 ? 'w-full' : 'w-0'}`}></div>
        </div>
        <div className={`flex items-center gap-3 ${step >= 2 ? 'text-indigo-600' : 'text-slate-300'}`}>
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm border-2 transition-all ${step >= 2 ? 'border-indigo-600 bg-indigo-50 shadow-lg shadow-indigo-100' : 'border-slate-200 bg-white'}`}>2</div>
          <span className="text-xs font-black uppercase tracking-widest hidden sm:inline">Ativação</span>
        </div>
      </div>

      {step === 1 ? (
        <div className="bg-white p-6 sm:p-10 rounded-[2.5rem] border border-slate-100 shadow-xl space-y-10">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">Comece a Receber Clientes</h2>
            <p className="text-slate-500 font-medium">Crie seu perfil profissional no Pronto! e apareça para quem precisa dos seus serviços hoje.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column */}
            <div className="lg:col-span-5 space-y-8">
              <section className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center"><User size={18} /></div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Dados Pessoais</h3>
                </div>

                <div className="flex flex-col items-center gap-4 p-6 bg-slate-50 rounded-[2rem] border border-slate-100 shadow-inner">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sua Foto de Perfil</label>
                  <div 
                    className="w-32 h-32 rounded-[2rem] bg-white border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden cursor-pointer hover:border-indigo-400 group transition-all relative"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {formData.profileImage ? (
                      <img src={formData.profileImage} alt="Perfil" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center gap-1">
                        <Camera size={24} className="text-slate-300 group-hover:text-indigo-400" />
                        <span className="text-[10px] text-slate-300 font-black">ADICIONAR</span>
                      </div>
                    )}
                  </div>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Nome Profissional</label>
                    <input 
                      type="text" 
                      placeholder="Ex: Carlos Eletricista"
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all font-bold text-slate-700"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">WhatsApp</label>
                    <div className="relative">
                      <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="tel" 
                        placeholder="31 99999-9999"
                        className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all font-bold text-slate-700"
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-7 space-y-10">
              <section className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center"><Briefcase size={18} /></div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Perfil Profissional</h3>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Onde você atende?</label>
                  <select 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all font-bold text-slate-700 appearance-none cursor-pointer"
                    value={formData.cityId}
                    onChange={e => setFormData({...formData, cityId: e.target.value})}
                  >
                    {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest block">Serviços que você oferece:</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[250px] overflow-y-auto p-1 custom-scrollbar">
                    {services.map(s => (
                      <button
                        key={s.id}
                        onClick={() => toggleService(s.id)}
                        className={`px-4 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all text-left flex items-center justify-between group ${
                          formData.serviceIds.includes(s.id)
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100'
                            : 'bg-white border-slate-200 text-slate-500 hover:border-indigo-300 hover:bg-slate-50'
                        }`}
                      >
                        {s.name}
                        {formData.serviceIds.includes(s.id) && <CheckCircle2 size={14} />}
                      </button>
                    ))}
                  </div>
                </div>
              </section>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-50">
             <button 
              onClick={handleNext}
              className="w-full py-5 bg-indigo-600 text-white font-black rounded-3xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-indigo-100 active:scale-95 uppercase tracking-widest text-xs border-none cursor-pointer"
            >
              Próximo Passo: Ativação <ArrowRight size={18} />
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 sm:p-10 rounded-[2.5rem] border border-slate-100 shadow-xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">Quase tudo pronto!</h2>
            <p className="text-slate-500 font-medium">Ative seu plano no Pronto! para começar a receber contatos hoje mesmo.</p>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 p-8 rounded-[2rem] text-white shadow-2xl shadow-indigo-200 space-y-6 relative overflow-hidden">
            <div className="relative z-10 flex justify-between items-start">
              <div>
                <p className="text-indigo-200 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Anunciante Profissional</p>
                <h3 className="text-2xl font-bold">Acesso Ilimitado</h3>
              </div>
              <div className="text-right">
                <span className="text-4xl font-black">R$ 39,90</span>
                <p className="text-indigo-200 text-[10px] font-black uppercase tracking-widest">por mês</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-black text-slate-900 flex items-center gap-3 text-lg">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-bold shadow-inner">2</div>
              Envie o Comprovante
            </h4>
            <button 
              onClick={handleComplete}
              className="w-full py-6 bg-emerald-500 text-white font-black rounded-3xl hover:bg-emerald-600 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-emerald-100 uppercase tracking-widest text-xs active:scale-95 border-none cursor-pointer"
            >
              <Smartphone size={24} /> Enviar Comprovante no WhatsApp
            </button>
          </div>
        </div>
      )}
    </div>
  );
};