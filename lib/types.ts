export type NFStatus = 'Em Aberto' | 'Em Pgto' | 'Paga' | 'Vencida' | 'Cancelada';

export interface NFItem {
  id: string;
  numero: string;
  dataEmissao: string;
  emitente: string;
  cnpj: string;
  valor: number;
  status: NFStatus;
  itens: Array<{
    descricao: string;
    nomePadronizado: string;
    unidade: string;
    qtd: number;
    custoUnitario: number;
  }>;
  boletos: Array<{
    id: string;
    parcela: string;
    vencimento: string;
    valor: number;
    status: 'Em Aberto' | 'Pago' | 'Vencido' | 'Cancelado';
    codigoBarras: string;
  }>;
  observacoes?: string;
  arquivoUrl?: string;
}

export type ContaStatus = 'Em Aberto' | 'Pago' | 'Vencido' | 'Cancelado';
export type ContaTipo = 'Boleto' | 'Fatura' | 'Parcela';

export interface ContaAPagar {
  id: string;
  tipo: ContaTipo;
  origem: string; // NF vinculada / Fatura recorrente / Avulso
  emitente: string;
  descricao: string;
  vencimento: string;
  valorOriginal: number;
  multa: number;
  juros: number;
  desconto: number;
  status: ContaStatus;
  dataPagamento?: string;
  nfId?: string;
  codigoBarras?: string;
  codigoPix?: string;
  observacoes?: string;
  recorrencia?: string;
}

export interface Insight {
  id: string;
  tipo: 'alerta' | 'info' | 'dica' | 'alta';
  icone: string;
  texto: string;
  prioridade: 'alta' | 'media' | 'baixa';
}

// --- Módulo de Estoque ---

export type CategoriaInsumo = 'Carnes' | 'Frios & Laticínios' | 'Pães & Massas' | 'Vegetais' | 'Molhos & Condimentos' | 'Bebidas' | 'Descartáveis' | 'Outros';
export type StatusEstoque = 'critico' | 'baixo' | 'atencao' | 'ok';

export interface Insumo {
  id: string;
  nome: string;
  categoria: CategoriaInsumo;
  unidadeBase: string; // g, ml, un
  estoqueMinimo: number;
  estoqueAtual: number;
  custoAtual: number; // Por unidade base
  fornecedorPrincipal: string;
  fornecedoresAlternativos?: string[];
  frequenciaMediaCompra?: number; // em dias
  proximaCompraEstimada?: string; // data
  usoPerHamburguer?: number;
  consumoMedioDiario?: number;
  pontoRePedido?: number;
  embalagemPadrao?: string; // ex: PCT 2.5KG
  observacoes?: string;
  criadoEm: string;
  atualizadoEm: string;
  statusEstoque: StatusEstoque;
  diasParaEsgotar?: number;
}

export interface ItemContagem {
  id: string;
  insumoId: string;
  nomeInsumo: string;
  qtdAnterior: number;
  qtdAtual: number;
  diferenca: number;
  tipoDiferenca?: 'Entrada por NF' | 'Consumo normal' | 'Perda';
  observacao?: string;
}

export interface ContagemEstoque {
  id: string;
  dataContagem: string;
  responsavel: string;
  observacao?: string;
  status: 'rascunho' | 'finalizada';
  itens: ItemContagem[];
}

export interface ItemListaCompras {
  insumoId: string;
  nome: string;
  urgencia: 'critico' | 'baixo' | 'atencao' | 'ok';
  qtdSugerida: number;
  unidade: string;
  custoEstimado: number;
  diasParaEsgotar?: number;
  motivo?: string;
}

export interface FornecedorLista {
  nome: string;
  totalEstimado: number;
  itens: ItemListaCompras[];
}

export interface ListaCompras {
  id: string;
  semana: string;
  totalEstimado: number;
  geradoEm: string;
  status: 'rascunho' | 'confirmada';
  fornecedores: FornecedorLista[];
  insights?: Insight[];
}

export interface InsightEstoque {
  id: string;
  tipo: 'alerta' | 'economia' | 'padrao' | 'comparacao' | 'dica';
  prioridade: 'alta' | 'media' | 'info';
  icone: string;
  titulo: string;
  texto: string;
  insumoId?: string;
}

// --- Módulo de Receitas e Ficha Técnica ---

export type CanalVenda = 'Salão' | 'Delivery Próprio' | 'iFood' | 'Retirada';

export interface IngredienteReceita {
  insumoId: string;
  quantidade: number; // na unidade base do insumo
}

export interface Receita {
  id: string;
  nome: string;
  categoria: 'Hambúrgueres' | 'Porções' | 'Bebidas' | 'Sobremesas' | 'Outros';
  rendimento: number; // ex: 1 porção
  tempoPreparoMinutos: number;
  ingredientes: IngredienteReceita[];
  modoPreparo?: string;
  criadoEm: string;
  atualizadoEm: string;
  fotoUrl?: string;
}

export interface CustoCanal {
  canal: CanalVenda;
  precoVenda: number;
  taxaCanalPercentual: number; // ex: 12 para 12% do iFood
  embalagens: IngredienteReceita[]; // Insumos específicos para este canal (caixa, sacola, lacre)
  
  // Calculados
  custoIngredientes: number;
  custoEmbalagens: number;
  custoTotal: number; // ingredientes + embalagens
  valorTaxa: number; // precoVenda * (taxaCanalPercentual / 100)
  lucroBruto: number; // precoVenda - custoTotal - valorTaxa
  margemLucro: number; // (lucroBruto / precoVenda) * 100
  cmv: number; // (custoTotal / precoVenda) * 100
}

export interface FichaTecnica {
  id: string;
  receitaId: string;
  canais: CustoCanal[];
  insights: InsightEstoque[]; // Reutilizando a estrutura de insight
}
