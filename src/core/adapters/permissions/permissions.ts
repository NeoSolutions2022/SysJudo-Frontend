import { getCurrentAccount } from '..'
import { PermissaoPrefix, PermissaoTipo } from './permissao'

export enum Permissions {
  // Módulo Outros
  ReadPaginaInicial = 'read:pagina-inicial',
  WritePaginaInicial = 'write:pagina-inicial',
  DeletePaginaInicial = 'delete:pagina-inicial',

  ReadConfiguracoesUsuario = 'read:configuracoes-conta',
  WriteConfiguracoesUsuario = 'write:configuracoes-conta',
  DeleteConfiguracoesUsuario = 'delete:configuracoes-conta',

  // Módulo Administração

  ReadAgremiacao = 'write:consultar-agremiacao',
  ListAgremiacao = 'write:consultar-agremiacao',
  WriteAgremiacao = 'write:incluir-agremiacao',
  AnotarAgremiacao = 'write:anotar-agremiacao',
  PutAgremiacao = 'write:alterar-agremiacao',
  DeleteAgremiacao = 'write:excluir-agremiacao',
  ExportAgremiacao = 'write:exportar-agremiacao',
  FiltrarAgremiacao = 'write:filtrar-agremiacao',
  PesquisarAgremiacao = 'write:pesquisar-agremiacao',
  EnviarDocumentoAgremiacao = 'write:anexar-agremiacao',
  RemoverDocumentoAgremiacao = 'write:remover-documento-agremiacao',
  ReadDocumentoAgremiacao = 'write:ver-anexo-agremiacao',

  ReadRegistroEventos = 'read:registro-eventos',
  WriteRegistroEventos = 'write:registro-eventos',
  DeleteRegistroEventos = 'delete:registro-eventos',

  ReadGrupoAcesso = 'read:grupo-acesso',
  WriteGrupoAcesso = 'write:grupo-acesso',
  DeleteGrupoAcesso = 'delete:grupo-acesso',

}
// marcar-agremiacao:w
// todas-agremiacao:w


export const getPermissions = () => {
  const currentAccount = getCurrentAccount()

  if (currentAccount) {
    const accountPermissions = currentAccount.permissoes.filter(
      permission => !permission.includes('-API')
    )

    return accountPermissions.reduce((previous: string[], current) => {
      const [permissaoNome, permissaoTipo] = current.split(':')
      const permissoes = permissaoTipo
        .split('')
        .map(permissionLetter => {
          const prefix = getPermissaoPrefix(permissionLetter as PermissaoTipo)
          return `${prefix}:${permissaoNome}`
        })
      return [...previous, ...permissoes]
    }, [])
  }

  return []
}

export const getPermissaoPrefix = (permissaoTipo: PermissaoTipo): PermissaoPrefix | undefined => {
  switch (permissaoTipo) {
    case PermissaoTipo.Leitura:
      return PermissaoPrefix.Leitura
    case PermissaoTipo.Escrita:
      return PermissaoPrefix.Escrita
    case PermissaoTipo.Remocao:
      return PermissaoPrefix.Remocao
  }
}
