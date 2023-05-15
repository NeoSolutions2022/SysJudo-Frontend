export type CommonUsuarioClaims = {
  nameid: number
  unique_name: string
  email: string
  nbf: number
  exp: number
  iat: number
  iss: string
  aud: string
}

export type ContaUsuario = CommonUsuarioClaims & {
  permissoes: string[]
}