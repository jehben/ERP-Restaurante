import { useState } from 'react';
import { Search, Filter, Calendar, AlertTriangle, CheckCircle2, ChevronRight, X, Check, Edit2, Info, TrendingDown, Trash2 } from 'lucide-react';
import { cn, getFinancialWeeks, parseDate } from '@/lib/utils';
import { ContaAPagar, Insight } from '@/lib/types';
import { mockContas, mockInsights } from '@/lib/mock-data';
import DateRangeFilter from '@/components/DateRangeFilter';

export default function ContasAPagarModule() {
  const [contas, setContas] = useState<ContaAPagar[]>(mockContas);
  const [selectedContaId, setSelectedContaId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPagarModal, setShowPagarModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [contaToDelete, setContaToDelete] = useState<string | null>(null);
  const [startDate, setStartDate] = useState('2026-03-01');
  const [endDate, setEndDate] = useState('2026-03-31');

  const selectedConta = contas.find(c => c.id === selectedContaId) || null;

  const filteredContas = contas.filter(c => {
    const matchSearch = c.emitente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        c.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDate = c.vencimento >= startDate && c.vencimento <= endDate;
    return matchSearch && matchDate;
  });

  const totalAPagar = filteredContas.filter(c => c.status !== 'Pago' && c.status !== 'Cancelado').reduce((acc, c) => acc + c.valorOriginal + c.multa + c.juros - c.desconto, 0);
  const totalVencido = filteredContas.filter(c => c.status === 'Vencido').reduce((acc, c) => acc + c.valorOriginal + c.multa + c.juros - c.desconto, 0);
  const totalPago = filteredContas.filter(c => c.status === 'Pago').reduce((acc, c) => acc + c.valorOriginal, 0);

  const financialWeeks = getFinancialWeeks(startDate, endDate);
  financialWeeks.forEach(week => {
    const weekContas = filteredContas.filter(c => {
      const d = parseDate(c.vencimento);
      return d >= week.start && d <= week.end;
    });
    week.value = weekContas.reduce((acc, c) => acc + c.valorOriginal + c.multa + c.juros - c.desconto, 0);
  });
  const maxWeekValue = Math.max(...financialWeeks.map(w => w.value), 1);
  financialWeeks.forEach(w => {
    w.percent = (w.value / maxWeekValue) * 100;
  });

  const handlePagar = (id: string) => {
    setContas(prev => prev.map(c => c.id === id ? { ...c, status: 'Pago', dataPagamento: new Date().toISOString().split('T')[0] } : c));
    setShowPagarModal(false);
  };

  const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedConta) return;
    
    const formData = new FormData(e.currentTarget);
    const updatedConta: ContaAPagar = {
      ...selectedConta,
      emitente: formData.get('emitente') as string,
      descricao: formData.get('descricao') as string,
      vencimento: formData.get('vencimento') as string,
      valorOriginal: Number(formData.get('valorOriginal')),
      status: formData.get('status') as ContaAPagar['status'],
    };
    
    setContas(prev => prev.map(c => c.id === selectedConta.id ? updatedConta : c));
    setShowEditModal(false);
  };

  const confirmDelete = () => {
    if (contaToDelete) {
      setContas(prev => prev.filter(c => c.id !== contaToDelete));
      setContaToDelete(null);
    }
  };

  return (
    <div className="flex-1 flex h-full overflow-hidden">
      <main className="flex-1 bg-white h-full flex flex-col overflow-hidden">
        <header className="px-8 py-8 flex items-center justify-between border-b border-black/5 shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-brand-dark">Contas a Pagar</h1>
            <p className="text-sm text-brand-light mt-1">Mostrando: {startDate.split('-').reverse().join('/')} a {endDate.split('-').reverse().join('/')} — {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalAPagar)} a pagar</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 text-brand-light absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por emitente, descrição..."
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
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-5 card-rounded shadow-soft border border-black/5">
              <h3 className="text-xs font-semibold text-brand-light uppercase tracking-wider mb-2">A pagar no período</h3>
              <p className="text-2xl font-bold text-brand-orange">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalAPagar)}
              </p>
            </div>
            <div className="bg-white p-5 card-rounded shadow-soft border border-black/5">
              <h3 className="text-xs font-semibold text-brand-light uppercase tracking-wider mb-2 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-yellow-500" />
                Vencendo em 7 dias
              </h3>
              <p className="text-2xl font-bold text-brand-dark">
                R$ 150,00
              </p>
            </div>
            <div className="bg-white p-5 card-rounded shadow-soft border border-black/5">
              <h3 className="text-xs font-semibold text-brand-light uppercase tracking-wider mb-2">Em atraso</h3>
              <p className="text-2xl font-bold text-brand-red">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalVencido)}
              </p>
            </div>
            <div className="bg-white p-5 card-rounded shadow-soft border border-black/5">
              <h3 className="text-xs font-semibold text-brand-light uppercase tracking-wider mb-2 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-brand-green" />
                Pago no período
              </h3>
              <p className="text-2xl font-bold text-brand-dark">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPago)}
              </p>
            </div>
          </div>

          <div className="bg-white card-rounded shadow-soft border border-black/5 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-black/5 text-xs font-bold text-brand-light uppercase tracking-wider">
                  <th className="px-6 py-4">Tipo / Origem</th>
                  <th className="px-6 py-4">Emitente / Descrição</th>
                  <th className="px-6 py-4">Vencimento</th>
                  <th className="px-6 py-4 text-right">Valor Atualizado</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {filteredContas.map((conta) => {
                  const isVencida = conta.status === 'Vencido';
                  const isUrgente = !isVencida && conta.status !== 'Pago' && new Date(conta.vencimento).getTime() - new Date('2026-03-13').getTime() <= 3 * 24 * 60 * 60 * 1000;
                  const valorAtualizado = conta.valorOriginal + conta.multa + conta.juros - conta.desconto;

                  return (
                    <tr 
                      key={conta.id} 
                      className={cn(
                        "hover:bg-gray-50 transition-colors group",
                        isVencida && "bg-red-50/30 border-l-4 border-l-brand-red",
                        isUrgente && "bg-orange-50/30 border-l-4 border-l-brand-orange",
                        conta.status === 'Pago' && "opacity-60"
                      )}
                    >
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border",
                          conta.tipo === 'Boleto' && "bg-blue-100 text-blue-700 border-blue-200",
                          conta.tipo === 'Fatura' && "bg-purple-100 text-purple-700 border-purple-200",
                          conta.tipo === 'Parcela' && "bg-orange-100 text-brand-orange border-brand-orange/20"
                        )}>
                          {conta.tipo}
                        </span>
                        <p className="text-[10px] text-brand-light mt-1 font-semibold">{conta.origem}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-brand-dark">{conta.emitente}</p>
                        <p className="text-xs text-brand-light">{conta.descricao}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={cn("text-sm font-medium", isVencida && "text-brand-red font-bold", isUrgente && "text-brand-orange font-bold")}>
                            {conta.vencimento.split('-').reverse().join('/')}
                          </span>
                          {isVencida && <span className="px-1.5 py-0.5 bg-brand-red text-white text-[9px] font-bold rounded uppercase">Atrasado</span>}
                          {isUrgente && <span className="px-1.5 py-0.5 bg-brand-orange text-white text-[9px] font-bold rounded uppercase">Urgente</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className={cn("text-sm font-bold", isVencida ? "text-brand-red" : "text-brand-dark")}>
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorAtualizado)}
                        </p>
                        {(conta.multa > 0 || conta.juros > 0) && (
                          <p className="text-[10px] text-brand-light">
                            Original: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(conta.valorOriginal)}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border",
                          conta.status === 'Em Aberto' && "bg-gray-100 text-brand-dark border-black/10",
                          conta.status === 'Pago' && "bg-emerald-100 text-brand-green border-brand-green/20",
                          conta.status === 'Vencido' && "bg-red-100 text-brand-red border-brand-red/20",
                          conta.status === 'Cancelado' && "bg-gray-100 text-brand-light border-black/10"
                        )}>
                          {conta.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {conta.status !== 'Pago' && (
                            <button 
                              onClick={() => { setSelectedContaId(conta.id); setShowPagarModal(true); }}
                              className="px-3 py-1.5 bg-brand-orange text-white text-xs font-bold pill shadow-orange hover:bg-orange-600 transition-colors flex items-center gap-1"
                            >
                              <Check className="w-3 h-3" />
                              Pagar
                            </button>
                          )}
                          <button 
                            onClick={() => { setSelectedContaId(conta.id); setShowEditModal(true); }}
                            className="p-1.5 text-brand-light hover:text-brand-orange bg-gray-50 hover:bg-orange-50 rounded-full transition-colors"
                            title="Editar"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => setContaToDelete(conta.id)}
                            className="p-1.5 text-brand-light hover:text-brand-red bg-gray-50 hover:bg-red-50 rounded-full transition-colors"
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Painel Lateral Direito (Resumo + Insights) */}
      <aside className="w-80 bg-brand-beige h-full flex flex-col py-8 px-6 border-l border-black/5 shrink-0 overflow-y-auto">
        <h2 className="font-bold text-brand-dark text-lg mb-6">Resumo do Período</h2>
        
        <div className="bg-white p-5 card-rounded shadow-soft mb-6">
          <h3 className="text-xs font-semibold text-brand-light uppercase tracking-wider mb-2">Total a Pagar</h3>
          <p className="text-3xl font-bold text-brand-orange mb-4">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalAPagar)}
          </p>
          
          <div className="space-y-3 pt-4 border-t border-black/5">
            <div className="flex justify-between items-center text-sm">
              <span className="text-brand-light">Já pago</span>
              <span className="font-bold text-brand-dark">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPago)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-brand-light">Vencido</span>
              <span className="font-bold text-brand-red">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalVencido)}</span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xs font-semibold text-brand-light uppercase tracking-wider mb-4">Vencimentos por Semana</h3>
          <div className="space-y-3">
            {financialWeeks.map((week, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-brand-dark font-medium">{week.label}</span>
                  <span className="text-brand-light">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(week.value)}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-brand-orange rounded-full" 
                    style={{ width: `${week.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-semibold text-brand-light uppercase tracking-wider flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              Insights de IA
            </h3>
            <button className="text-[10px] font-bold text-brand-orange hover:underline">Atualizar</button>
          </div>
          
          <div className="flex flex-col gap-3">
            {mockInsights.map((insight) => (
              <div key={insight.id} className="bg-[#F0F9FF] p-4 card-rounded border border-blue-100 flex items-start gap-3">
                <div className={cn(
                  "p-1.5 rounded-lg shrink-0",
                  insight.prioridade === 'alta' ? "bg-red-100 text-brand-red" :
                  insight.prioridade === 'media' ? "bg-orange-100 text-brand-orange" : "bg-blue-100 text-blue-600"
                )}>
                  {insight.icone === 'AlertTriangle' && <AlertTriangle className="w-4 h-4" />}
                  {insight.icone === 'TrendingDown' && <TrendingDown className="w-4 h-4" />}
                  {insight.icone === 'Info' && <Info className="w-4 h-4" />}
                </div>
                <p className="text-xs text-brand-dark leading-relaxed font-medium">
                  {insight.texto}
                </p>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Modal de Pagamento */}
      {showPagarModal && selectedConta && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <header className="px-6 py-4 border-b border-black/5 flex items-center justify-between bg-gray-50">
              <h2 className="font-bold text-brand-dark text-lg">Registrar Pagamento</h2>
              <button onClick={() => setShowPagarModal(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                <X className="w-4 h-4 text-brand-dark" />
              </button>
            </header>
            
            <div className="p-6 flex flex-col gap-4">
              <div className="bg-gray-50 p-4 rounded-xl border border-black/5 mb-2">
                <p className="text-xs text-brand-light mb-1">{selectedConta.emitente}</p>
                <p className="text-sm font-bold text-brand-dark mb-3">{selectedConta.descricao}</p>
                
                <div className="flex justify-between items-center text-sm mb-1">
                  <span className="text-brand-light">Valor Original</span>
                  <span className="font-medium text-brand-dark">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(selectedConta.valorOriginal)}</span>
                </div>
                {(selectedConta.multa > 0 || selectedConta.juros > 0) && (
                  <div className="flex justify-between items-center text-sm mb-1 text-brand-red">
                    <span>Acréscimos (Multa/Juros)</span>
                    <span className="font-medium">+{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(selectedConta.multa + selectedConta.juros)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-base font-bold mt-3 pt-3 border-t border-black/10">
                  <span className="text-brand-dark">Valor Final</span>
                  <span className="text-brand-orange">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(selectedConta.valorOriginal + selectedConta.multa + selectedConta.juros - selectedConta.desconto)}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-dark mb-1">Data do Pagamento *</label>
                <input 
                  type="date" 
                  defaultValue={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 bg-white border border-black/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-dark mb-1">Observações (opcional)</label>
                <textarea 
                  placeholder="Ex: Pago via Pix pelo app do banco..."
                  className="w-full px-3 py-2 bg-white border border-black/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/50"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-dark mb-1">Comprovante (opcional)</label>
                <div className="border-2 border-dashed border-black/10 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                  <p className="text-xs text-brand-light font-medium">Clique para anexar ou arraste o arquivo</p>
                </div>
              </div>
            </div>

            <footer className="px-6 py-4 border-t border-black/5 bg-gray-50 flex justify-end gap-3">
              <button 
                onClick={() => setShowPagarModal(false)}
                className="px-4 py-2 text-sm font-bold text-brand-light hover:text-brand-dark transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={() => handlePagar(selectedConta.id)}
                className="px-6 py-2 bg-brand-green text-white text-sm font-bold pill shadow-soft hover:bg-emerald-600 transition-colors flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Confirmar Pagamento
              </button>
            </footer>
          </div>
        </div>
      )}

      {/* Modal de Edição */}
      {showEditModal && selectedConta && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <header className="px-6 py-4 border-b border-black/5 flex items-center justify-between bg-gray-50">
              <h2 className="font-bold text-brand-dark text-lg">Editar Conta</h2>
              <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                <X className="w-4 h-4 text-brand-dark" />
              </button>
            </header>
            
            <form onSubmit={handleEdit} className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-brand-dark mb-1">Emitente</label>
                <input 
                  name="emitente"
                  type="text" 
                  defaultValue={selectedConta.emitente}
                  className="w-full px-3 py-2 bg-white border border-black/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/50"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-brand-dark mb-1">Descrição</label>
                <input 
                  name="descricao"
                  type="text" 
                  defaultValue={selectedConta.descricao}
                  className="w-full px-3 py-2 bg-white border border-black/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/50"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-brand-dark mb-1">Vencimento</label>
                  <input 
                    name="vencimento"
                    type="date" 
                    defaultValue={selectedConta.vencimento}
                    className="w-full px-3 py-2 bg-white border border-black/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-brand-dark mb-1">Valor Original (R$)</label>
                  <input 
                    name="valorOriginal"
                    type="number" 
                    step="0.01"
                    defaultValue={selectedConta.valorOriginal}
                    className="w-full px-3 py-2 bg-white border border-black/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/50"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-brand-dark mb-1">Status</label>
                <select 
                  name="status"
                  defaultValue={selectedConta.status}
                  className="w-full px-3 py-2 bg-white border border-black/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/50"
                  required
                >
                  <option value="Em Aberto">Em Aberto</option>
                  <option value="Vencido">Vencido</option>
                  <option value="Pago">Pago</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </div>

              <footer className="mt-4 pt-4 border-t border-black/5 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-sm font-bold text-brand-light hover:text-brand-dark transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 bg-brand-orange text-white text-sm font-bold pill shadow-orange hover:bg-orange-600 transition-colors flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Salvar Alterações
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Exclusão */}
      {contaToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-50 text-brand-red rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h2 className="font-bold text-brand-dark text-lg mb-2">Excluir Registro</h2>
              <p className="text-sm text-brand-light">
                Tem certeza que deseja excluir este registro? Esta ação não poderá ser desfeita.
              </p>
            </div>
            <footer className="px-6 py-4 border-t border-black/5 bg-gray-50 flex justify-end gap-3">
              <button 
                onClick={() => setContaToDelete(null)}
                className="px-4 py-2 text-sm font-bold text-brand-light hover:text-brand-dark transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmDelete}
                className="px-6 py-2 bg-brand-red text-white text-sm font-bold pill shadow-soft hover:bg-red-600 transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Excluir
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}
