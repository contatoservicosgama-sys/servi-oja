
import React, { useState } from 'react';
import { MessageSquare, Save, Edit2 } from 'lucide-react';
import { dataService } from '../services/dataService';
import { MessageTemplate } from '../types';

export const MessageTemplates: React.FC = () => {
  const [templates, setTemplates] = useState<MessageTemplate[]>(dataService.getTemplates());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempContent, setTempContent] = useState('');

  const startEdit = (tpl: MessageTemplate) => {
    setEditingId(tpl.id);
    setTempContent(tpl.content);
  };

  const saveEdit = (tpl: MessageTemplate) => {
    const updated = { ...tpl, content: tempContent };
    dataService.saveTemplate(updated);
    setTemplates(dataService.getTemplates());
    setEditingId(null);
  };

  return (
    <div className="max-w-4xl space-y-8">
      <header>
        <h2 className="text-2xl font-bold text-slate-900">Mensagens Padrão</h2>
        <p className="text-slate-500">Configure os templates para automação via WhatsApp.</p>
      </header>

      <div className="space-y-6">
        {templates.map((tpl) => (
          <div key={tpl.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <MessageSquare size={18} />
                </div>
                <h3 className="font-bold text-slate-900">{tpl.type}</h3>
              </div>
              {editingId === tpl.id ? (
                <button 
                  onClick={() => saveEdit(tpl)}
                  className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg hover:bg-emerald-100"
                >
                  <Save size={14} /> Salvar
                </button>
              ) : (
                <button 
                  onClick={() => startEdit(tpl)}
                  className="flex items-center gap-1 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100"
                >
                  <Edit2 size={14} /> Editar
                </button>
              )}
            </div>
            {editingId === tpl.id ? (
              <textarea 
                className="w-full h-24 p-4 border border-indigo-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-700 bg-indigo-50/20"
                value={tempContent}
                onChange={(e) => setTempContent(e.target.value)}
              />
            ) : (
              <div className="p-4 bg-slate-50 rounded-xl text-slate-600 text-sm italic border border-slate-100">
                "{tpl.content}"
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
