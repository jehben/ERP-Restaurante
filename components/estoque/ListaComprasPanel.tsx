import { useState } from 'react';
import { ShoppingCart, Calendar, CheckCircle2, AlertTriangle, TrendingDown, Info, Download, Share2 } from 'lucide-react';
import { mockListaCompras } from '@/lib/mock-data';
import { ListaCompras, FornecedorLista, ItemListaCompras } from '@/lib/types';

export default function ListaComprasPanel() {
  const [lista, setLista] = useState<ListaCompras>(mockListaCompras[0]);

  const getUrgenciaConfig = (urgencia: ItemListaCompras['urgencia']) => {
    switch (urgencia) {
      case 'critico': return { color: 'text-brand-red', icon: AlertTriangle, label: 'Crítico' };
      case 'baixo': return { color: 'text-brand-orange', icon: TrendingDown, label: 'Baixo' };
      case 'atencao': return { color: 'text-yellow-500', icon: Info, label: 'Atenção' };
      case 'ok': return { color: 'text-brand-green', icon: CheckCircle2, label: 'OK' };
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
      <header className="px-6 py-4 border-b border-black/5 flex items-center justify-between bg-gray-50 shrink-0">
        <div>
          <h2 className="font-bold text-brand-dark text-lg flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-brand-orange" />
            Lista de Compras
          </h2>
          <p className="text-xs text-brand-light flex items-center gap-1 mt-1">
            <Calendar className="w-3 h-3" />
            Semana {lista.semana}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right mr-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-brand-light">Total Estimado</p>
            <p className="font-mono font-bold text-brand-dark text-lg">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(lista.totalEstimado)}
            </p>
          </div>
          <button className="p-2 text-brand-light hover:text-brand-dark hover:bg-gray-200 rounded-full transition-colors" title="Exportar PDF">
            <Download className="w-4 h-4" />
          </button>
          <button className="p-2 text-brand-light hover:text-brand-dark hover:bg-gray-200 rounded-full transition-colors" title="Compartilhar">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
        {lista.fornecedores.map((fornecedor, index) => (
          <div key={index} className="bg-white border border-black/5 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-orange-50/50 px-4 py-3 border-b border-orange-100 flex items-center justify-between">
              <h3 className="font-bold text-brand-dark text-sm">{fornecedor.nome}</h3>
              <span className="font-mono font-bold text-brand-orange text-sm">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(fornecedor.totalEstimado)}
              </span>
            </div>
            <div className="divide-y divide-black/5">
              {fornecedor.itens.map((item, itemIndex) => {
                const urgenciaConfig = getUrgenciaConfig(item.urgencia);
                const UrgenciaIcon = urgenciaConfig.icon;
                
                return (
                  <div key={itemIndex} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`mt-0.5 ${urgenciaConfig.color}`} title={urgenciaConfig.label}>
                        <UrgenciaIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-brand-dark text-sm">{item.nome}</h4>
                        <div className="flex items-center gap-3 mt-1 text-xs text-brand-light">
                          <span className="font-mono">{item.qtdSugerida} {item.unidade}</span>
                          <span>•</span>
                          <span className="font-mono">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.custoEstimado)}</span>
                          {item.diasParaEsgotar && (
                            <>
                              <span>•</span>
                              <span className={item.diasParaEsgotar <= 3 ? 'text-brand-red font-bold' : ''}>
                                Esgota em ~{item.diasParaEsgotar} dias
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <button className="px-3 py-1.5 text-xs font-bold text-brand-light border border-black/10 rounded-lg hover:border-brand-orange hover:text-brand-orange transition-colors">
                        Editar Qtd
                      </button>
                      <button className="p-1.5 text-brand-light hover:text-brand-green hover:bg-green-50 rounded-full transition-colors" title="Marcar como comprado">
                        <CheckCircle2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
