import { NFItem, ContaAPagar, Insight, Insumo, ContagemEstoque, ListaCompras, InsightEstoque, Receita, FichaTecnica } from './types';

export const mockNFs: NFItem[] = [
// ... existing mockNFs ...
  {
    id: 'NF-001',
    numero: '4521',
    dataEmissao: '10/03/2026',
    emitente: 'Fornecedor Carnes SA',
    cnpj: '12.345.678/0001-90',
    valor: 2340.00,
    status: 'Em Aberto',
    itens: [
      { descricao: 'CARNE MOIDA ACEM KG', nomePadronizado: 'Carne Moída', unidade: 'KG', qtd: 10, custoUnitario: 34.00 },
      { descricao: 'CONTRA FILE KG', nomePadronizado: 'Contra Filé', unidade: 'KG', qtd: 50, custoUnitario: 40.00 }
    ],
    boletos: [
      { id: 'BOL-001', parcela: '1/1', vencimento: '20/03/2026', valor: 2340.00, status: 'Em Aberto', codigoBarras: '34191.09008 63571.277308 71444.640008 1 900000000234000' }
    ],
    observacoes: 'Entrega recebida na porta dos fundos.',
    arquivoUrl: 'https://picsum.photos/seed/nf1/800/1200'
  },
  {
    id: 'NF-002',
    numero: '1029',
    dataEmissao: '05/03/2026',
    emitente: 'Distribuidora Bebidas',
    cnpj: '98.765.432/0001-10',
    valor: 850.00,
    status: 'Vencida',
    itens: [
      { descricao: 'REFRIGERANTE COLA 2L', nomePadronizado: 'Refrigerante Cola', unidade: 'UN', qtd: 100, custoUnitario: 8.50 }
    ],
    boletos: [
      { id: 'BOL-002', parcela: '1/1', vencimento: '12/03/2026', valor: 850.00, status: 'Vencido', codigoBarras: '03399.87361 54000.000000 00008.500101 2 90000000085000' }
    ],
    arquivoUrl: 'https://picsum.photos/seed/nf2/800/1200'
  },
  {
    id: 'NF-003',
    numero: '887',
    dataEmissao: '01/03/2026',
    emitente: 'Embalagens Express',
    cnpj: '45.123.890/0001-55',
    valor: 450.00,
    status: 'Paga',
    itens: [
      { descricao: 'CAIXA HAMBURGUER KRAFT', nomePadronizado: 'Caixa Hambúrguer', unidade: 'UN', qtd: 1000, custoUnitario: 0.45 }
    ],
    boletos: [
      { id: 'BOL-003', parcela: '1/1', vencimento: '05/03/2026', valor: 450.00, status: 'Pago', codigoBarras: '23793.38128 60083.013528 56000.063308 3 89000000045000' }
    ],
    arquivoUrl: 'https://picsum.photos/seed/nf3/800/1200'
  }
];

export const mockContas: ContaAPagar[] = [
// ... existing mockContas ...
  {
    id: 'CONTA-001',
    tipo: 'Boleto',
    origem: 'NF vinculada',
    emitente: 'Fornecedor Carnes SA',
    descricao: 'Parcela 1 de 1 — NF 4521',
    vencimento: '2026-03-20',
    valorOriginal: 2340.00,
    multa: 0,
    juros: 0,
    desconto: 0,
    status: 'Em Aberto',
    nfId: 'NF-001',
    codigoBarras: '34191.09008 63571.277308 71444.640008 1 900000000234000'
  },
  {
    id: 'CONTA-002',
    tipo: 'Boleto',
    origem: 'NF vinculada',
    emitente: 'Distribuidora Bebidas',
    descricao: 'Parcela 1 de 1 — NF 1029',
    vencimento: '2026-03-12',
    valorOriginal: 850.00,
    multa: 17.00, // 2%
    juros: 0.28, // 1 dia de atraso (0,033% ao dia)
    desconto: 0,
    status: 'Vencido',
    nfId: 'NF-002',
    codigoBarras: '03399.87361 54000.000000 00008.500101 2 90000000085000'
  },
  {
    id: 'CONTA-003',
    tipo: 'Fatura',
    origem: 'Fatura recorrente',
    emitente: 'Energia Elétrica',
    descricao: 'Energia elétrica — Março',
    vencimento: '2026-03-15',
    valorOriginal: 1120.00,
    multa: 0,
    juros: 0,
    desconto: 0,
    status: 'Em Aberto',
    codigoBarras: '83690000011 20000138000 00000000000 00000000000',
    recorrencia: 'Mensal'
  },
  {
    id: 'CONTA-004',
    tipo: 'Boleto',
    origem: 'Avulso',
    emitente: 'Internet Telecom',
    descricao: 'Mensalidade Internet',
    vencimento: '2026-03-14', // Vence amanhã (urgente)
    valorOriginal: 150.00,
    multa: 0,
    juros: 0,
    desconto: 0,
    status: 'Em Aberto',
    codigoPix: '00020126580014br.gov.bcb.pix0136123e4567-e89b-12d3-a456-4266554400005204000053039865405150.005802BR5916Internet Telecom6009Sao Paulo62070503***63041A2B'
  }
];

