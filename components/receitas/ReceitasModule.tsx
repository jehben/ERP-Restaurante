'use client';

import { useState } from 'react';
import { Search, Filter, Plus, FileText, ChefHat, Lightbulb } from 'lucide-react';
import { Receita, FichaTecnica } from '@/lib/types';
import { mockReceitas, mockFichasTecnicas } from '@/lib/mock-data';
import ReceitaCard from './ReceitaCard';
import FichaTecnicaPanel from './FichaTecnicaPanel';
import NovaReceitaModal from './NovaReceitaModal';

export default function ReceitasModule() {
  const [receitas, setReceitas] = useState<Receita[]>(mockReceitas);
  const [fichas, setFichas] = useState<FichaTecnica[]>(mockFichasTecnicas);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState<string>('Todas');
  const [selectedReceitaId, setSelectedReceitaId] = useState<string | null>(null);
  const [showNovaReceitaModal, setShowNovaReceitaModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'fichas' | 'receitas' | 'insights'>('fichas');

  const filteredReceitas = receitas.filter(receita => {
    const matchSearch = receita.nome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategoria = selectedCategoria === 'Todas' || receita.categoria === selectedCategoria;
    return matchSearch && matchCategoria;
  });

  const categorias = ['Todas', 'Hambúrgueres', 'Porções', 'Bebidas', 'Sobremesas', 'Outros'];

  return (
    <div className="flex-1 flex h-full overflow-hidden bg-gray-50">
      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden border-r border-black/5">
        {/* Tabs */}
        <div className="bg-white border-b border-black/5 px-6 py-2 flex gap-6 shrink-0">
          <button 
            onClick={() => setActiveTab('fichas')}
            className={`pb-2 text-sm font-bold border-b-2 transition-colors ${activeTab === 'fichas' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-brand-light hover:text-brand-dark'}`}
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Fichas Técnicas
            </div>
          </button>
          <button 
            onClick={() => setActiveTab('receitas')}
            className={`pb-2 text-sm font-bold border-b-2 transition-colors ${activeTab === 'receitas' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-brand-light hover:text-brand-dark'}`}
          >
            <div className="flex items-center gap-2">
              <ChefHat className="w-4 h-4" />
              Receitas Base
            </div>
          </button>
        </div>

        {/* Toolbar */}
        <div className="p-6 pb-4 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-brand-light" />
              <input 
                type="text" 
                placeholder="Buscar receita..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-black/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/50"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 hide-scrollbar">
              {categorias.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategoria(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${selectedCategoria === cat ? 'bg-brand-dark text-white' : 'bg-white text-brand-light border border-black/10 hover:border-black/20'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <button 
            onClick={() => setShowNovaReceitaModal(true)}
            className="ml-4 px-4 py-2 bg-brand-orange text-white text-sm font-bold pill shadow-orange hover:bg-orange-600 transition-colors flex items-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            Nova Receita
          </button>
        </div>

        {/* Grid de Receitas/Fichas */}
        <div className="flex-1 overflow-y-auto p-6 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredReceitas.map(receita => {
              const ficha = fichas.find(f => f.receitaId === receita.id);
              return (
                <ReceitaCard 
                  key={receita.id} 
                  receita={receita} 
                  ficha={ficha}
                  onClick={() => setSelectedReceitaId(receita.id)}
                  selected={selectedReceitaId === receita.id}
                  viewMode={activeTab}
                />
              );
            })}
          </div>
        </div>
      </main>

      {/* Right Panel - Ficha Details */}
      <aside className="w-[450px] bg-white shrink-0 flex flex-col h-full border-l border-black/5">
        {selectedReceitaId ? (
          <FichaTecnicaPanel 
            receitaId={selectedReceitaId} 
            onClose={() => setSelectedReceitaId(null)} 
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-brand-light">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 opacity-50" />
            </div>
            <p>Selecione uma receita para ver a ficha técnica detalhada, custos por canal e margens de lucro.</p>
          </div>
        )}
      </aside>

      {/* Modals */}
      {showNovaReceitaModal && (
        <NovaReceitaModal onClose={() => setShowNovaReceitaModal(false)} />
      )}
    </div>
  );
}
