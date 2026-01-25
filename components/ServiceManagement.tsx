
import React, { useState } from 'react';
import { Wrench, Plus, Check, X, GripVertical, Trash2 } from 'lucide-react';
import { dataService } from '../services/dataService';
import { Service } from '../types';

export const ServiceManagement: React.FC = () => {
  const [services, setServices] = useState<Service[]>(dataService.getServices());
  const [newServiceName, setNewServiceName] = useState('');

  const toggleService = (service: Service) => {
    const updated = { ...service, active: !service.active };
    dataService.saveService(updated);
    setServices(dataService.getServices());
  };

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName.trim()) return;
    
    const newService: Service = {
      id: Date.now().toString(),
      name: newServiceName,
      active: true,
      priority: services.length + 1
    };
    
    dataService.saveService(newService);
    setServices(dataService.getServices());
    setNewServiceName('');
  };

  return (
    <div className="max-w-4xl space-y-8">
      <header>
        <h2 className="text-2xl font-bold text-slate-900">Gestão de Serviços</h2>
        <p className="text-slate-500">Configure as categorias que os prestadores podem oferecer.</p>
      </header>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <form onSubmit={handleAddService} className="flex gap-4 mb-8">
          <input 
            type="text" 
            placeholder="Nome do novo serviço (ex: Pintor)"
            className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            value={newServiceName}
            onChange={(e) => setNewServiceName(e.target.value)}
          />
          <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 flex items-center gap-2">
            <Plus size={18} /> Adicionar
          </button>
        </form>

        <div className="space-y-2">
          {services.sort((a, b) => a.priority - b.priority).map((service) => (
            <div key={service.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100/80 transition-colors">
              <GripVertical className="text-slate-300 cursor-move" size={20} />
              <div className="flex-1">
                <span className={`font-medium ${!service.active ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                  {service.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => toggleService(service)}
                  className={`p-2 rounded-lg transition-colors ${
                    service.active ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {service.active ? <Check size={18} /> : <X size={18} />}
                </button>
                <button className="p-2 text-slate-400 hover:text-rose-600 transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
