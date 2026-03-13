import { Receita, FichaTecnica } from '@/lib/types';
import { ChefHat, FileText, TrendingDown, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface ReceitaCardProps {
  receita: Receita;
  ficha?: FichaTecnica;
  onClick: () => void;
  selected?: boolean;
  viewMode: 'fichas' | 'receitas' | 'insights';
}

export default function ReceitaCard({ receita, ficha, onClick, selected, viewMode }: ReceitaCardProps) {
  // Pegar o canal principal (Salão) ou o primeiro disponível para mostrar no card
  const canalPrincipal = ficha?.canais.find(c => c.canal === 'Salão') || ficha?.canais[0];

  const getCmvStatus = (cmv: number) => {
    if (cmv < 30) return { color: 'text-brand-green', bg: 'bg-green-50', icon: CheckCircle2 };
    if (cmv <= 35) return { color: 'text-yellow-500', bg: 'bg-yellow-50', icon: AlertTriangle };
    return { color: 'text-brand-red', bg: 'bg-red-50', icon: TrendingDown };
  };

  const cmvStatus = canalPrincipal ? getCmvStatus(canalPrincipal.cmv) : null;

  return (
    <div 
      onClick={onClick}
      className={cn(
        "bg-white rounded-2xl border transition-all cursor-pointer hover:shadow-md flex flex-col overflow-hidden",
        selected ? "border-brand-orange shadow-md ring-1 ring-brand-orange" : "border-black/5 shadow-sm"
      )}
    >
      {/* Imagem (opcional) */}
      <div className="h-32 bg-gray-100 relative w-full border-b border-black/5">
        {receita.fotoUrl ? (
          <Image src={receita.fotoUrl} alt={receita.nome} fill className="object-cover" referrerPolicy="no-referrer" />
        ) : (
          <div className="flex items-center justify-center h-full text-brand-light">
            <ChefHat className="w-8 h-8 opacity-20" />
          </div>
        )}
        <div className="absolute top-2 left-2 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-md text-[10px] font-bold uppercase tracking-wider text-brand-dark">
          {receita.categoria}
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-brand-dark text-sm leading-tight mb-1 line-clamp-2" title={receita.nome}>{receita.nome}</h3>
        
        {viewMode === 'fichas' && canalPrincipal ? (
          <div className="mt-auto pt-3 flex flex-col gap-2">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[10px] text-brand-light mb-0.5">Custo Total</p>
                <p className="font-mono font-bold text-brand-dark text-sm">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(canalPrincipal.custoTotal)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-brand-light mb-0.5">Preço Venda ({canalPrincipal.canal})</p>
                <p className="font-mono font-bold text-brand-orange text-sm">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(canalPrincipal.precoVenda)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-1 pt-2 border-t border-black/5">
              <div className="flex items-center gap-1 text-[10px] text-brand-light">
                <span className="font-bold text-brand-dark">Margem:</span> {canalPrincipal.margemLucro.toFixed(1)}%
              </div>
              {cmvStatus && (
                <div className={cn("flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-md", cmvStatus.bg, cmvStatus.color)}>
                  <cmvStatus.icon className="w-3 h-3" />
                  CMV: {canalPrincipal.cmv.toFixed(1)}%
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="mt-auto pt-3 flex flex-col gap-2 text-xs text-brand-light">
            <div className="flex items-center justify-between">
              <span>Ingredientes:</span>
              <span className="font-bold text-brand-dark">{receita.ingredientes.length} itens</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Tempo de Preparo:</span>
              <span className="font-bold text-brand-dark">{receita.tempoPreparoMinutos} min</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Rendimento:</span>
              <span className="font-bold text-brand-dark">{receita.rendimento} porção</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
