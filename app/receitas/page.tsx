import ReceitasModule from '@/components/receitas/ReceitasModule';

export default function ReceitasPage() {
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <header className="bg-white border-b border-black/5 px-6 py-4 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-brand-dark">Receitas & Ficha Técnica</h1>
          <p className="text-sm text-brand-light">Gestão de custos, margens e receitas por canal</p>
        </div>
      </header>
      <div className="flex-1 overflow-hidden">
        <ReceitasModule />
      </div>
    </div>
  );
}
