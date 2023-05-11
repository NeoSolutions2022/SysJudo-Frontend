import { Operator, LogicOperator, OperatorDate } from "../types/Filters/Agremiacao/operator";
import { InitialParentheses, FinalParentheses } from "../types/Filters/Agremiacao/parentheses";

interface GrupoAcessolocation{
  id: 0,
  sigla: string,
  descricao: string,
}
export interface IGrupoAcesso {
  nome: string;
  descricao: string;
  id?: string
}

export interface IFiltersGrupoAcesso {
  initialParentheses: InitialParentheses | "";
  column: string;
  firstValue: string;
  operator: Operator | OperatorDate | "";
  secondValue: string;
  finalParentheses: FinalParentheses | "";
  logicOperator: LogicOperator | "";
}

type GrupoAcessoHeaderType = Array<{ value: string, label: string }>;

type GrupoAcessoParenthesesType = {
  initial: Array<{ value: InitialParentheses, label: InitialParentheses }>;
  final: Array<{ value: FinalParentheses, label: FinalParentheses }>;
};

type GrupoAcessoOperatorType = {
  operator: Array<{ value: Operator, label: Operator }>
  operatorData: Array<{ value: Operator, label: Operator }>
  logicOperator: Array<{ value: LogicOperator, label: LogicOperator | 'vazio' }>;
};

const GrupoAcessoHeaderValues: GrupoAcessoHeaderType = [
  { value: 'Nome', label: 'Nome' },
  { value: 'Descricao', label: 'Descricao' },
  { value: 'permissao', label: 'Responsável' },
  { value: 'Representante', label: 'Representante' },
  { value: 'DataFiliacao', label: 'Data Filiação' },
]

const GrupoAcessoParenthesesValues: GrupoAcessoParenthesesType = {
  initial: [
    { value: '(', label: '(' },
    { value: '((', label: '((' },
    { value: '(((', label: '(((' },
  ],
  final: [
    { value: ')', label: ')' },
    { value: '))', label: '))' },
    { value: ')))', label: ')))' },
  ],
}

const GrupoAcessoOperatorsValues: GrupoAcessoOperatorType = {
  operator: [
    { value: 'CONTEM', label: 'CONTEM' },
    { value: '=', label: '=' },
    { value: '#', label: '#' },
    { value: '<', label: '<' },
    { value: '<=', label: '<=' },
    { value: '>', label: '>' },
    { value: '>=', label: '>=' },
    { value: 'ENTRE', label: 'ENTRE' },
  ],
  operatorData: [
    { value: '=', label: '=' },
    { value: '#', label: '#' },
    { value: '<', label: '<' },
    { value: '<=', label: '<=' },
    { value: '>', label: '>' },
    { value: '>=', label: '>=' },
    { value: 'ENTRE', label: 'ENTRE' },
  ],

  logicOperator: [
    { value: '', label: 'vazio' },
    { value: 'E', label: 'E' },
    { value: 'OU', label: 'OU' },
  ],
}


const GrupoAcessoExportValues = [
  { value: 'Nome', label: 'Nome' },
  { value: 'Descricao', label: 'Descrição' },
  { value: 'Administrador', label: 'Administrador' },
  { value: 'Desativado', label: 'Desativado' },
  { value: 'Permissoes', label: 'Permissões' },
]

export const GrupoAcessoExportInitialValues = {
  Nome: false,
  Descricao: false,
  Administrador: false,
  Desativado: false,
  Permissoes: false
}

export const GrupoAcessoOptions = {
  GrupoAcessoHeaderValues,
  GrupoAcessoParenthesesValues,
  GrupoAcessoOperatorsValues,
  GrupoAcessoExportValues,
  GrupoAcessoExportInitialValues
};