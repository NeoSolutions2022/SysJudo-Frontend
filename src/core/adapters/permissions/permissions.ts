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

  ReadAgremiacao = 'read:ver-agremiacao',
  ListAgremiacao = 'read:listar-agremiacao',
  WriteAgremiacao = 'write:add-agremiacao',
  AnotarAgremiacao = 'write:anotar-agremiacao',
  PutAgremiacao = 'write:put-agremiacao',
  DeleteAgremiacao = 'delete:remover-agremiacao',
  ExportAgremiacao = 'read:exportar-agremiacao',
  FiltrarAgremiacao = 'read:filtrar-agremiacao',
  PesquisarAgremiacao = 'read:pesquisar-agremiacao',
  EnviarDocumentoAgremiacao = 'write:enviar-documento-agremiacao',
  RemoverDocumentoAgremiacao = 'write:remover-documento-agremiacao',

  ReadRegistroEventos = 'read:registro-eventos',
  WriteRegistroEventos = 'write:registro-eventos',
  DeleteRegistroEventos = 'delete:registro-eventos',

  ReadGrupoAcesso = 'read:grupo-acesso',
  WriteGrupoAcesso = 'write:grupo-acesso',
  DeleteGrupoAcesso = 'delete:grupo-acesso',

}

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
