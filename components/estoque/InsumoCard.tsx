import { Insumo } from '@/lib/types';
import { AlertTriangle, TrendingDown, CheckCircle2, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InsumoCardProps {
  insumo: Insumo;
  onClick: () => void;
  selected?: boolean;
}

export default function InsumoCard({ insumo, onClick, selected }: InsumoCardProps) {
  const getStatusConfig = (status: Insumo['statusEstoque']) => {
    switch (status) {
      case 'critico': return { color: 'bg-brand-red text-white', icon: AlertTriangle, label: 'Crítico' };
      case 'baixo': return { color: 'bg-brand-orange text-white', icon: TrendingDown, label: 'Baixo' };
      case 'atencao': return { color: 'bg-yellow-400 text-brand-dark', icon: Info, label: 'Atenção' };
      case 'ok': return { color: 'bg-brand-green text-white', icon: CheckCircle2, label: 'OK' };
    }
  };

  const statusConfig = getStatusConfig(insumo.statusEstoque);
  const StatusIcon = statusConfig.icon;

  const percentualEstoque = Math.min(100, Math.max(0, (insumo.estoqueAtual / (insumo.estoqueMinimo * 3)) * 100));
  
  const getBarColor = () => {
    if (insumo.estoqueAtual < insumo.estoqueMinimo) return 'bg-brand-red';
    if (insumo.estoqueAtual <= insumo.estoqueMinimo * 2) return 'bg-brand-orange';
    return 'bg-brand-green';
  };

  return (
    <div 
      onClick={onClick}
      className={cn(
        "bg-white rounded-2xl p-4 border transition-all cursor-pointer hover:shadow-md flex flex-col gap-3",
        selected ? "border-brand-orange shadow-md ring-1 ring-brand-orange" : "border-black/5 shadow-sm"
      )}
    >
      <div className="flex justify-between items-start">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-light">{insumo.categoria}</span>
          <h3 className="font-bold text-brand-dark text-sm leading-tight mt-0.5 line-clamp-2" title={insumo.nome}>{insumo.nome}</h3>
        </div>
        <div className={cn("px-2 py-1 rounded-full flex items-center gap-1 text-[10px] font-bold shrink-0", statusConfig.color)}>
          <StatusIcon className="w-3 h-3" />
          {statusConfig.label}
        </div>
      </div>

      <div className="flex items-end justify-between mt-auto">
        <div>
          <p className="text-xs text-brand-light mb-0.5">Estoque Atual</p>
          <p className="font-mono font-bold text-brand-dark text-lg">
            {insumo.estoqueAtual.toLocaleString('pt-BR')} <span className="text-xs font-sans text-brand-light">{insumo.unidadeBase}</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-brand-light mb-0.5">Custo Atual</p>
          <p className="font-mono font-medium text-brand-orange text-sm">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(insumo.custoAtual)}
            <span className="text-[10px] font-sans text-brand-light ml-0.5">/{insumo.unidadeBase}</span>
          </p>
        </div>
      </div>

      <div className="mt-1">
        <div className="flex justify-between text-[10px] text-brand-light mb-1">
          <span>Mín: {insumo.estoqueMinimo}{insumo.unidadeBase}</span>
          {insumo.diasParaEsgotar && <span>~{insumo.diasParaEsgotar} dias</span>}
        </div>
        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
          <div 
            className={cn("h-full rounded-full transition-all duration-500", getBarColor())} 
            style={{ width: `${percentualEstoque}%` }}
          />
        </div>
      </div>
    </div>
  );
}
