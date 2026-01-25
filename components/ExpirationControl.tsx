
import React, { useMemo } from 'react';
import { 
  Bell, 
  MessageSquare, 
  Calendar, 
  AlertCircle,
  Clock
} from 'lucide-react';
import { dataService } from '../services/dataService';
import { Provider, ProviderStatus } from '../types';

export const ExpirationControl: React.FC = () => {
  const providers = dataService.getProviders();

  const categories = useMemo(() => {
    const today = new Date();
    today.setHours(0,0,0,0);
    
    return {
      expired: providers.filter(p => new Date(p.dueDate) < today),
      today: providers.filter(p => {
        const d = new Date(p.dueDate);
        d.setHours(0,0,0,0);
        return d.getTime() === today.getTime();
      }),
      soon: providers.filter(p => {
        const d = new Date(p.dueDate);
        const diff = d.getTime() - today.getTime();
        return diff > 0 && diff < 86400000 * 3; // next 3 days
      })
    };
  }, [providers]);

  const sendReminder = (provider: Provider) => {
    const templates = dataService.getTemplates();
    const tpl = templates.find(t => t.type === 'Plano Vencido');
    const message = encodeURIComponent(tpl?.content || 'Seu plano venceu.');
    window.open(`https://wa.me/55${provider.phone.replace(/\D/g, '')}?text=${message}`, '_blank');
  };

  const ProviderExpCard: React.FC<{ provider: Provider; type: 'expired' | 'today' | 'soon' }> = ({ provider, type }) => (
    <div className="bg-white p-4 rounded-xl border border-slate-100 flex justify-between items-center shadow-sm">
      <div className="flex items-center gap-4">
        <div className={`p-2 rounded-lg ${
          type === 'expired' ? 'bg-rose-50 text-rose-600' :
          type === 'today' ? 'bg-amber-50 text-amber-600' :
          'bg-slate-50 text-slate-600'
        }`}>
          {type === 'expired' ? <AlertCircle size={20} /> : <Clock size={20} />}
        </div>
        <div>
          <h4 className="font-semibold text-slate-900">{provider.name}</h4>
          <p className="text-xs text-slate-500">
            Vencimento: {new Date(provider.dueDate).toLocaleDateString('pt-BR')}
          </p>
        </div>
      </div>
      <button 
        onClick={() => sendReminder(provider)}
        className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500 text-white text-xs font-bold rounded-lg hover:bg-emerald-600 transition-colors"
      >
        <MessageSquare size={14} /> Lembrar
      </button>
    </div>
  );

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-2xl font-bold text-slate-900">Controle de Vencimentos</h2>
        <p className="text-slate-500">Monitore planos ativos e envie lembretes de renovação.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Expired */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-rose-600 uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-600"></span>
            Vencidos ({categories.expired.length})
          </h3>
          <div className="space-y-3">
            {categories.expired.map(p => <ProviderExpCard key={p.id} provider={p} type="expired" />)}
            {categories.expired.length === 0 && <p className="text-sm text-slate-400 italic">Nenhum vencido.</p>}
          </div>
        </div>

        {/* Today */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-amber-600 uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-600"></span>
            Vencendo Hoje ({categories.today.length})
          </h3>
          <div className="space-y-3">
            {categories.today.map(p => <ProviderExpCard key={p.id} provider={p} type="today" />)}
            {categories.today.length === 0 && <p className="text-sm text-slate-400 italic">Nenhum para hoje.</p>}
          </div>
        </div>

        {/* Coming Soon */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-slate-400"></span>
            Próximos dias ({categories.soon.length})
          </h3>
          <div className="space-y-3">
            {categories.soon.map(p => <ProviderExpCard key={p.id} provider={p} type="soon" />)}
            {categories.soon.length === 0 && <p className="text-sm text-slate-400 italic">Nenhum próximo.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};
