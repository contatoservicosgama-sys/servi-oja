
import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Eye, 
  History,
  Info,
  ExternalLink,
  MessageCircle,
  Smartphone,
  CreditCard
} from 'lucide-react';
import { dataService } from '../services/dataService';
import { Payment, PaymentStatus, ProviderStatus } from '../types';

export const PaymentList: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>(dataService.getPayments());
  const providers = dataService.getProviders();

  const getProvider = (id: string) => providers.find(p => p.id === id);

  const updatePaymentStatus = (payment: Payment, status: PaymentStatus) => {
    const updatedPayment = { ...payment, status };
    dataService.savePayment(updatedPayment);

    if (status === PaymentStatus.APPROVED) {
      const provider = providers.find(p => p.id === payment.providerId);
      if (provider) {
        const now = new Date();
        const currentDue = new Date(provider.dueDate);
        const baseDate = currentDue > now ? currentDue : now;
        
        const newDueDate = new Date(baseDate);
        newDueDate.setDate(newDueDate.getDate() + 30);

        dataService.saveProvider({
          ...provider,
          status: ProviderStatus.ACTIVE,
          dueDate: newDueDate.toISOString(),
          activatedAt: now.toISOString()
        });
        alert(`Pagamento confirmado! O perfil de ${provider.name} foi ativado até ${newDueDate.toLocaleDateString('pt-BR')}.`);
      }
    }

    setPayments(dataService.getPayments());
  };

  const openWhatsApp = (phone: string, name: string, isRejection = false) => {
    const templates = dataService.getTemplates();
    const type = isRejection ? 'Pagamento Rejeitado' : 'Pagamento Aprovado';
    const tpl = templates.find(t => t.type === type);
    const message = encodeURIComponent(tpl?.content || `Olá ${name}, sobre seu pagamento no Serviços Já...`);
    window.open(`https://wa.me/55${phone.replace(/\D/g, '')}?text=${message}`, '_blank');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Validação de Pagamentos</h2>
          <p className="text-slate-500 font-medium">Aprove comprovantes para liberar anúncios instantaneamente.</p>
        </div>
      </header>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Prestador</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Valor / Data</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Ação de Ativação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {payments.length > 0 ? [...payments].reverse().map((payment) => {
                const provider = getProvider(payment.providerId);
                return (
                  <tr key={payment.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 text-lg">{provider?.name || 'N/A'}</span>
                        {provider && (
                          <button 
                            onClick={() => openWhatsApp(provider.phone, provider.name)}
                            className="flex items-center gap-1.5 text-xs text-indigo-600 font-black hover:underline mt-1"
                          >
                            <MessageCircle size={14} /> {provider.phone}
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="font-black text-slate-900 tracking-tight">R$ {payment.value.toFixed(2)}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                          {new Date(payment.date).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        payment.status === PaymentStatus.APPROVED ? 'bg-emerald-100 text-emerald-700' :
                        payment.status === PaymentStatus.PENDING ? 'bg-amber-100 text-amber-700 animate-pulse' :
                        'bg-rose-100 text-rose-700'
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-3">
                        {payment.status === PaymentStatus.PENDING ? (
                          <>
                            <button 
                              onClick={() => updatePaymentStatus(payment, PaymentStatus.APPROVED)}
                              className="bg-emerald-500 text-white px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center gap-2 shadow-lg shadow-emerald-100 active:scale-95"
                            >
                              <CheckCircle2 size={16} /> Aprovar e Ativar
                            </button>
                            <button 
                              onClick={() => {
                                updatePaymentStatus(payment, PaymentStatus.REJECTED);
                                if (provider) openWhatsApp(provider.phone, provider.name, true);
                              }}
                              className="bg-white text-rose-500 border border-rose-100 px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 transition-all flex items-center gap-2 active:scale-95"
                            >
                              <XCircle size={16} /> Rejeitar
                            </button>
                          </>
                        ) : (
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-black uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-xl">
                            <History size={14} /> Processado
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <div className="opacity-20 flex flex-col items-center gap-2">
                       <CreditCard size={48} />
                       <p className="font-black uppercase tracking-widest text-sm">Nenhum pagamento pendente</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white flex flex-col sm:flex-row items-center gap-6 shadow-2xl shadow-indigo-100">
        <div className="bg-white/20 p-4 rounded-3xl shrink-0">
          <Info size={32} />
        </div>
        <div>
          <h4 className="font-black text-xl mb-1">Dica de Ativação</h4>
          <p className="text-sm text-indigo-100 leading-relaxed font-medium">
            Sempre confira o valor no seu banco antes de clicar em <strong>Aprovar</strong>. Ao confirmar, o sistema libera o acesso do profissional por 30 dias e envia uma notificação automática (opcional) no WhatsApp.
          </p>
        </div>
      </div>
    </div>
  );
};
