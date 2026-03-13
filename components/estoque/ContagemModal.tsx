import { useState } from 'react';
import { X, Check, Search, Package } from 'lucide-react';
import { Insumo, ItemContagem } from '@/lib/types';

interface ContagemModalProps {
  onClose: () => void;
  insumos: Insumo[];
}

export default function ContagemModal({ onClose, insumos }: ContagemModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [contagens, setContagens] = useState<Record<string, number>>({});
  
  const filteredInsumos = insumos.filter(i => i.nome.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleContagemChange = (insumoId: string, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setContagens(prev => ({ ...prev, [insumoId]: numValue }));
    } else {
      const newContagens = { ...contagens };
      delete newContagens[insumoId];
      setContagens(newContagens);
    }
  };

  const handleSave = () => {
    // Aqui seria a lógica para salvar a contagem no backend
    console.log('Salvando contagem:', contagens);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl h-[80vh] flex flex-col overflow-hidden">
        <header className="px-6 py-4 border-b border-black/5 flex items-center justify-between bg-gray-50 shrink-0">
          <div>
            <h2 className="font-bold text-brand-dark text-lg">Nova Contagem de Estoque</h2>
            <p className="text-xs text-brand-light">Registre a quantidade física atual dos insumos</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X className="w-4 h-4 text-brand-dark" />
          </button>
        </header>
        
        <div className="p-4 border-b border-black/5 bg-white shrink-0">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-brand-light" />
            <input 
              type="text" 
              placeholder="Buscar insumo para contar..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-black/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/50"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {filteredInsumos.map(insumo => {
              const qtdAtual = contagens[insumo.id] !== undefined ? contagens[insumo.id] : '';
              const diferenca = contagens[insumo.id] !== undefined ? contagens[insumo.id] - insumo.estoqueAtual : null;
              
              return (
                <div key={insumo.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-black/5 hover:border-brand-orange/30 transition-colors">
                  <div className="flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-light">{insumo.categoria}</span>
                    <h3 className="font-bold text-brand-dark text-sm">{insumo.nome}</h3>
                    <p className="text-xs text-brand-light mt-1">Estoque anterior: {insumo.estoqueAtual} {insumo.unidadeBase}</p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-2">
                        <input 
                          type="number"
                          step="0.01"
                          value={qtdAtual}
                          onChange={(e) => handleContagemChange(insumo.id, e.target.value)}
                          placeholder="Qtd Atual"
                          className="w-24 px-3 py-2 bg-white border border-black/10 rounded-lg text-sm font-mono text-right focus:outline-none focus:ring-2 focus:ring-brand-orange/50"
                        />
                        <span className="text-xs font-bold text-brand-light w-6">{insumo.unidadeBase}</span>
                      </div>
                      {diferenca !== null && (
                        <span className={`text-[10px] font-bold mt-1 ${diferenca > 0 ? 'text-brand-green' : diferenca < 0 ? 'text-brand-red' : 'text-brand-light'}`}>
                          {diferenca > 0 ? '+' : ''}{diferenca.toFixed(2)} {insumo.unidadeBase}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {filteredInsumos.length === 0 && (
              <div className="text-center py-12 text-brand-light">
                <Package className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>Nenhum insumo encontrado com esse nome.</p>
              </div>
            )}
          </div>
        </div>

        <footer className="px-6 py-4 border-t border-black/5 bg-gray-50 flex justify-between items-center shrink-0">
          <div className="text-sm text-brand-light">
            <span className="font-bold text-brand-dark">{Object.keys(contagens).length}</span> itens contados
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
              disabled={Object.keys(contagens).length === 0}
              className="px-6 py-2 bg-brand-orange text-white text-sm font-bold pill shadow-orange hover:bg-orange-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check className="w-4 h-4" />
              Salvar Contagem
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
