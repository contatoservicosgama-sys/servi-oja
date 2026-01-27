
import React, { useState } from 'react';
import { MapPin, Plus, Power, Trash2 } from 'lucide-react';
import { dataService } from '../services/dataService';
import { City } from '../types';

export const CityManagement: React.FC = () => {
  const [cities, setCities] = useState<City[]>(dataService.getCities());
  const [newCityName, setNewCityName] = useState('');

  const toggleCity = (city: City) => {
    const updated = { ...city, active: !city.active };
    dataService.saveCity(updated);
    setCities(dataService.getCities());
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCityName.trim()) return;
    const newCity: City = { id: Date.now().toString(), name: newCityName, active: true };
    dataService.saveCity(newCity);
    setCities(dataService.getCities());
    setNewCityName('');
  };

  return (
    <div className="max-w-4xl space-y-8">
      <header>
        <h2 className="text-2xl font-bold text-slate-900">Cidades e Regiões</h2>
        <p className="text-slate-500">Gerencie onde a plataforma Sua Mão de Obra está operando.</p>
      </header>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <form onSubmit={handleAdd} className="flex gap-4 mb-8">
          <input 
            type="text" 
            placeholder="Nome da cidade (ex: Betim)"
            className="flex-1 px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            value={newCityName}
            onChange={(e) => setNewCityName(e.target.value)}
          />
          <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 flex items-center gap-2 border-none cursor-pointer">
            <Plus size={18} /> Ativar Cidade
          </button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cities.map((city) => (
            <div key={city.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3">
                <MapPin className={city.active ? 'text-indigo-600' : 'text-slate-300'} />
                <span className={`font-semibold ${city.active ? 'text-slate-900' : 'text-slate-400'}`}>
                  {city.name}
                </span>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => toggleCity(city)}
                  className={`p-2 rounded-lg border-none cursor-pointer transition-colors ${city.active ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400 bg-slate-100'}`}
                >
                  <Power size={18} />
                </button>
                <button className="p-2 text-slate-400 hover:text-rose-600 bg-transparent border-none cursor-pointer transition-colors">
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
