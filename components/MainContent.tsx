import { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  AlertCircle,
  FileText,
  Mail,
  HardDrive,
  Trash2,
  ChevronRight,
  Search,
  Filter,
  Construction
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DocItem } from '@/lib/data';
import DateRangeFilter from '@/components/DateRangeFilter';

const kpis = [
  {
    title: 'Total a Pagar',
    value: 'R$ 12.450,00',
    trend: 'up',
    trendValue: '+2.5%',
    color: 'text-brand-red',
  },
  {
    title: 'Documentos Pendentes',
    value: '24',
    trend: 'down',
    trendValue: '-5',
    color: 'text-brand-green',
  },
  {
    title: 'Alertas de OCR',
    value: '3',
    trend: 'up',
    trendValue: '+1',
    color: 'text-brand-orange',
  },
];

interface MainContentProps {
  activeTab: string;
  inboxItems: DocItem[];
  selectedDocId: string | null;
  onSelectDoc: (id: string) => void;
  onDeleteDoc: (id: string) => void;
}

const monthMap: Record<string, string> = {
  'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04', 'May': '05', 'Jun': '06',
  'Jul': '07', 'Aug': '08', 'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
};

const parseInboxDate = (dateStr: string) => {
  const [day, month, year] = dateStr.split(' ');
  return `${year}-${monthMap[month]}-${day.padStart(2, '0')}`;
};

export default function MainContent({ activeTab, inboxItems, selectedDocId, onSelectDoc, onDeleteDoc }: MainContentProps) {
  const [startDate, setStartDate] = useState('2026-03-01');
  const [endDate, setEndDate] = useState('2026-03-31');
  const [searchTerm, setSearchTerm] = useState('');

  if (activeTab !== 'Caixa de Entrada') {
    return (
      <main className="flex-1 bg-white h-full flex flex-col items-center justify-center overflow-hidden">
        <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-6 text-brand-orange">
          <Construction className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-brand-dark mb-2">Módulo em Desenvolvimento</h2>
        <p className="text-brand-light text-center max-w-md">
          A tela de <strong>{activeTab}</strong> está planejada para as próximas fases do sistema.
        </p>
      </main>
    );
  }

  const filteredItems = inboxItems.filter(item => {
    const matchSearch = item.supplier.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        item.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const itemDate = parseInboxDate(item.date);
    const matchDate = itemDate >= startDate && itemDate <= endDate;
    
    return matchSearch && matchDate;
  });

  return (
    <main className="flex-1 bg-white h-full flex flex-col overflow-hidden">
      <header className="px-8 py-8 flex items-center justify-between border-b border-black/5 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-brand-dark">Caixa de Entrada</h1>
          <p className="text-sm text-brand-light mt-1">Gerencie e processe seus documentos financeiros.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 text-brand-light absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar documento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-gray-50 border border-black/5 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/50 w-64"
            />
          </div>
          <DateRangeFilter 
            startDate={startDate} 
            endDate={endDate} 
            onStartDateChange={setStartDate} 
            onEndDateChange={setEndDate} 
          />
          <button className="p-2 bg-gray-50 border border-black/5 rounded-full text-brand-dark hover:bg-gray-100 transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="grid grid-cols-3 gap-6 mb-8">
          {kpis.map((kpi, index) => (
            <div key={index} className="bg-white p-6 card-rounded shadow-soft border border-black/5">
              <h3 className="text-xs font-semibold text-brand-light uppercase tracking-wider mb-2">{kpi.title}</h3>
              <div className="flex items-end justify-between">
                <p className="text-3xl font-bold text-brand-dark">{kpi.value}</p>
                <div className={cn("flex items-center gap-1 text-sm font-bold", kpi.color)}>
                  {kpi.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {kpi.trendValue}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white card-rounded shadow-soft border border-black/5 overflow-hidden">
          <div className="px-6 py-4 border-b border-black/5 flex items-center justify-between bg-gray-50/50">
            <h2 className="font-bold text-brand-dark">Fila de Processamento</h2>
            <span className="text-xs font-semibold text-brand-light bg-gray-200 px-2 py-1 rounded-full">
              {filteredItems.length} itens
            </span>
          </div>
          
          <div className="divide-y divide-black/5">
            {filteredItems.length === 0 ? (
              <div className="p-12 text-center text-brand-light">
                Nenhum documento na fila para este período. Tudo limpo! 🎉
              </div>
            ) : (
              filteredItems.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    "p-6 flex items-center justify-between transition-colors hover:bg-gray-50 group cursor-pointer",
                    item.status === 'low_confidence' && "border-l-4 border-l-brand-orange bg-orange-50/30",
                    item.status === 'unidentified' && "border-l-4 border-l-brand-red bg-red-50/30",
                    selectedDocId === item.id && "bg-orange-50/50 border-l-4 border-l-brand-orange"
                  )}
                  onClick={() => onSelectDoc(item.id)}
                >
                  <div className="flex items-center gap-6 flex-1">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-brand-dark shrink-0">
                      <FileText className="w-6 h-6" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-sm font-bold text-brand-dark">{item.id}</span>
                        <span className="text-xs text-brand-light">•</span>
                        <span className="text-sm font-semibold text-brand-dark">{item.supplier}</span>
                        
                        {item.status === 'low_confidence' && (
                          <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-brand-orange bg-orange-100 px-2 py-0.5 rounded-full border border-brand-orange/20">
                            <AlertCircle className="w-3 h-3" />
                            Revisão Necessária
                          </span>
                        )}
                        {item.status === 'unidentified' && (
                          <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-brand-red bg-red-100 px-2 py-0.5 rounded-full border border-brand-red/20">
                            <AlertCircle className="w-3 h-3" />
                            Verifique Manualmente
                          </span>
                        )}
                        {item.type === 'Desconhecido' && (
                          <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded-full border border-yellow-400/50">
                            IA: Possível NF
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-brand-light">
                        <span className="flex items-center gap-1">
                          <span className="font-medium text-brand-dark">{item.type}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          {item.origin === 'E-mail' ? <Mail className="w-3 h-3" /> : <HardDrive className="w-3 h-3" />}
                          {item.origin}
                        </span>
                        <span>{item.date}</span>
                        <span className="font-bold text-brand-dark">{item.amount}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => { e.stopPropagation(); onDeleteDoc(item.id); }}
                      className="p-2 text-brand-light hover:text-brand-red hover:bg-red-50 rounded-full transition-colors"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); onSelectDoc(item.id); }}
                      className="flex items-center gap-2 px-4 py-2 bg-brand-orange text-white text-sm font-bold pill shadow-orange hover:bg-orange-600 transition-colors"
                    >
                      Processar
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
