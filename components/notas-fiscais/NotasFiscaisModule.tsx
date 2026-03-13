import { useState } from 'react';
import { Search, Filter, FileText, ChevronRight, X, Check, Edit2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NFItem } from '@/lib/types';
import { mockNFs } from '@/lib/mock-data';
import DateRangeFilter from '@/components/DateRangeFilter';

export default function NotasFiscaisModule() {
  const [nfs, setNfs] = useState<NFItem[]>(mockNFs);
  const [selectedNfId, setSelectedNfId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('2026-03-01');
  const [endDate, setEndDate] = useState('2026-03-31');

  const selectedNf = nfs.find(nf => nf.id === selectedNfId) || null;

  const filteredNfs = nfs.filter(nf => {
    const matchSearch = nf.emitente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        nf.numero.includes(searchTerm) ||
                        nf.cnpj.includes(searchTerm);
    
    // Convert DD/MM/YYYY to YYYY-MM-DD for comparison
    const [day, month, year] = nf.dataEmissao.split('/');
    const nfDate = `${year}-${month}-${day}`;
    const matchDate = nfDate >= startDate && nfDate <= endDate;
    
    return matchSearch && matchDate;
  });

  const totalNfs = filteredNfs.length;
  const valorTotal = filteredNfs.reduce((acc, nf) => acc + nf.valor, 0);

  return (
    <div className="flex-1 flex h-full overflow-hidden">
      <main className="flex-1 bg-white h-full flex flex-col overflow-hidden">
        <header className="px-8 py-8 flex items-center justify-between border-b border-black/5 shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-brand-dark">Notas Fiscais</h1>
            <p className="text-sm text-brand-light mt-1">Gerencie todas as notas recebidas e processadas.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 text-brand-light absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por emitente, NF ou CNPJ..."
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
            <div className="bg-white p-6 card-rounded shadow-soft border border-black/5">
              <h3 className="text-xs font-semibold text-brand-light uppercase tracking-wider mb-2">Total de NFs</h3>
              <p className="text-3xl font-bold text-brand-dark">{totalNfs}</p>
            </div>
            <div className="bg-white p-6 card-rounded shadow-soft border border-black/5">
              <h3 className="text-xs font-semibold text-brand-light uppercase tracking-wider mb-2">Valor Total</h3>
              <p className="text-3xl font-bold text-brand-dark">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorTotal)}
              </p>
            </div>
            <div className="bg-white p-6 card-rounded shadow-soft border border-black/5 flex items-center justify-center">
              <p className="text-sm text-brand-light text-center">Filtros ativos: <br/><span className="font-bold text-brand-dark">Nenhum</span></p>
            </div>
          </div>

          <div className="bg-white card-rounded shadow-soft border border-black/5 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-black/5 text-xs font-bold text-brand-light uppercase tracking-wider">
                  <th className="px-6 py-4">ID / Número</th>
                  <th className="px-6 py-4">Emitente</th>
                  <th className="px-6 py-4">Data Emissão</th>
                  <th className="px-6 py-4">Valor</th>
                  <th className="px-6 py-4">Itens / Boletos</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {filteredNfs.map((nf) => (
                  <tr 
                    key={nf.id} 
                    onClick={() => setSelectedNfId(nf.id)}
                    className={cn(
                      "hover:bg-gray-50 cursor-pointer transition-colors group",
                      selectedNfId === nf.id && "bg-orange-50/30"
                    )}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-brand-dark">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-brand-dark">{nf.id}</p>
                          <p className="text-xs text-brand-light">NF {nf.numero}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-brand-dark">{nf.emitente}</p>
                      <p className="text-xs text-brand-light">{nf.cnpj}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-brand-dark">{nf.dataEmissao}</td>
                    <td className="px-6 py-4 text-sm font-bold text-brand-dark">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(nf.valor)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <span className="px-2 py-1 bg-gray-100 text-brand-dark text-[10px] font-bold rounded-full">
                          {nf.itens.length} itens
                        </span>
                        <span className="px-2 py-1 bg-gray-100 text-brand-dark text-[10px] font-bold rounded-full">
                          {nf.boletos.length} boletos
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border",
                        nf.status === 'Em Aberto' && "bg-orange-100 text-brand-orange border-brand-orange/20",
                        nf.status === 'Paga' && "bg-emerald-100 text-brand-green border-brand-green/20",
                        nf.status === 'Vencida' && "bg-red-100 text-brand-red border-brand-red/20",
                        nf.status === 'Cancelada' && "bg-gray-100 text-brand-light border-black/10"
                      )}>
                        {nf.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Painel Lateral */}
      {selectedNf && (
        <aside className="w-[450px] bg-white h-full flex flex-col border-l border-black/5 shrink-0 shadow-[-4px_0_24px_rgba(0,0,0,0.02)] z-10">
          <header className="px-6 py-6 border-b border-black/5 flex items-center justify-between bg-brand-beige shrink-0">
            <div>
              <h2 className="font-bold text-brand-dark text-lg">Detalhes da NF</h2>
              <p className="text-xs text-brand-light mt-1">{selectedNf.id} • NF {selectedNf.numero}</p>
            </div>
            <button onClick={() => setSelectedNfId(null)} className="p-2 bg-white rounded-full shadow-soft hover:shadow-soft-hover transition-shadow text-brand-dark">
              <X className="w-4 h-4" />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
            <section>
              <h3 className="text-xs font-bold text-brand-light uppercase tracking-wider mb-3">Dados da Nota</h3>
              <div className="flex flex-col gap-3">
                <EditableField label="Emitente" value={selectedNf.emitente} />
                <EditableField label="CNPJ" value={selectedNf.cnpj} />
                <EditableField label="Número da NF" value={selectedNf.numero} />
                <EditableField label="Data de Emissão" value={selectedNf.dataEmissao} />
                <EditableField label="Valor Total" value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(selectedNf.valor)} />
                <EditableField label="Status" value={selectedNf.status} />
                <EditableField label="Observações" value={selectedNf.observacoes || 'Nenhuma observação.'} multiline />
              </div>
            </section>

            <section>
              <h3 className="text-xs font-bold text-brand-light uppercase tracking-wider mb-3">Itens da NF</h3>
              <div className="border border-black/5 rounded-xl overflow-hidden">
                {selectedNf.itens.map((item, idx) => (
                  <div key={idx} className="p-3 border-b border-black/5 last:border-0 bg-gray-50/50">
                    <p className="text-xs text-brand-light mb-1">{item.descricao}</p>
                    <p className="text-sm font-bold text-brand-dark mb-2">→ {item.nomePadronizado}</p>
                    <div className="flex items-center justify-between text-xs text-brand-light">
                      <span>{item.qtd} {item.unidade} x {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.custoUnitario)}</span>
                      <span className="font-bold text-brand-dark">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.qtd * item.custoUnitario)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-xs font-bold text-brand-light uppercase tracking-wider mb-3">Boletos Vinculados</h3>
              <div className="flex flex-col gap-3">
                {selectedNf.boletos.map((boleto, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-black/5 bg-white">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-brand-dark">Parcela {boleto.parcela}</span>
                      <span className={cn(
                        "px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border",
                        boleto.status === 'Em Aberto' && "bg-orange-100 text-brand-orange border-brand-orange/20",
                        boleto.status === 'Pago' && "bg-emerald-100 text-brand-green border-brand-green/20",
                        boleto.status === 'Vencido' && "bg-red-100 text-brand-red border-brand-red/20"
                      )}>
                        {boleto.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-brand-light mb-3">
                      <span>Vencimento: <strong className="text-brand-dark">{boleto.vencimento}</strong></span>
                      <span className="font-bold text-brand-dark">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(boleto.valor)}
                      </span>
                    </div>
                    <button className="text-xs font-bold text-brand-orange hover:underline">
                      Ver no Contas a Pagar →
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </aside>
      )}
    </div>
  );
}

function EditableField({ label, value, multiline = false }: { label: string, value: string, multiline?: boolean }) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);

  if (isEditing) {
    return (
      <div className="bg-orange-50/30 p-2 rounded-lg border border-brand-orange/30">
        <label className="block text-[10px] font-bold text-brand-orange uppercase tracking-wider mb-1 pl-1">
          {label}
        </label>
        <div className="flex gap-2">
          {multiline ? (
            <textarea 
              value={currentValue}
              onChange={(e) => setCurrentValue(e.target.value)}
              className="flex-1 px-2 py-1 text-sm border border-black/10 rounded focus:outline-none focus:border-brand-orange bg-white"
              rows={3}
            />
          ) : (
            <input 
              type="text" 
              value={currentValue}
              onChange={(e) => setCurrentValue(e.target.value)}
              className="flex-1 px-2 py-1 text-sm border border-black/10 rounded focus:outline-none focus:border-brand-orange bg-white"
            />
          )}
          <div className="flex flex-col gap-1">
            <button onClick={() => setIsEditing(false)} className="p-1 bg-brand-green text-white rounded hover:bg-emerald-600">
              <Check className="w-3 h-3" />
            </button>
            <button onClick={() => { setCurrentValue(value); setIsEditing(false); }} className="p-1 bg-gray-200 text-brand-dark rounded hover:bg-gray-300">
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative p-2 -mx-2 rounded-lg hover:bg-gray-50 transition-colors">
      <label className="block text-[10px] font-bold text-brand-light uppercase tracking-wider mb-1 pl-1">
        {label}
      </label>
      <div className="pl-1 text-sm font-medium text-brand-dark">
        {currentValue}
      </div>
      <button 
        onClick={() => setIsEditing(true)}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-brand-light hover:text-brand-orange opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Edit2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
