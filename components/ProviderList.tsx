
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
  Zap,
  DollarSign
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

  const handleManualActivate = (id: string) => {
    const provider = providers.find(p => p.id === id);
    if (provider) {
      if (confirm(`⚠️ ATIVAÇÃO MANUAL: Você confirma que o PIX de R$ 39,90 de "${provider.name}" já caiu na conta?`)) {
        const now = new Date();
        const currentDue = new Date(provider.dueDate);
        const baseDate = currentDue > now ? currentDue : now;
        
        const newDueDate = new Date(baseDate);
        newDueDate.setDate(newDueDate.getDate() + 30);

        const updated = { ...provider, status: ProviderStatus.ACTIVE, dueDate: newDueDate.toISOString() };
        dataService.saveProvider(updated);
        setProviders(dataService.getProviders());
        alert('Plano ativado com sucesso por 30 dias.');
      }
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este prestador permanentemente?')) {
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
    const message = encodeURIComponent(`Olá ${name}, falo da administração do Serviços Já.`);
    window.open(`https://wa.me/55${phone.replace(/\D/g, '')}?text=${message}`, '_blank');
  };

  return (
    <div className="space-y-8 pb-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Gestão de Prestadores</h2>
          <p className="text-slate-500 font-medium">Ative profissionais somente após conferir o pagamento.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3.5 rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95"
        >
          <Plus size={20} />
          <span>Novo Prestador</span>
        </button>
      </div>

      {/* Filters */}
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
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Ação Manual</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredProviders.length > 0 ? filteredProviders.map((provider) => {
                const isExpired = new Date(provider.dueDate) < new Date();
                return (
                  <tr key={provider.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 font-black text-lg overflow-hidden border border-slate-200">
                          {provider.profileImage ? (
                            <img src={provider.profileImage} alt={provider.name} className="w-full h-full object-cover" />
                          ) : (
                            provider.name.charAt(0)
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900 leading-tight">{provider.name}</span>
                          <button 
                            onClick={() => openWhatsApp(provider.phone, provider.name)}
                            className="text-[10px] text-indigo-600 font-black flex items-center gap-1 hover:underline mt-1"
                          >
                            <MessageCircle size={12} /> {provider.phone}
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-slate-700 flex items-center gap-1">
                          <MapPin size={12} className="text-indigo-600" />
                          {getCityName(provider.cityId)}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider truncate max-w-[150px]">
                          {getServiceNames(provider.serviceIds)}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className={`flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-xl w-fit ${
                        isExpired ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-slate-50 text-slate-600'
                      }`}>
                        <Clock size={14} className={isExpired ? 'text-rose-500' : 'text-slate-400'} />
                        {new Date(provider.dueDate).toLocaleDateString('pt-BR')}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        provider.status === ProviderStatus.ACTIVE ? 'bg-emerald-100 text-emerald-700' :
                        provider.status === ProviderStatus.PENDING ? 'bg-amber-100 text-amber-700' :
                        'bg-rose-100 text-rose-700'
                      }`}>
                        {provider.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2 items-center">
                        {provider.status !== ProviderStatus.ACTIVE ? (
                          <button 
                            onClick={() => handleManualActivate(provider.id)}
                            className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-600 transition-all shadow-lg shadow-amber-100 active:scale-95"
                          >
                            <DollarSign size={14} /> Confirmar PIX e Ativar
                          </button>
                        ) : (
                           <button 
                             onClick={() => handleManualActivate(provider.id)}
                             className="text-[9px] font-black text-slate-400 hover:text-indigo-600 uppercase tracking-widest p-2"
                           >
                             Renovar +30d
                           </button>
                        )}
                        <div className="flex gap-1 ml-2">
                          <button onClick={() => openModal(provider)} className="p-2 text-slate-400 hover:text-indigo-600 transition-all"><Edit2 size={16} /></button>
                          <button onClick={() => handleDelete(provider.id)} className="p-2 text-slate-400 hover:text-rose-600 transition-all"><Trash2 size={16} /></button>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center opacity-30 font-black uppercase tracking-widest text-sm">
                    Nenhum profissional encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Reutilizado */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-5xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg"><User size={24} /></div>
                 <h3 className="font-black text-2xl text-slate-900">{editingProvider ? 'Editar' : 'Novo'} Prestador</h3>
               </div>
               <button onClick={() => setIsModalOpen(false)} className="p-3 bg-white text-slate-400 hover:text-slate-900 rounded-xl border border-slate-100 shadow-sm"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="lg:col-span-4 space-y-6">
                 <div className="flex flex-col items-center gap-4">
                    <div className="w-40 h-40 rounded-[2.5rem] bg-slate-100 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden">
                       {formData.profileImage ? <img src={formData.profileImage} className="w-full h-full object-cover" /> : <Camera size={48} className="text-slate-300" />}
                    </div>
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Alterar Foto</button>
                    <input type="file" ref={fileInputRef} className="hidden" onChange={handleImageChange} />
                 </div>
                 <div className="space-y-4">
                    <input required className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold" placeholder="Nome" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    <input required className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold" placeholder="WhatsApp" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                    <select className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold appearance-none" value={formData.cityId} onChange={e => setFormData({...formData, cityId: e.target.value})}>
                       {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                 </div>
              </div>
              <div className="lg:col-span-8 space-y-6">
                 <textarea className="w-full h-32 px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold resize-none" placeholder="Descrição dos serviços..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                 <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest">Serviços</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                       {services.map(s => (
                         <button key={s.id} type="button" onClick={() => toggleServiceInForm(s.id)} className={`px-3 py-2 text-[9px] font-black uppercase tracking-widest rounded-xl border transition-all ${formData.serviceIds.includes(s.id) ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-500 border-slate-100'}`}>{s.name}</button>
                       ))}
                    </div>
                 </div>
                 <div className="pt-6 flex gap-4">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-slate-400 font-black uppercase tracking-widest text-xs">Cancelar</button>
                    <button type="submit" className="flex-1 py-4 bg-indigo-600 text-white font-black rounded-2xl uppercase tracking-widest text-xs shadow-xl shadow-indigo-100">Salvar Prestador</button>
                 </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
