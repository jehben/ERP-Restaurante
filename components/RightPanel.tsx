import { useState } from 'react';
import { Bell, AlertTriangle, X, Check, AlertCircle, FileImage } from 'lucide-react';
import { DocItem } from '@/lib/data';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface RightPanelProps {
  selectedDoc: DocItem | null;
  onClose: () => void;
  onConfirm: (id: string) => void;
}

export default function RightPanel({ selectedDoc, onClose, onConfirm }: RightPanelProps) {
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);

  if (selectedDoc) {
    return (
      <>
        <aside className="w-[400px] bg-white h-full flex flex-col border-l border-black/5 shrink-0 shadow-[-4px_0_24px_rgba(0,0,0,0.02)] z-10">
          <header className="px-6 py-6 border-b border-black/5 flex items-center justify-between bg-brand-beige shrink-0">
            <div>
              <h2 className="font-bold text-brand-dark text-lg">Processar Documento</h2>
              <p className="text-xs text-brand-light mt-1">ID: {selectedDoc.id}</p>
            </div>
            <button onClick={onClose} className="p-2 bg-white rounded-full shadow-soft hover:shadow-soft-hover transition-shadow text-brand-dark">
              <X className="w-4 h-4" />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
            {/* Botão Ver Anexo */}
            {selectedDoc.attachmentUrl && (
              <button 
                onClick={() => setShowAttachmentModal(true)}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-50 border border-black/5 text-brand-dark font-bold text-sm rounded-xl hover:bg-gray-100 transition-colors"
              >
                <FileImage className="w-4 h-4 text-brand-orange" />
                Ver Documento Original
              </button>
            )}

            {/* Alerta de Confiança */}
            {selectedDoc.status !== 'normal' && (
              <div className={cn(
                "p-4 rounded-xl border flex items-start gap-3",
                selectedDoc.status === 'low_confidence' ? "bg-orange-50 border-brand-orange/30 text-brand-orange" : "bg-red-50 border-brand-red/30 text-brand-red"
              )}>
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold">Atenção na Revisão</h4>
                  <p className="text-xs mt-1 opacity-90">
                    {selectedDoc.status === 'low_confidence' 
                      ? 'A IA encontrou campos com baixa confiança de leitura. Verifique os campos destacados em laranja.'
                      : 'A IA não conseguiu identificar este documento com clareza. Preencha os dados manualmente.'}
                  </p>
                </div>
              </div>
            )}

            {/* Dados Principais */}
            <section>
              <h3 className="text-xs font-bold text-brand-light uppercase tracking-wider mb-3">Dados Principais</h3>
              <div className="flex flex-col gap-3">
                <InputField label="Tipo de Documento" value={selectedDoc.type} />
                <InputField label="Emitente" value={selectedDoc.supplier} />
                <InputField label="Data de Emissão" value={selectedDoc.extractedData?.issueDate || ''} />
                <InputField label="Número da NF" value={selectedDoc.extractedData?.nfNumber || ''} warning={selectedDoc.status === 'unidentified'} />
                <InputField label="Valor Total" value={selectedDoc.amount} />
                
                {/* Recorrência (Especialmente para Faturas) */}
                <div className="mt-1">
                  <label className="block text-[10px] font-bold text-brand-light uppercase tracking-wider mb-1 pl-1">
                    Recorrência
                  </label>
                  <select className="w-full px-3 py-2 bg-gray-50 border border-black/5 rounded-lg text-sm font-medium text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-orange/50 transition-shadow">
                    <option value="none">Nenhuma (Única)</option>
                    <option value="daily">Diária</option>
                    <option value="weekly">Semanal</option>
                    <option value="monthly">Mensal</option>
                    <option value="semiannual">Semestral</option>
                    <option value="annual">Anual</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Itens Extraídos */}
            {selectedDoc.extractedData?.items && selectedDoc.extractedData.items.length > 0 && (
              <section>
                <h3 className="text-xs font-bold text-brand-light uppercase tracking-wider mb-3">Itens Extraídos</h3>
                <div className="border border-black/5 rounded-xl overflow-hidden">
                  {selectedDoc.extractedData.items.map((item, idx) => (
                    <div key={idx} className="p-3 border-b border-black/5 last:border-0 bg-gray-50/50">
                      <p className="text-sm font-semibold text-brand-dark mb-1">{item.name}</p>
                      <div className="flex items-center justify-between text-xs text-brand-light">
                        <span>{item.qty} {item.unit} x {item.unitCost}</span>
                        <span className="font-bold text-brand-dark">{item.total}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Boletos Associados */}
            {selectedDoc.extractedData?.boletos && selectedDoc.extractedData.boletos.length > 0 && (
              <section>
                <h3 className="text-xs font-bold text-brand-light uppercase tracking-wider mb-3">Boletos Associados</h3>
                <div className="flex flex-col gap-3">
                  {selectedDoc.extractedData.boletos.map((boleto, idx) => (
                    <div key={idx} className={cn(
                      "p-4 rounded-xl border bg-white",
                      boleto.confidence === 'low' ? "border-brand-orange" : "border-black/5"
                    )}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-brand-dark">{boleto.installment}</span>
                        <span className="text-sm font-bold text-brand-dark">{boleto.value}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-brand-light mb-3">
                        <span>Vencimento:</span>
                        <span className={cn("font-semibold", boleto.confidence === 'low' && "text-brand-orange")}>
                          {boleto.dueDate}
                          {boleto.confidence === 'low' && <AlertCircle className="w-3 h-3 inline ml-1" />}
                        </span>
                      </div>
                      <div>
                        <p className="text-[10px] text-brand-light mb-1 uppercase">Código de Barras</p>
                        <p className="text-xs font-mono text-brand-dark break-all bg-gray-50 p-2 rounded border border-black/5">
                          {boleto.barcode}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <footer className="p-6 border-t border-black/5 bg-white shrink-0">
            <button 
              onClick={() => onConfirm(selectedDoc.id)}
              className="w-full flex items-center justify-center gap-2 py-3 bg-brand-green text-white font-bold text-sm pill shadow-soft hover:bg-emerald-600 transition-colors"
            >
              <Check className="w-5 h-5" />
              Confirmar e Salvar
            </button>
          </footer>
        </aside>

        {/* Modal do Anexo */}
        {showAttachmentModal && selectedDoc.attachmentUrl && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-8">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-full max-h-[90vh] flex flex-col overflow-hidden">
              <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
                <h2 className="font-bold text-lg text-brand-dark flex items-center gap-2">
                  <FileImage className="w-5 h-5 text-brand-orange" />
                  Documento Original
                </h2>
                <button 
                  onClick={() => setShowAttachmentModal(false)} 
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-brand-dark" />
                </button>
              </div>
              <div className="flex-1 bg-gray-200 overflow-auto flex items-center justify-center p-8 relative">
                <Image 
                  src={selectedDoc.attachmentUrl} 
                  alt="Documento Original" 
                  width={800}
                  height={1200}
                  className="max-w-full h-auto shadow-lg rounded-lg"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Default "Hoje" view
  return (
    <aside className="w-80 bg-brand-beige h-full flex flex-col py-8 px-6 border-l border-black/5 shrink-0 overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-bold text-brand-dark text-lg">Hoje</h2>
        <button className="p-2 bg-white rounded-full shadow-soft hover:shadow-soft-hover transition-shadow text-brand-orange">
          <Bell className="w-5 h-5" />
        </button>
      </div>

      <div className="bg-white p-5 card-rounded shadow-soft mb-6">
        <h3 className="text-xs font-semibold text-brand-light uppercase tracking-wider mb-4">Resumo do Dia</h3>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-brand-orange">
              <InboxIcon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-bold text-brand-dark">12 Novos</p>
              <p className="text-xs text-brand-light">Documentos na caixa</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-brand-red">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-bold text-brand-dark">3 Boletos</p>
              <p className="text-xs text-brand-light">Vencendo esta semana</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold text-brand-light uppercase tracking-wider mb-4">Próximos Vencimentos</h3>
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-4 card-rounded shadow-soft flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex flex-col items-center justify-center border border-black/5">
                  <span className="text-[10px] text-brand-light font-medium uppercase">Mar</span>
                  <span className="text-sm font-bold text-brand-dark leading-none">{14 + i}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-brand-dark">Fornecedor {i}</p>
                  <p className="text-xs text-brand-light">Boleto</p>
                </div>
              </div>
              <p className="text-sm font-bold text-brand-dark">R$ 450,00</p>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

function InputField({ label, value, warning }: { label: string, value: string, warning?: boolean }) {
  return (
    <div>
      <label className="block text-[10px] font-bold text-brand-light uppercase tracking-wider mb-1 pl-1">
        {label}
      </label>
      <div className="relative">
        <input 
          type="text" 
          defaultValue={value}
          className={cn(
            "w-full px-3 py-2 bg-gray-50 border rounded-lg text-sm font-medium text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-orange/50 transition-shadow",
            warning ? "border-brand-orange/50 bg-orange-50/30" : "border-black/5"
          )}
        />
        {warning && <AlertCircle className="w-4 h-4 text-brand-orange absolute right-3 top-1/2 -translate-y-1/2" />}
      </div>
    </div>
  );
}

function InboxIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
      <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
  );
}