export const mockInsights: Insight[] = [
// ... existing mockInsights ...
  {
    id: 'INS-001',
    tipo: 'alerta',
    icone: 'AlertTriangle',
    texto: 'Esta semana você tem R$ 4.200 a pagar — 38% a mais que a semana passada (R$ 3.040).',
    prioridade: 'alta'
  },
  {
    id: 'INS-002',
    tipo: 'dica',
    icone: 'TrendingDown',
    texto: '2 boletos têm desconto se pagos até amanhã. Economia potencial: R$ 85,00.',
    prioridade: 'media'
  },
  {
    id: 'INS-003',
    tipo: 'info',
    icone: 'Info',
    texto: 'Distribuidora Frios Sul representa 42% dos seus gastos com insumos. Vale revisar o contrato.',
    prioridade: 'baixa'
  }
];

export const mockInsumos: Insumo[] = [
  {
    id: 'ins-001',
    nome: 'CARNE BOVINA PATINHO',
    categoria: 'Carnes',
    unidadeBase: 'kg',
    estoqueMinimo: 10,
    estoqueAtual: 12,
    custoAtual: 42.90,
    fornecedorPrincipal: 'Distribuidora Frios Sul',
    embalagemPadrao: 'PCT 2.5KG',
    consumoMedioDiario: 3.5,
    frequenciaMediaCompra: 7,
    pontoRePedido: 15,
    criadoEm: '2026-01-10',
    atualizadoEm: '2026-03-12',
    statusEstoque: 'critico',
    diasParaEsgotar: 3.4
  },
  {
    id: 'ins-002',
    nome: 'QUEIJO CHEDDAR',
    categoria: 'Frios & Laticínios',
    unidadeBase: 'pct',
    estoqueMinimo: 5,
    estoqueAtual: 6,
    custoAtual: 89.90,
    fornecedorPrincipal: 'Distribuidora Frios Sul',
    embalagemPadrao: 'PCT 2.5KG',
    consumoMedioDiario: 1.2,
    frequenciaMediaCompra: 10,
    pontoRePedido: 8,
    criadoEm: '2026-01-10',
    atualizadoEm: '2026-03-12',
    statusEstoque: 'baixo',
    diasParaEsgotar: 5
  },
  {
    id: 'ins-003',
    nome: 'BACON FATIADO',
    categoria: 'Carnes',
    unidadeBase: 'pct',
    estoqueMinimo: 3,
    estoqueAtual: 8,
    custoAtual: 42.50,
    fornecedorPrincipal: 'Distribuidora Frios Sul',
    embalagemPadrao: 'PCT 1KG',
    consumoMedioDiario: 0.8,
    frequenciaMediaCompra: 14,
    pontoRePedido: 5,
    criadoEm: '2026-01-10',
    atualizadoEm: '2026-03-12',
    statusEstoque: 'ok',
    diasParaEsgotar: 10
  },
  {
    id: 'ins-004',
    nome: 'PAO BRIOCHE HAMBURGUER',
    categoria: 'Pães & Massas',
    unidadeBase: 'cx',
    estoqueMinimo: 4,
    estoqueAtual: 5,
    custoAtual: 29.60,
    fornecedorPrincipal: 'Padaria Artesanal Norte',
    embalagemPadrao: 'CX 24UN',
    consumoMedioDiario: 1.5,
    frequenciaMediaCompra: 4,
    pontoRePedido: 6,
    criadoEm: '2026-01-10',
    atualizadoEm: '2026-03-12',
    statusEstoque: 'baixo',
    diasParaEsgotar: 3.3
  },
  {
    id: 'ins-005',
    nome: 'TOMATE',
    categoria: 'Vegetais',
    unidadeBase: 'kg',
    estoqueMinimo: 5,
    estoqueAtual: 7,
    custoAtual: 9.80,
    fornecedorPrincipal: 'Hortifrúti Bom Preço',
    embalagemPadrao: 'KG',
    consumoMedioDiario: 2,
    frequenciaMediaCompra: 3,
    pontoRePedido: 8,
    criadoEm: '2026-01-10',
    atualizadoEm: '2026-03-12',
    statusEstoque: 'atencao',
    diasParaEsgotar: 3.5
  },
  {
    id: 'ins-006',
    nome: 'ALFACE AMERICANA',
    categoria: 'Vegetais',
    unidadeBase: 'cx',
    estoqueMinimo: 2,
    estoqueAtual: 3,
    custoAtual: 7.00,
    fornecedorPrincipal: 'Hortifrúti Bom Preço',
    embalagemPadrao: 'CX 12UN',
    consumoMedioDiario: 0.5,
    frequenciaMediaCompra: 4,
    pontoRePedido: 3,
    criadoEm: '2026-01-10',
    atualizadoEm: '2026-03-12',
    statusEstoque: 'atencao',
    diasParaEsgotar: 6
  },
  {
    id: 'ins-007',
    nome: 'MOLHO SHOYU',
    categoria: 'Molhos & Condimentos',
    unidadeBase: 'ml',
    estoqueMinimo: 1000,
    estoqueAtual: 3500,
    custoAtual: 0.02,
    fornecedorPrincipal: 'Atacadão',
    embalagemPadrao: 'FR 500ML',
    consumoMedioDiario: 150,
    frequenciaMediaCompra: 30,
    pontoRePedido: 2000,
    criadoEm: '2026-01-10',
    atualizadoEm: '2026-03-12',
    statusEstoque: 'ok',
    diasParaEsgotar: 23
  },
  {
    id: 'ins-008',
    nome: 'BATATA PALHA',
    categoria: 'Outros',
    unidadeBase: 'pct',
    estoqueMinimo: 5,
    estoqueAtual: 12,
    custoAtual: 15.90,
    fornecedorPrincipal: 'Atacadão',
    embalagemPadrao: 'PCT 500G',
    consumoMedioDiario: 1,
    frequenciaMediaCompra: 15,
    pontoRePedido: 8,
    criadoEm: '2026-01-10',
    atualizadoEm: '2026-03-12',
    statusEstoque: 'ok',
    diasParaEsgotar: 12
  }
];

