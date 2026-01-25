
import React, { useState, useMemo, useRef } from 'react';
import { 
  Search, 
  CheckCircle2, 
  Ban, 
  Trash2, 
  Phone, 
  Plus,
  X,
  Edit2,
  ExternalLink,
  MapPin,
  Clock,
  MessageCircle,
  Camera,
  Briefcase,
  Link as LinkIcon,
  User,
  Upload,
  Image as ImageIcon,
  Filter,
  Eye,
  Mail,
  FileText,
  Globe,
  Instagram,
  Facebook,
  Info,
  Zap
} from 'lucide-react';
import { dataService } from '../services/dataService';
import { Provider, ProviderStatus, City, Service } from '../types';

export const ProviderList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [providers, setProviders] = useState<Provider[]>(dataService.getProviders());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const cities = dataService.getCities();
  const services = dataService.getServices();

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    document: '',
    cityId: '',
    serviceIds: [] as string[],
    status: ProviderStatus.PENDING,
    dueDate: new Date(Date.now() + 86400000 * 30).toISOString(),
    profileImage: '',
    description: '',
    portfolioUrl: '',
    websiteUrl: '',
    instagramUrl: '',
    facebookUrl: '',
    additionalInfo: ''
  });

  const filteredProviders = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase();
    return providers.filter(p => {
      const matchesSearch = 
        p.name.toLowerCase().includes(lowerSearch) || 
        p.phone.includes(searchTerm) ||
        p.serviceIds.some(id => services.find(s => s.id === id)?.name.toLowerCase().includes(lowerSearch));
      
      const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [providers, searchTerm, statusFilter, services]);

  const handleQuickActivate = (id: string) => {
    const provider = providers.find(p => p.id === id);
    if (provider) {
      if (confirm(`Deseja ativar o plano de 30 dias para ${provider.name} agora?`)) {
        const newDueDate = new Date();
        newDueDate.setDate(newDueDate.getDate() + 30);
        const updated = { ...provider, status: ProviderStatus.ACTIVE, dueDate: newDueDate.toISOString() };
        dataService.saveProvider(updated);
        setProviders(dataService.getProviders());
      }
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este prestador?')) {
      dataService.deleteProvider(id);
      setProviders(dataService.getProviders());
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profileImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, profileImage: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const openModal = (provider?: Provider) => {
    if (provider) {
      setEditingProvider(provider);
      setFormData({
        name: provider.name,
        phone: provider.phone,
        email: provider.email || '',
        document: provider.document || '',
        cityId: provider.cityId,
        serviceIds: provider.serviceIds,
        status: provider.status,
        dueDate: provider.dueDate,
        profileImage: provider.profileImage || '',
        description: provider.description || '',
        portfolioUrl: provider.portfolioUrl || '',
        websiteUrl: provider.websiteUrl || '',
        instagramUrl: provider.instagramUrl || '',
        facebookUrl: provider.facebookUrl || '',
        additionalInfo: provider.additionalInfo || ''
      });
    } else {
      setEditingProvider(null);
      setFormData({
        name: '',
        phone: '',
        email: '',
        document: '',
        cityId: cities[0]?.id || '',
        serviceIds: [],
        status: ProviderStatus.PENDING,
        dueDate: new Date(Date.now() + 86400000 * 30).toISOString(),
        profileImage: '',
        description: '',
        portfolioUrl: '',
        websiteUrl: '',
        instagramUrl: '',
        facebookUrl: '',
        additionalInfo: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const providerData: Provider = {
      id: editingProvider?.id || Date.now().toString(),
      createdAt: editingProvider?.createdAt || new Date().toISOString(),
      ...formData
    };
    dataService.saveProvider(providerData);
    setProviders(dataService.getProviders());
    setIsModalOpen(false);
  };

  const toggleServiceInForm = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      serviceIds: prev.serviceIds.includes(serviceId)
        ? prev.serviceIds.filter(id => id !== serviceId)
        : [...prev.serviceIds, serviceId]
    }));
  };

  const getCityName = (cityId: string) => cities.find(c => c.id === cityId)?.name || 'N/A';
  const getServiceNames = (ids: string[]) => {
    return ids.map(id => services.find(s => s.id === id)?.name).filter(Boolean).join(', ');
  };

  const openWhatsApp = (phone: string, name: string) => {
    const message = encodeURIComponent(`Olá ${name}, falo do suporte Serviços Já.`);
    window.open(`https://wa.me/55${phone.replace(/\D/g, '')}?text=${message}`, '_blank');
  };

  const viewPublicProfile = (provider: Provider) => {
    if (provider.serviceIds.length > 0) {
      window.open(`/#/busca/${provider.serviceIds[0]}`, '_blank');
    } else {
      alert('Este prestador não possui serviços vinculados.');
    }
  };

  return (
    <div className="space-y-8 pb-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">Gestão de Prestadores</h2>
          <p className="text-slate-500 font-medium">Controle total sobre a visibilidade dos profissionais.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3.5 rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95"
        >
          <Plus size={20} />
          <span>Novo Prestador</span>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full group">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <Search className="text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
          </div>
          <input 
            type="text" 
            placeholder="Buscar por nome, telefone ou serviço..."
            className="w-full pl-14 pr-6 py-4.5 bg-white border border-slate-100 rounded-2xl shadow-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all font-medium text-slate-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full lg:w-auto overflow-x-auto pb-2 scrollbar-hide">
          {['all', ProviderStatus.ACTIVE, ProviderStatus.PENDING, ProviderStatus.BLOCKED].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all flex-1 lg:flex-none whitespace-nowrap ${
                statusFilter === status 
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' 
                  : 'bg-white text-slate-500 border-slate-100 hover:bg-slate-50'
              }`}
            >
              {status === 'all' ? 'Todos' : status}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Profissional</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Atuação</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Vencimento</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Ações de Gestão</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredProviders.length > 0 ? filteredProviders.map((provider) => (
                <tr key={provider.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 font-black text-lg group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors overflow-hidden border border-slate-200">
                        {provider.profileImage ? (
                          <img src={provider.profileImage} alt={provider.name} className="w-full h-full object-cover" />
                        ) : (
                          provider.name.charAt(0)
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 leading-tight">{provider.name}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <button 
                            onClick={() => openWhatsApp(provider.phone, provider.name)}
                            className="text-[10px] text-indigo-600 font-black flex items-center gap-1 hover:underline"
                          >
                            <MessageCircle size={12} /> {provider.phone}
                          </button>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-black text-slate-700 flex items-center gap-1">
                        <MapPin size={12} className="text-indigo-600" />
                        {getCityName(provider.cityId)}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider line-clamp-1 max-w-[150px]">
                        {getServiceNames(provider.serviceIds)}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl w-fit">
                      <Clock size={14} className="text-slate-400" />
                      {new Date(provider.dueDate).toLocaleDateString('pt-BR')}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      provider.status === ProviderStatus.ACTIVE ? 'bg-emerald-100 text-emerald-700' :
                      provider.status === ProviderStatus.PENDING ? 'bg-amber-100 text-amber-700 animate-pulse' :
                      'bg-rose-100 text-rose-700'
                    }`}>
                      {provider.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2 items-center">
                      {provider.status !== ProviderStatus.ACTIVE && (
                        <button 
                          onClick={() => handleQuickActivate(provider.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-50 active:scale-95"
                          title="Ativar Manualmente"
                        >
                          <Zap size={14} fill="currentColor" /> Ativar Agora
                        </button>
                      )}
                      <div className="flex gap-1 ml-2">
                        <button 
                          onClick={() => viewPublicProfile(provider)}
                          className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                          title="Ver Perfil Público"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={() => openModal(provider)}
                          className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                          title="Editar"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(provider.id)}
                          className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                          title="Excluir"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-8 py-16 text-center">
                    <div className="flex flex-col items-center gap-2 opacity-30">
                       <Search size={48} />
                       <p className="font-bold">Nenhum prestador encontrado</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form permanece igual... */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-5xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                  <User size={32} />
                </div>
                <div>
                  <h3 className="font-black text-2xl text-slate-900 leading-tight">
                    {editingProvider ? 'Editar Profissional' : 'Novo Cadastro'}
                  </h3>
                  <p className="text-sm text-slate-500 font-medium">Preencha o perfil completo para visibilidade do cliente.</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-12 h-12 flex items-center justify-center bg-white text-slate-400 hover:text-slate-900 rounded-2xl transition-all shadow-sm border border-slate-100">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-10 grid grid-cols-1 lg:grid-cols-12 gap-10 max-h-[75vh] overflow-y-auto custom-scrollbar">
              {/* Left Column - Image and Basics */}
              <div className="lg:col-span-4 space-y-8">
                <div className="space-y-4 flex flex-col items-center">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1 block w-full text-center">Foto de Perfil</label>
                  <div className="relative group">
                    <div className="w-44 h-44 rounded-[2.5rem] bg-slate-100 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden transition-all group-hover:border-indigo-400 group-hover:bg-indigo-50 shadow-inner">
                      {formData.profileImage ? (
                        <img src={formData.profileImage} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <User size={64} className="text-slate-300" />
                      )}
                    </div>
                    <div className="absolute -bottom-2 -right-2 flex gap-2">
                       {formData.profileImage && (
                         <button 
                           type="button"
                           onClick={removeImage}
                           className="bg-rose-500 text-white p-2.5 rounded-2xl shadow-lg hover:bg-rose-600 transition-colors"
                           title="Remover foto"
                         >
                           <Trash2 size={16} />
                         </button>
                       )}
                       <button 
                         type="button"
                         onClick={() => fileInputRef.current?.click()}
                         className="bg-indigo-600 text-white p-2.5 rounded-2xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-colors"
                         title="Trocar foto"
                       >
                         <Camera size={16} />
                       </button>
                    </div>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Nome Profissional</label>
                    <input 
                      required
                      type="text" 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all font-bold text-slate-700"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">WhatsApp</label>
                    <input 
                      required
                      type="text" 
                      placeholder="31999999999"
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all font-bold text-slate-700"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Status do Perfil</label>
                    <select 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all font-bold text-slate-700 appearance-none"
                      value={formData.status}
                      onChange={e => setFormData({...formData, status: e.target.value as ProviderStatus})}
                    >
                      <option value={ProviderStatus.PENDING}>Pendente</option>
                      <option value={ProviderStatus.ACTIVE}>Ativo</option>
                      <option value={ProviderStatus.BLOCKED}>Bloqueado</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Cidade</label>
                    <select 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all font-bold text-slate-700 appearance-none"
                      value={formData.cityId}
                      onChange={e => setFormData({...formData, cityId: e.target.value})}
                    >
                      {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Vencimento do Plano</label>
                    <input 
                      type="date" 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all font-bold text-slate-700"
                      value={formData.dueDate.split('T')[0]}
                      onChange={e => setFormData({...formData, dueDate: new Date(e.target.value).toISOString()})}
                    />
                  </div>
                </div>
              </div>

              {/* Right Column - Services and More */}
              <div className="lg:col-span-8 space-y-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center shadow-inner"><Globe size={18} /></div>
                      <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Presença Digital</h4>
                    </div>
                    <div className="space-y-4">
                      <input 
                        type="url" 
                        placeholder="Website"
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none font-bold text-slate-700"
                        value={formData.websiteUrl}
                        onChange={e => setFormData({...formData, websiteUrl: e.target.value})}
                      />
                      <input 
                        type="url" 
                        placeholder="Instagram"
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none font-bold text-slate-700"
                        value={formData.instagramUrl}
                        onChange={e => setFormData({...formData, instagramUrl: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center shadow-inner"><Info size={18} /></div>
                      <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Informações do Perfil</h4>
                    </div>
                    <textarea 
                      placeholder="Sobre o Profissional..."
                      className="w-full h-32 px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none font-bold text-slate-700 resize-none custom-scrollbar"
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center shadow-inner"><Briefcase size={18} /></div>
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Serviços Oferecidos</h4>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {services.map(s => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => toggleServiceInForm(s.id)}
                        className={`text-left px-4 py-3 rounded-2xl text-[10px] transition-all border font-black uppercase tracking-widest ${
                          formData.serviceIds.includes(s.id) 
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' 
                            : 'bg-white text-slate-500 border-slate-100 hover:border-indigo-300'
                        }`}
                      >
                        {s.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-10 flex gap-4 border-t border-slate-50">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-5 text-slate-400 font-black rounded-3xl hover:bg-slate-50 transition-all uppercase tracking-widest text-xs"
                  >
                    Descartar
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-5 bg-indigo-600 text-white font-black rounded-3xl hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-100 uppercase tracking-widest text-xs active:scale-95"
                  >
                    Salvar Alterações
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
