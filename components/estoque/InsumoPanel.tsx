import { Insumo, ContagemEstoque } from '@/lib/types';
import { mockInsumos, mockContagens } from '@/lib/mock-data';
import { X, TrendingDown, TrendingUp, AlertTriangle, Info, Calendar, Package, DollarSign, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface InsumoPanelProps {
  insumoId: string;
  onClose: () => void;
}

export default function InsumoPanel({ insumoId, onClose }: InsumoPanelProps) {
  const insumo = mockInsumos.find(i => i.id === insumoId);
  
  if (!insumo) return null;

  const contagensInsumo = mockContagens.flatMap(c => 
    c.itens.filter(i => i.insumoId === insumoId).map(i => ({
      data: c.dataContagem,
      responsavel: c.responsavel,
      ...i
    }))
  ).sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

  // Mock data for price history chart
  const priceHistory = [
    { name: 'Jan', price: insumo.custoAtual * 0.9 },
    { name: 'Fev', price: insumo.custoAtual * 0.95 },
    { name: 'Mar', price: insumo.custoAtual },
  ];

  return (
    <div className="flex flex-col h-full bg-white">
      <header className="px-6 py-4 border-b border-black/5 flex items-center justify-between bg-gray-50 shrink-0">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-light">{insumo.categoria}</span>
          <h2 className="font-bold text-brand-dark text-lg leading-tight">{insumo.nome}</h2>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
          <X className="w-4 h-4 text-brand-dark" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
        
        {/* Resumo */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-xl border border-black/5">
            <div className="flex items-center gap-2 text-brand-light mb-2">
              <Package className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Estoque</span>
            </div>
            <p className="font-mono font-bold text-brand-dark text-2xl">
              {insumo.estoqueAtual.toLocaleString('pt-BR')} <span className="text-sm font-sans text-brand-light">{insumo.unidadeBase}</span>
            </p>
            <p className="text-[10px] text-brand-light mt-1">Mínimo: {insumo.estoqueMinimo}{insumo.unidadeBase}</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-xl border border-black/5">
            <div className="flex items-center gap-2 text-brand-light mb-2">
              <DollarSign className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Custo Atual</span>
            </div>
            <p className="font-mono font-bold text-brand-orange text-2xl">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(insumo.custoAtual)}
            </p>
            <p className="text-[10px] text-brand-light mt-1">por {insumo.unidadeBase}</p>
          </div>
        </div>

        {/* Inteligência de Reposição */}
        <div>
          <h3 className="text-sm font-bold text-brand-dark mb-3 flex items-center gap-2">
            <Info className="w-4 h-4 text-brand-orange" />
            Inteligência de Reposição
          </h3>
          <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100 flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-brand-dark">Consumo Médio Diário</span>
              <span className="font-mono font-bold text-brand-dark">{insumo.consumoMedioDiario} {insumo.unidadeBase}/dia</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-brand-dark">Frequência de Compra</span>
              <span className="font-mono font-bold text-brand-dark">A cada {insumo.frequenciaMediaCompra} dias</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-brand-dark">Ponto de Pedido</span>
              <span className="font-mono font-bold text-brand-dark">{insumo.pontoRePedido} {insumo.unidadeBase}</span>
            </div>
            {insumo.diasParaEsgotar && (
              <div className="flex justify-between items-center pt-3 border-t border-orange-200/50">
                <span className="text-xs font-bold text-brand-dark">Tempo Estimado</span>
                <span className={`font-mono font-bold ${insumo.diasParaEsgotar <= 3 ? 'text-brand-red' : 'text-brand-orange'}`}>
                  ~{insumo.diasParaEsgotar} dias para esgotar
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Informações do Fornecedor */}
        <div>
          <h3 className="text-sm font-bold text-brand-dark mb-3">Fornecimento</h3>
          <div className="bg-gray-50 p-4 rounded-xl border border-black/5 text-sm">
            <div className="mb-2">
              <span className="text-brand-light text-xs block mb-0.5">Fornecedor Principal</span>
              <span className="font-medium text-brand-dark">{insumo.fornecedorPrincipal}</span>
            </div>
            <div>
              <span className="text-brand-light text-xs block mb-0.5">Embalagem Padrão</span>
              <span className="font-medium text-brand-dark">{insumo.embalagemPadrao}</span>
            </div>
          </div>
        </div>

        {/* Histórico de Preços */}
        <div>
          <h3 className="text-sm font-bold text-brand-dark mb-3">Evolução do Custo</h3>
          <div className="h-40 bg-white border border-black/5 rounded-xl p-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={priceHistory}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} dx={-10} tickFormatter={(value) => `R$ ${value}`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#111827', fontSize: '12px', fontWeight: 'bold' }}
                  labelStyle={{ color: '#6B7280', fontSize: '10px', marginBottom: '4px' }}
                  formatter={(value: any) => [new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value), 'Custo']}
                />
                <Line type="monotone" dataKey="price" stroke="#F97316" strokeWidth={2} dot={{ r: 4, fill: '#F97316', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Últimas Contagens */}
        <div>
          <h3 className="text-sm font-bold text-brand-dark mb-3 flex items-center justify-between">
            <span>Últimas Contagens</span>
          </h3>
          <div className="flex flex-col gap-2">
            {contagensInsumo.length > 0 ? (
              contagensInsumo.map(contagem => (
                <div key={contagem.id} className="bg-white border border-black/5 rounded-xl p-3 text-sm flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-3 h-3 text-brand-light" />
                      <span className="text-xs text-brand-dark font-medium">
                        {new Date(contagem.data).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <span className="text-[10px] text-brand-light">{contagem.responsavel}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-brand-dark">
                      {contagem.qtdAtual} <span className="text-[10px] font-sans text-brand-light">{insumo.unidadeBase}</span>
                    </div>
                    <div className={`text-xs font-medium flex items-center justify-end gap-1 ${contagem.diferenca > 0 ? 'text-brand-green' : contagem.diferenca < 0 ? 'text-brand-red' : 'text-brand-light'}`}>
                      {contagem.diferenca > 0 ? <TrendingUp className="w-3 h-3" /> : contagem.diferenca < 0 ? <TrendingDown className="w-3 h-3" /> : null}
                      {contagem.diferenca > 0 ? '+' : ''}{contagem.diferenca}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-brand-light text-center py-4 bg-gray-50 rounded-xl border border-black/5">Nenhuma contagem registrada.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