export const mockContagens: ContagemEstoque[] = [
  {
    id: 'cont-001',
    dataContagem: '2026-03-13T08:00:00Z',
    responsavel: 'Proprietário',
    status: 'finalizada',
    itens: [
      { id: 'ic-001', insumoId: 'ins-002', nomeInsumo: 'QUEIJO CHEDDAR', qtdAnterior: 8.2, qtdAtual: 6.8, diferenca: -1.4, tipoDiferenca: 'Consumo normal' },
      { id: 'ic-002', insumoId: 'ins-001', nomeInsumo: 'CARNE BOVINA PATINHO', qtdAnterior: 15, qtdAtual: 12, diferenca: -3, tipoDiferenca: 'Consumo normal' }
    ]
  },
  {
    id: 'cont-002',
    dataContagem: '2026-03-10T08:00:00Z',
    responsavel: 'Proprietário',
    status: 'finalizada',
    itens: [
      { id: 'ic-003', insumoId: 'ins-002', nomeInsumo: 'QUEIJO CHEDDAR', qtdAnterior: 5.0, qtdAtual: 8.2, diferenca: 3.2, tipoDiferenca: 'Entrada por NF' }
    ]
  }
];

export const mockListaCompras: ListaCompras[] = [
  {
    id: 'lc-001',
    semana: '12/03 a 18/03/2026',
    totalEstimado: 952.40,
    geradoEm: '2026-03-12T07:00:00Z',
    status: 'rascunho',
    fornecedores: [
      {
        nome: 'Distribuidora Frios Sul',
        totalEstimado: 712.00,
        itens: [
          { insumoId: 'ins-001', nome: 'CARNE BOVINA PATINHO', urgencia: 'critico', qtdSugerida: 12, unidade: 'kg', custoEstimado: 514.80, diasParaEsgotar: 1.5 },
          { insumoId: 'ins-002', nome: 'QUEIJO CHEDDAR', urgencia: 'baixo', qtdSugerida: 2, unidade: 'pct', custoEstimado: 179.80, diasParaEsgotar: 3 },
          { insumoId: 'ins-003', nome: 'BACON FATIADO', urgencia: 'atencao', qtdSugerida: 3, unidade: 'pct', custoEstimado: 127.50, diasParaEsgotar: 7 }
        ]
      },
      {
        nome: 'Padaria Artesanal Norte',
        totalEstimado: 148.00,
        itens: [
          { insumoId: 'ins-004', nome: 'PAO BRIOCHE HAMBURGUER', urgencia: 'baixo', qtdSugerida: 5, unidade: 'cx', custoEstimado: 148.00, diasParaEsgotar: 4 }
        ]
      },
      {
        nome: 'Hortifrúti Bom Preço',
        totalEstimado: 92.40,
        itens: [
          { insumoId: 'ins-005', nome: 'TOMATE', urgencia: 'atencao', qtdSugerida: 8, unidade: 'kg', custoEstimado: 78.40, diasParaEsgotar: 6 },
          { insumoId: 'ins-006', nome: 'ALFACE AMERICANA', urgencia: 'atencao', qtdSugerida: 2, unidade: 'cx', custoEstimado: 14.00, diasParaEsgotar: 5 }
        ]
      }
    ]
  }
];

