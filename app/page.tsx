'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import MainContent from '@/components/MainContent';
import RightPanel from '@/components/RightPanel';
import NotasFiscaisModule from '@/components/notas-fiscais/NotasFiscaisModule';
import ContasAPagarModule from '@/components/contas-a-pagar/ContasAPagarModule';
import EstoqueModule from '@/components/estoque/EstoqueModule';
import ReceitasModule from '@/components/receitas/ReceitasModule';
import { initialInboxItems, DocItem } from '@/lib/data';

export default function Home() {
  const [activeTab, setActiveTab] = useState('Caixa de Entrada');
  const [inboxItems, setInboxItems] = useState<DocItem[]>(initialInboxItems);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);

  const selectedDoc = inboxItems.find(item => item.id === selectedDocId) || null;

  const handleDelete = (id: string) => {
    setInboxItems(prev => prev.filter(item => item.id !== id));
    if (selectedDocId === id) setSelectedDocId(null);
  };

  const handleConfirm = (id: string) => {
    // Simula o salvamento e remove da caixa de entrada
    setInboxItems(prev => prev.filter(item => item.id !== id));
    setSelectedDocId(null);
  };

  return (
    <div className="flex h-screen w-full bg-[#FFF5F0]">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {activeTab === 'Caixa de Entrada' && (
        <>
          <MainContent
            activeTab={activeTab}
            inboxItems={inboxItems}
            selectedDocId={selectedDocId}
            onSelectDoc={setSelectedDocId}
            onDeleteDoc={handleDelete}
          />
          <RightPanel
            selectedDoc={selectedDoc}
            onClose={() => setSelectedDocId(null)}
            onConfirm={handleConfirm}
          />
        </>
      )}

      {activeTab === 'Notas Fiscais' && <NotasFiscaisModule />}
      
      {activeTab === 'Contas a Pagar' && <ContasAPagarModule />}

      {activeTab === 'Insumos & Estoque' && <EstoqueModule />}
      
      {activeTab === 'Receitas & Ficha Técnica' && <ReceitasModule />}

      {/* Fallback for other tabs */}
      {!['Caixa de Entrada', 'Notas Fiscais', 'Contas a Pagar', 'Insumos & Estoque', 'Receitas & Ficha Técnica'].includes(activeTab) && (
        <MainContent
          activeTab={activeTab}
          inboxItems={[]}
          selectedDocId={null}
          onSelectDoc={() => {}}
          onDeleteDoc={() => {}}
        />
      )}
    </div>
  );
}
