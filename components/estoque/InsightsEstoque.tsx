import { AlertTriangle, TrendingDown, Info, Lightbulb, CheckCircle2 } from 'lucide-react';
import { mockInsightsEstoque } from '@/lib/mock-data';
import { InsightEstoque } from '@/lib/types';

export default function InsightsEstoque() {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'AlertTriangle': return AlertTriangle;
      case 'TrendingDown': return TrendingDown;
      case 'Info': return Info;
      case 'Lightbulb': return Lightbulb;
      case 'CheckCircle2': return CheckCircle2;
      default: return Info;
    }
  };

  const getPriorityColor = (prioridade: InsightEstoque['prioridade']) => {
    switch (prioridade) {
      case 'alta': return 'text-brand-red bg-red-50 border-red-100';
      case 'media': return 'text-brand-orange bg-orange-50 border-orange-100';
      case 'info': return 'text-blue-600 bg-blue-50 border-blue-100';
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
      <header className="px-6 py-4 border-b border-black/5 flex items-center justify-between bg-gray-50 shrink-0">
        <div>
          <h2 className="font-bold text-brand-dark text-lg flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-brand-orange" />
            Insights de Estoque
          </h2>
          <p className="text-xs text-brand-light mt-1">
            Análises automáticas baseadas no seu histórico de consumo e compras
          </p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
        {mockInsightsEstoque.map((insight) => {
          const Icon = getIcon(insight.icone);
          const colorClass = getPriorityColor(insight.prioridade);

          return (
            <div 
              key={insight.id} 
              className={`p-4 rounded-xl border flex items-start gap-4 transition-all hover:shadow-md ${colorClass}`}
            >
              <div className="mt-1 shrink-0">
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-sm mb-1">{insight.titulo}</h3>
                <p className="text-sm opacity-90 leading-relaxed">{insight.texto}</p>
                {insight.insumoId && (
                  <button className="mt-3 px-3 py-1.5 bg-white/50 hover:bg-white/80 border border-black/5 rounded-lg text-xs font-bold transition-colors">
                    Ver Insumo
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {mockInsightsEstoque.length === 0 && (
          <div className="text-center py-12 text-brand-light">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>Tudo certo! Não há anomalias ou alertas no momento.</p>
          </div>
        )}
      </div>
    </div>
  );
}