export const mockInsightsEstoque: InsightEstoque[] = [
  {
    id: 'ie-001',
    tipo: 'alerta',
    prioridade: 'alta',
    icone: 'AlertTriangle',
    titulo: 'Consumo atípico',
    texto: 'O consumo de QUEIJO CHEDDAR foi 40% maior que o esperado nos últimos 3 dias.',
    insumoId: 'ins-002'
  },
  {
    id: 'ie-002',
    tipo: 'economia',
    prioridade: 'media',
    icone: 'TrendingDown',
    titulo: 'Oportunidade de economia',
    texto: 'O preço do TOMATE caiu 15% na última semana. Considere adiantar a compra.',
    insumoId: 'ins-005'
  },
  {
    id: 'ie-003',
    tipo: 'padrao',
    prioridade: 'info',
    icone: 'Info',
    titulo: 'Excesso de estoque',
    texto: 'Você tem BATATA PALHA suficiente para 12 dias. O ideal seria manter para 8 dias.',
    insumoId: 'ins-008'
  }
];

export const mockReceitas: Receita[] = [
  {
    id: 'rec-001',
    nome: 'Classic Burger',
    categoria: 'Hambúrgueres',
    rendimento: 1,
    tempoPreparoMinutos: 10,
    ingredientes: [
      { insumoId: 'ins-004', quantidade: 0.0416 }, // 1/24 cx
      { insumoId: 'ins-001', quantidade: 0.150 }, // 150g
      { insumoId: 'ins-002', quantidade: 0.02 }, // 2 fatias
      { insumoId: 'ins-003', quantidade: 0.03 }, // 30g
      { insumoId: 'ins-005', quantidade: 0.05 }, // 50g
      { insumoId: 'ins-006', quantidade: 0.02 }, // 1 folha
    ],
    modoPreparo: '1. Grelhe a carne por 3 min de cada lado.\n2. Adicione o queijo e abafe.\n3. Sele o pão na manteiga.\n4. Monte com alface e tomate na base.',
    criadoEm: '2026-02-01',
    atualizadoEm: '2026-03-10',
    fotoUrl: 'https://picsum.photos/seed/burger/400/300'
  }
];

export const mockFichasTecnicas: FichaTecnica[] = [
  {
    id: 'ft-001',
    receitaId: 'rec-001',
    canais: [
      {
        canal: 'Salão',
        precoVenda: 35.00,
        taxaCanalPercentual: 0,
        embalagens: [],
        custoIngredientes: 9.85,
        custoEmbalagens: 0.50,
        custoTotal: 10.35,
        valorTaxa: 0,
        lucroBruto: 24.65,
        margemLucro: 70.42,
        cmv: 29.57
      },
      {
        canal: 'iFood',
        precoVenda: 42.00,
        taxaCanalPercentual: 12,
        embalagens: [],
        custoIngredientes: 9.85,
        custoEmbalagens: 2.50,
        custoTotal: 12.35,
        valorTaxa: 5.04,
        lucroBruto: 24.61,
        margemLucro: 58.59,
        cmv: 29.40
      }
    ],
    insights: [
      {
        id: 'if-001',
        tipo: 'alerta',
        prioridade: 'alta',
        icone: 'AlertTriangle',
        titulo: 'CMV Alto no iFood',
        texto: 'O custo de embalagens no iFood está reduzindo sua margem. Considere repassar R$ 1,50 no preço ou buscar fornecedor mais barato para a caixa kraft.',
      },
      {
        id: 'if-002',
        tipo: 'economia',
        prioridade: 'media',
        icone: 'TrendingDown',
        titulo: 'Substituição de Ingrediente',
        texto: 'O preço do Bacon Fatiado subiu 12%. Trocar para Bacon em Peça (fatiar na loja) reduziria o CMV do Salão para 27%.',
      }
    ]
  }
];
