
import React from 'react';
import { Download, PieChart, TrendingUp, Users } from 'lucide-react';
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

  const handleExport = () => {
    // Better CSV formatting with quotes to handle commas in names
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
    
    // Add UTF-8 BOM (\ufeff) so Excel opens it with correct encoding
    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'servicos_ja_prestadores.csv');
    
    // Append to body to ensure it works in all browser environments
    document.body.appendChild(link);
    
    try {
      link.click();
    } catch (err) {
      console.error("Erro ao tentar baixar o arquivo:", err);
    } finally {
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Relatórios Simples</h2>
          <p className="text-slate-500">Visão financeira e de crescimento do seu negócio.</p>
        </div>
        <button 
          onClick={handleExport}
          className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors shadow-lg active:scale-95"
        >
          <Download size={18} /> Exportar CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-sm font-medium text-slate-500 mb-1">Total Arrecadado</p>
          <h4 className="text-2xl font-bold text-emerald-600">R$ {totalAprovado.toFixed(2)}</h4>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-sm font-medium text-slate-500 mb-1">A Receber (Pendentes)</p>
          <h4 className="text-2xl font-bold text-amber-600">R$ {totalPendente.toFixed(2)}</h4>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-sm font-medium text-slate-500 mb-1">Novos Prestadores (30d)</p>
          <h4 className="text-2xl font-bold text-indigo-600">8</h4>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-sm font-medium text-slate-500 mb-1">Cancelamentos</p>
          <h4 className="text-2xl font-bold text-slate-400">2</h4>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center space-y-4">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-400">
          <PieChart size={32} />
        </div>
        <h3 className="text-lg font-bold">Relatório de Crescimento</h3>
        <p className="text-slate-500 max-w-md mx-auto">
          No momento você opera sozinho (estilo MEI). Estes dados ajudam a entender quando é hora de expandir para novas cidades.
        </p>
      </div>
    </div>
  );
};
