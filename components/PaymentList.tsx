
import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Eye, 
  History,
  Info,
  ExternalLink
} from 'lucide-react';
import { dataService } from '../services/dataService';
import { Payment, PaymentStatus, ProviderStatus } from '../types';

export const PaymentList: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>(dataService.getPayments());
  const providers = dataService.getProviders();

  const getProviderName = (id: string) => providers.find(p => p.id === id)?.name || 'N/A';

  const updatePaymentStatus = (payment: Payment, status: PaymentStatus) => {
    const updatedPayment = { ...payment, status };
    dataService.savePayment(updatedPayment);

    if (status === PaymentStatus.APPROVED) {
      const provider = providers.find(p => p.id === payment.providerId);
      if (provider) {
        // Lógica de Renovação: 30 dias a partir do vencimento atual ou de hoje (o que for maior)
        const now = new Date();
        const currentDue = new Date(provider.dueDate);
        
        // Se o plano ainda não venceu, soma 30 dias ao vencimento atual. 
        // Se já venceu, soma 30 dias a partir de hoje.
        const baseDate = currentDue > now ? currentDue : now;
        
        const newDueDate = new Date(baseDate);
        newDueDate.setDate(newDueDate.getDate() + 30);

        dataService.saveProvider({
          ...provider,
          status: ProviderStatus.ACTIVE,
          dueDate: newDueDate.toISOString()
        });
      }
    }

    setPayments(dataService.getPayments());
  };

  const openWhatsAppRejection = (providerId: string) => {
    const provider = providers.find(p => p.id === providerId);
    if (!provider) return;

    const templates = dataService.getTemplates();
    const rejectTpl = templates.find(t => t.type === 'Pagamento Rejeitado');
    const message = encodeURIComponent(rejectTpl?.content || 'Seu comprovante de pagamento foi rejeitado. Verifique seus dados.');
    window.open(`https://wa.me/55${provider.phone.replace(/\D/g, '')}?text=${message}`, '_blank');
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Validação de Pagamentos</h2>
          <p className="text-slate-500">Aprove os comprovantes PIX para liberar os anúncios.</p>
        </div>
      </header>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Prestador</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Valor</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Data</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {payments.length > 0 ? [...payments].reverse().map((payment) => (
                <tr key={payment.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900">
                    {getProviderName(payment.providerId)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-black text-indigo-600">R$ {payment.value.toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-sm">
                    {new Date(payment.date).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      payment.status === PaymentStatus.APPROVED ? 'bg-emerald-100 text-emerald-700' :
                      payment.status === PaymentStatus.PENDING ? 'bg-amber-100 text-amber-700' :
                      'bg-rose-100 text-rose-700'
                    }`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {payment.status === PaymentStatus.PENDING ? (
                        <>
                          <button 
                            onClick={() => updatePaymentStatus(payment, PaymentStatus.APPROVED)}
                            className="bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-600 hover:text-white transition-all flex items-center gap-1.5"
                          >
                            <CheckCircle2 size={14} /> Aprovar
                          </button>
                          <button 
                            onClick={() => {
                              updatePaymentStatus(payment, PaymentStatus.REJECTED);
                              openWhatsAppRejection(payment.providerId);
                            }}
                            className="bg-rose-50 text-rose-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-rose-600 hover:text-white transition-all flex items-center gap-1.5"
                          >
                            <XCircle size={14} /> Rejeitar
                          </button>
                        </>
                      ) : (
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold">
                          <History size={14} /> Histórico
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">
                    Nenhum pagamento pendente no momento.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100 flex items-start gap-4">
        <div className="bg-indigo-100 p-2 rounded-xl text-indigo-600 shrink-0">
          <Info size={20} />
        </div>
        <div>
          <h4 className="font-bold text-indigo-900 text-sm mb-1">Como funciona a renovação?</h4>
          <p className="text-xs text-indigo-700 leading-relaxed">
            Ao clicar em <strong>Aprovar</strong>, o sistema soma 30 dias ao vencimento atual do prestador. 
            Se o plano já estiver vencido, os 30 dias começam a contar a partir de hoje. O status do prestador muda automaticamente para <strong>Ativo</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};
