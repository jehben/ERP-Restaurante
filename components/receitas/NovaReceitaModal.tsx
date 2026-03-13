import { useState } from 'react';
import { X, Check, Search, Plus, Trash2 } from 'lucide-react';
import { mockInsumos } from '@/lib/mock-data';
import { IngredienteReceita } from '@/lib/types';

interface NovaReceitaModalProps {
  onClose: () => void;
}

export default function NovaReceitaModal({ onClose }: NovaReceitaModalProps) {
  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState('Hambúrgueres');
  const [rendimento, setRendimento] = useState(1);
  const [tempoPreparo, setTempoPreparo] = useState(10);
  const [modoPreparo, setModoPreparo] = useState('');
  
  const [ingredientes, setIngredientes] = useState<IngredienteReceita[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredInsumos = mockInsumos.filter(i => i.nome.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleAddIngrediente = (insumoId: string) => {
    if (!ingredientes.find(i => i.insumoId === insumoId)) {
      setIngredientes([...ingredientes, { insumoId, quantidade: 1 }]);
    }
    setSearchTerm('');
  };

  const handleRemoveIngrediente = (insumoId: string) => {
    setIngredientes(ingredientes.filter(i => i.insumoId !== insumoId));
  };

  const handleQtdChange = (insumoId: string, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setIngredientes(ingredientes.map(i => i.insumoId === insumoId ? { ...i, quantidade: numValue } : i));
    }
  };

  const handleSave = () => {
    console.log('Salvando receita:', { nome, categoria, rendimento, tempoPreparo, ingredientes, modoPreparo });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden">
        <header className="px-6 py-4 border-b border-black/5 flex items-center justify-between bg-gray-50 shrink-0">
          <div>
            <h2 className="font-bold text-brand-dark text-lg">Nova Receita</h2>
            <p className="text-xs text-brand-light">Crie uma nova receita para gerar a ficha técnica</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X className="w-4 h-4 text-brand-dark" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 flex gap-8">
          {/* Coluna Esquerda: Dados Básicos */}
          <div className="flex-1 flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold text-brand-dark mb-1">Nome da Receita</label>
              <input 
                type="text" 
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Classic Burger"
                className="w-full px-4 py-2 bg-gray-50 border border-black/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-brand-dark mb-1">Categoria</label>
                <select 
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 border border-black/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/50"
                >
                  <option value="Hambúrgueres">Hambúrgueres</option>
                  <option value="Porções">Porções</option>
                  <option value="Bebidas">Bebidas</option>
                  <option value="Sobremesas">Sobremesas</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-brand-dark mb-1">Rendimento (porções)</label>
                <input 
                  type="number" 
                  value={rendimento}
                  onChange={(e) => setRendimento(parseInt(e.target.value))}
                  className="w-full px-4 py-2 bg-gray-50 border border-black/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-dark mb-1">Tempo de Preparo (min)</label>
              <input 
                type="number" 
                value={tempoPreparo}
                onChange={(e) => setTempoPreparo(parseInt(e.target.value))}
                className="w-full px-4 py-2 bg-gray-50 border border-black/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/50"
              />
            </div>

            <div className="flex-1 flex flex-col">
              <label className="block text-xs font-bold text-brand-dark mb-1">Modo de Preparo</label>
              <textarea 
                value={modoPreparo}
                onChange={(e) => setModoPreparo(e.target.value)}
                placeholder="Descreva o passo a passo..."
                className="w-full flex-1 px-4 py-2 bg-gray-50 border border-black/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/50 resize-none"
              />
            </div>
          </div>

          {/* Coluna Direita: Ingredientes */}
          <div className="flex-1 flex flex-col border-l border-black/5 pl-8">
            <h3 className="text-sm font-bold text-brand-dark mb-3">Ingredientes</h3>
            
            <div className="relative mb-4">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-brand-light" />
              <input 
                type="text" 
                placeholder="Buscar insumo para adicionar..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-black/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/50"
              />
              
              {/* Dropdown de busca */}
              {searchTerm && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-black/10 rounded-xl shadow-lg max-h-48 overflow-y-auto z-10">
                  {filteredInsumos.map(insumo => (
                    <button
                      key={insumo.id}
                      onClick={() => handleAddIngrediente(insumo.id)}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center justify-between"
                    >
                      <span>{insumo.nome}</span>
                      <span className="text-xs text-brand-light">{insumo.unidadeBase}</span>
                    </button>
                  ))}
                  {filteredInsumos.length === 0 && (
                    <div className="px-4 py-2 text-sm text-brand-light text-center">Nenhum insumo encontrado.</div>
                  )}
                </div>
              )}
            </div>

            {/* Lista de Ingredientes Adicionados */}
            <div className="flex-1 overflow-y-auto bg-gray-50 rounded-xl border border-black/5 p-2 space-y-2">
              {ingredientes.map(ing => {
                const insumo = mockInsumos.find(i => i.id === ing.insumoId);
                if (!insumo) return null;
                
                return (
                  <div key={ing.insumoId} className="bg-white p-3 rounded-lg border border-black/5 flex items-center justify-between shadow-sm">
                    <div className="flex-1">
                      <p className="font-bold text-brand-dark text-sm">{insumo.nome}</p>
                      <p className="text-[10px] text-brand-light">Custo: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(insumo.custoAtual)}/{insumo.unidadeBase}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <input 
                          type="number"
                          step="0.01"
                          value={ing.quantidade}
                          onChange={(e) => handleQtdChange(ing.insumoId, e.target.value)}
                          className="w-20 px-2 py-1 bg-gray-50 border border-black/10 rounded-md text-sm font-mono text-right focus:outline-none focus:ring-2 focus:ring-brand-orange/50"
                        />
                        <span className="text-xs font-bold text-brand-light w-6">{insumo.unidadeBase}</span>
                      </div>
                      <button 
                        onClick={() => handleRemoveIngrediente(ing.insumoId)}
                        className="p-1.5 text-brand-light hover:text-brand-red hover:bg-red-50 rounded-md transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
              
              {ingredientes.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-brand-light opacity-50">
                  <Plus className="w-8 h-8 mb-2" />
                  <p className="text-sm">Adicione ingredientes à receita</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <footer className="px-6 py-4 border-t border-black/5 bg-gray-50 flex justify-between items-center shrink-0">
          <div className="text-sm text-brand-light">
            <span className="font-bold text-brand-dark">{ingredientes.length}</span> ingredientes
          </div>
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="px-4 py-2 text-sm font-bold text-brand-light hover:text-brand-dark transition-colors"
            >
              Cancelar
            </button>
            <button 
              onClick={handleSave}
              disabled={!nome || ingredientes.length === 0}
              className="px-6 py-2 bg-brand-orange text-white text-sm font-bold pill shadow-orange hover:bg-orange-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check className="w-4 h-4" />
              Salvar Receita
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
