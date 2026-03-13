export type DocItem = {
  id: string;
  type: string;
  attachments: number;
  origin: string;
  status: 'normal' | 'low_confidence' | 'unidentified';
  date: string;
  supplier: string;
  amount: string;
  attachmentUrl?: string;
  extractedData?: {
    nfNumber?: string;
    issueDate?: string;
    status?: string;
    items?: Array<{ name: string; unit: string; qty: number; unitCost: string; total: string; confidence?: 'low' | 'high' }>;
    boletos?: Array<{ installment: string; dueDate: string; value: string; barcode: string; confidence?: 'low' | 'high' }>;
  };
};

export const initialInboxItems: DocItem[] = [
  {
    id: 'DOC-001',
    type: 'Nota Fiscal',
    attachments: 1,
    origin: 'E-mail',
    status: 'normal',
    date: '13 Mar 2026',
    supplier: 'Fornecedor Carnes SA',
    amount: 'R$ 2.340,00',
    attachmentUrl: 'https://picsum.photos/seed/nf1/800/1200',
    extractedData: {
      nfNumber: '000.123.456',
      issueDate: '13/03/2026',
      status: 'Em Aberto',
      items: [
        { name: 'CARNE MOIDA ACEM KG', unit: 'KG', qty: 10, unitCost: 'R$ 34,00', total: 'R$ 340,00', confidence: 'high' },
        { name: 'CONTRA FILE KG', unit: 'KG', qty: 50, unitCost: 'R$ 40,00', total: 'R$ 2.000,00', confidence: 'high' }
      ],
      boletos: [
        { installment: 'Parcela 1', dueDate: '20/03/2026', value: 'R$ 2.340,00', barcode: '34191.09008 63571.277308 71444.640008 1 900000000234000' }
      ]
    }
  },
  {
    id: 'DOC-002',
    type: 'Boleto',
    attachments: 0,
    origin: 'Drive',
    status: 'low_confidence',
    date: '12 Mar 2026',
    supplier: 'Distribuidora Bebidas',
    amount: 'R$ 850,00',
    attachmentUrl: 'https://picsum.photos/seed/boleto1/800/1200',
    extractedData: {
      nfNumber: '',
      issueDate: '12/03/2026',
      status: 'Em Aberto',
      items: [],
      boletos: [
        { installment: 'Única', dueDate: '15/03/2026', value: 'R$ 850,00', barcode: '03399.87361 54000.000000 00008.500101 2 90000000085000', confidence: 'low' }
      ]
    }
  },
  {
    id: 'DOC-003',
    type: 'Desconhecido',
    attachments: 2,
    origin: 'E-mail',
    status: 'unidentified',
    date: '12 Mar 2026',
    supplier: 'Não identificado',
    amount: 'R$ --',
    attachmentUrl: 'https://picsum.photos/seed/unknown1/800/1200',
    extractedData: {
      nfNumber: '???',
      issueDate: '???',
      status: 'Pendente',
      items: [],
      boletos: []
    }
  },
  {
    id: 'DOC-004',
    type: 'Fatura',
    attachments: 1,
    origin: 'Verifica fatura mensal',
    status: 'normal',
    date: '10 Mar 2026',
    supplier: 'Energia Elétrica',
    amount: 'R$ 1.120,00',
    attachmentUrl: 'https://picsum.photos/seed/fatura1/800/1200',
    extractedData: {
      nfNumber: 'FAT-2026-03',
      issueDate: '10/03/2026',
      status: 'Em Aberto',
      items: [
        { name: 'Consumo Energia kWh', unit: 'kWh', qty: 1200, unitCost: 'R$ 0,93', total: 'R$ 1.120,00', confidence: 'high' }
      ],
      boletos: [
        { installment: 'Única', dueDate: '25/03/2026', value: 'R$ 1.120,00', barcode: '83690000011 20000138000 00000000000 00000000000' }
      ]
    }
  },
];
