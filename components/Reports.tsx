
import React from 'react';
import { Download, PieChart } from 'lucide-react';
import { dataService } from '../services/dataService';
import { PaymentStatus } from '../types';

export const Reports: React.FC = () => {
  const providers = dataService.getProviders();
  const payments = dataService.getPayments();

  const totalAprovado = payments
    .filter(p => p.status === PaymentStatus.APPROVED)
    .reduce((acc, curr) => acc + curr.value, 0);

  const totalPendente = payments
    .filter(p => p.status === PaymentStatus.PENDING)
    .reduce((acc, curr) => acc + curr.value, 0);

  const handleExport = (e: React.MouseEvent) => {
    e.preventDefault();
    const csvRows = [
      ['Nome', 'Telefone', 'Status', 'Vencimento'],
      ...providers.map(p => [
        `"${p.name.replace(/"/g, '""')}"`, 
        `"${p.phone}"`, 
        `"${p.status}"`, 
        `"${p.dueDate}"`
      ])
    ];
    
    const csvContent = csvRows.map(e => e.join(',')).join('\n');
    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sua_mao_de_obra_prestadores.csv';
    
    document.body.appendChild(link);
    try {
      link.click();
    } catch (err) {
      console.error("Erro ao processar download:", err);
    } finally {
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Relatórios Simples</h2>
          <p className="text-slate-500 font-medium">Visão financeira e de crescimento do seu negócio.</p>
        </div>
        <button 
          onClick={handleExport}
          className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl hover:bg-slate-800 transition-all shadow-lg active:scale-95 border-none cursor-pointer font-bold text-sm"
        >
          <Download size={18} /> Exportar CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Arrecadado</p>
          <h4 className="text-2xl font-black text-emerald-600 tracking-tight">R$ {totalAprovado.toFixed(2)}</h4>
        </div>
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">A Receber (Pendentes)</p>
          <h4 className="text-2xl font-black text-amber-600 tracking-tight">R$ {totalPendente.toFixed(2)}</h4>
        </div>
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total de Profissionais</p>
          <h4 className="text-2xl font-black text-indigo-600 tracking-tight">{providers.length}</h4>
        </div>
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Bloqueados</p>
          <h4 className="text-2xl font-black text-slate-400 tracking-tight">
            {providers.filter(p => p.status === 'Bloqueado').length}
          </h4>
        </div>
      </div>

      <div className="bg-white p-12 rounded-[3rem] shadow-sm border border-slate-100 text-center space-y-4">
        <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto text-slate-200">
          <PieChart size={40} />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-black text-slate-900">Relatório de Crescimento</h3>
          <p className="text-slate-500 max-w-md mx-auto font-medium">
            Estes dados ajudam a entender a demanda regional da plataforma Sua Mão de Obra e identificar quando é hora de expandir para novas cidades.
          </p>
        </div>
      </div>
    </div>
  );
};
