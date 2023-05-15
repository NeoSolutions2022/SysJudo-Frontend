export type Permissao = {
  id: number
  nome: string
  descricao: string
  categoria: string
}

export enum PermissaoTipo {
  Leitura = 'R',
  Escrita = 'W',
  Remocao = 'D',
  LeituraEscrita = 'RW',
  LeituraRemocao = 'RD',
  EscritaRemocao = 'WD',
  AcessoCompleto = 'RWD'
}

export enum PermissaoPrefix {
  Leitura = 'read',
  Escrita = 'write',
  Remocao = 'delete'
}
