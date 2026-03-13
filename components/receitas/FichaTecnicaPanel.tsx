import { useState } from 'react';
import { X, ChefHat, FileText, TrendingDown, AlertTriangle, CheckCircle2, Info, DollarSign, Package, Percent } from 'lucide-react';
import { mockReceitas, mockFichasTecnicas, mockInsumos } from '@/lib/mock-data';
import { CanalVenda } from '@/lib/types';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface FichaTecnicaPanelProps {
  receitaId: string;
  onClose: () => void;
}

export default function FichaTecnicaPanel({ receitaId, onClose }: FichaTecnicaPanelProps) {
  const receita = mockReceitas.find(r => r.id === receitaId);
  const ficha = mockFichasTecnicas.find(f => f.receitaId === receitaId);
  
  const [selectedCanal, setSelectedCanal] = useState<CanalVenda>('Salão');

  if (!receita) return null;

  const canalData = ficha?.canais.find((c: any) => c.canal === selectedCanal) || ficha?.canais[0];

  const getCmvColor = (cmv: number) => {
    if (cmv < 30) return 'text-brand-green';
    if (cmv <= 35) return 'text-yellow-500';
    return 'text-brand-red';
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <header className="px-6 py-4 border-b border-black/5 flex items-center justify-between bg-gray-50 shrink-0">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-light">{receita.categoria}</span>
          <h2 className="font-bold text-brand-dark text-lg leading-tight">{receita.nome}</h2>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
          <X className="w-4 h-4 text-brand-dark" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
        
        {/* Imagem */}
        {receita.fotoUrl && (
          <div className="h-48 rounded-xl overflow-hidden relative border border-black/5 shrink-0">
            <Image src={receita.fotoUrl} alt={receita.nome} fill className="object-cover" referrerPolicy="no-referrer" />
          </div>
        )}

        {/* Canais de Venda Tabs */}
        {ficha && (
          <div>
            <h3 className="text-sm font-bold text-brand-dark mb-3">Canal de Venda</h3>
            <div className="flex gap-2 bg-gray-50 p-1 rounded-xl border border-black/5">
              {ficha.canais.map((c: any) => (
                <button
                  key={c.canal}
                  onClick={() => setSelectedCanal(c.canal)}
                  className={cn(
                    "flex-1 py-2 text-xs font-bold rounded-lg transition-colors",
                    selectedCanal === c.canal ? "bg-white text-brand-orange shadow-sm ring-1 ring-black/5" : "text-brand-light hover:text-brand-dark"
                  )}
                >
                  {c.canal}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Resumo Financeiro do Canal */}
        {canalData && (
          <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100 flex flex-col gap-4">
            <div className="flex justify-between items-center pb-3 border-b border-orange-200/50">
              <span className="text-sm font-bold text-brand-dark">Preço de Venda</span>
              <span className="font-mono font-bold text-brand-orange text-xl">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(canalData.precoVenda)}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] text-brand-light uppercase tracking-wider font-bold mb-1">Custo Total</p>
                <p className="font-mono font-bold text-brand-dark text-lg">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(canalData.custoTotal)}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-brand-light uppercase tracking-wider font-bold mb-1">Lucro Bruto</p>
                <p className="font-mono font-bold text-brand-green text-lg">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(canalData.lucroBruto)}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-brand-light uppercase tracking-wider font-bold mb-1">CMV</p>
                <p className={cn("font-mono font-bold text-lg", getCmvColor(canalData.cmv))}>
                  {canalData.cmv.toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-[10px] text-brand-light uppercase tracking-wider font-bold mb-1">Margem</p>
                <p className="font-mono font-bold text-brand-dark text-lg">
                  {canalData.margemLucro.toFixed(1)}%
                </p>
              </div>
            </div>

            {canalData.taxaCanalPercentual > 0 && (
              <div className="flex justify-between items-center pt-3 border-t border-orange-200/50 text-xs text-brand-light">
                <span>Taxa do Canal ({canalData.taxaCanalPercentual}%)</span>
                <span className="font-mono text-brand-red">-{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(canalData.valorTaxa)}</span>
              </div>
            )}
          </div>
        )}

        {/* Ingredientes */}
        <div>
          <h3 className="text-sm font-bold text-brand-dark mb-3 flex items-center justify-between">
            <span>Ingredientes</span>
            {canalData && <span className="text-xs font-mono text-brand-light">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(canalData.custoIngredientes)}</span>}
          </h3>
          <div className="bg-white border border-black/5 rounded-xl overflow-hidden divide-y divide-black/5">
            {receita.ingredientes.map((ing: any, idx: number) => {
              const insumo = mockInsumos.find(i => i.id === ing.insumoId);
              if (!insumo) return null;
              
              const custoItem = insumo.custoAtual * ing.quantidade;
              
              return (
                <div key={idx} className="p-3 flex items-center justify-between text-sm hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="font-medium text-brand-dark">{insumo.nome}</p>
                    <p className="text-[10px] text-brand-light font-mono">{ing.quantidade} {insumo.unidadeBase} x {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(insumo.custoAtual)}</p>
                  </div>
                  <div className="font-mono font-bold text-brand-dark">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(custoItem)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Embalagens */}
        {canalData && canalData.embalagens.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-brand-dark mb-3 flex items-center justify-between">
              <span>Embalagens ({canalData.canal})</span>
              <span className="text-xs font-mono text-brand-light">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(canalData.custoEmbalagens)}</span>
            </h3>
            <div className="bg-white border border-black/5 rounded-xl overflow-hidden divide-y divide-black/5">
              {canalData.embalagens.map((emb: any, idx: number) => {
                const insumo = mockInsumos.find(i => i.id === emb.insumoId);
                if (!insumo) return null;
                
                const custoItem = insumo.custoAtual * emb.quantidade;
                
                return (
                  <div key={idx} className="p-3 flex items-center justify-between text-sm hover:bg-gray-50 transition-colors">
                    <div>
                      <p className="font-medium text-brand-dark">{insumo.nome}</p>
                      <p className="text-[10px] text-brand-light font-mono">{emb.quantidade} {insumo.unidadeBase}</p>
                    </div>
                    <div className="font-mono font-bold text-brand-dark">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(custoItem)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Modo de Preparo */}
        {receita.modoPreparo && (
          <div>
            <h3 className="text-sm font-bold text-brand-dark mb-3">Modo de Preparo</h3>
            <div className="bg-gray-50 p-4 rounded-xl border border-black/5 text-sm text-brand-dark whitespace-pre-line leading-relaxed">
              {receita.modoPreparo}
            </div>
          </div>
        )}

        {/* Insights */}
        {ficha && ficha.insights && ficha.insights.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-brand-dark mb-3 flex items-center gap-2">
              <Info className="w-4 h-4 text-brand-orange" />
              Insights da IA
            </h3>
            <div className="flex flex-col gap-3">
              {ficha.insights.map((insight: any) => (
                <div key={insight.id} className="bg-white border border-black/5 p-4 rounded-xl shadow-sm flex gap-3 items-start">
                  <div className={cn("mt-0.5 shrink-0", insight.prioridade === 'alta' ? 'text-brand-red' : 'text-brand-orange')}>
                    {insight.icone === 'AlertTriangle' ? <AlertTriangle className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-brand-dark mb-1">{insight.titulo}</h4>
                    <p className="text-xs text-brand-light leading-relaxed">{insight.texto}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
