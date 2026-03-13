'use client';

import { useState } from 'react';
import { Search, Filter, Plus, Package, ClipboardList, ShoppingCart, Lightbulb } from 'lucide-react';
import { Insumo, CategoriaInsumo } from '@/lib/types';
import { mockInsumos } from '@/lib/mock-data';
import InsumoCard from './InsumoCard';
import InsumoPanel from './InsumoPanel';
import ContagemModal from './ContagemModal';
import ListaComprasPanel from './ListaComprasPanel';
import InsightsEstoque from './InsightsEstoque';

export default function EstoqueModule() {
  const [insumos, setInsumos] = useState<Insumo[]>(mockInsumos);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState<CategoriaInsumo | 'Todas'>('Todas');
  const [selectedInsumoId, setSelectedInsumoId] = useState<string | null>(null);
  const [showContagemModal, setShowContagemModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'estoque' | 'compras' | 'insights'>('estoque');

  const filteredInsumos = insumos.filter(insumo => {
    const matchSearch = insumo.nome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategoria = selectedCategoria === 'Todas' || insumo.categoria === selectedCategoria;
    return matchSearch && matchCategoria;
  });

  const categorias: (CategoriaInsumo | 'Todas')[] = ['Todas', 'Carnes', 'Frios & Laticínios', 'Pães & Massas', 'Vegetais', 'Molhos & Condimentos', 'Bebidas', 'Descartáveis', 'Outros'];

  return (
    <div className="flex-1 flex h-full overflow-hidden bg-gray-50">
      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden border-r border-black/5">
        {/* Tabs */}
        <div className="bg-white border-b border-black/5 px-6 py-2 flex gap-6 shrink-0">
          <button 
            onClick={() => setActiveTab('estoque')}
            className={`pb-2 text-sm font-bold border-b-2 transition-colors ${activeTab === 'estoque' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-brand-light hover:text-brand-dark'}`}
          >
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Estoque Atual
            </div>
          </button>
          <button 
            onClick={() => setActiveTab('compras')}
            className={`pb-2 text-sm font-bold border-b-2 transition-colors ${activeTab === 'compras' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-brand-light hover:text-brand-dark'}`}
          >
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              Lista de Compras
            </div>
          </button>
          <button 
            onClick={() => setActiveTab('insights')}
            className={`pb-2 text-sm font-bold border-b-2 transition-colors ${activeTab === 'insights' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-brand-light hover:text-brand-dark'}`}
          >
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Insights
            </div>
          </button>
        </div>

        {activeTab === 'estoque' && (
          <>
            {/* Toolbar */}
            <div className="p-6 pb-4 shrink-0 flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="relative w-64">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-brand-light" />
                  <input 
                    type="text" 
                    placeholder="Buscar insumo..." 
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
                onClick={() => setShowContagemModal(true)}
                className="ml-4 px-4 py-2 bg-brand-orange text-white text-sm font-bold pill shadow-orange hover:bg-orange-600 transition-colors flex items-center gap-2 shrink-0"
              >
                <ClipboardList className="w-4 h-4" />
                Nova Contagem
              </button>
            </div>

            {/* Grid de Insumos */}
            <div className="flex-1 overflow-y-auto p-6 pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredInsumos.map(insumo => (
                  <InsumoCard 
                    key={insumo.id} 
                    insumo={insumo} 
                    onClick={() => setSelectedInsumoId(insumo.id)}
                    selected={selectedInsumoId === insumo.id}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'compras' && (
          <div className="flex-1 overflow-y-auto p-6">
            <ListaComprasPanel />
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="flex-1 overflow-y-auto p-6">
            <InsightsEstoque />
          </div>
        )}
      </main>

      {/* Right Panel - Insumo Details */}
      {activeTab === 'estoque' && (
        <aside className="w-96 bg-white shrink-0 flex flex-col h-full border-l border-black/5">
          {selectedInsumoId ? (
            <InsumoPanel insumoId={selectedInsumoId} onClose={() => setSelectedInsumoId(null)} />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-brand-light">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Package className="w-8 h-8 opacity-50" />
              </div>
              <p>Selecione um insumo para ver os detalhes, histórico de preços e contagens.</p>
            </div>
          )}
        </aside>
      )}

      {/* Modals */}
      {showContagemModal && (
        <ContagemModal onClose={() => setShowContagemModal(false)} insumos={insumos} />
      )}
    </div>
  );
}
