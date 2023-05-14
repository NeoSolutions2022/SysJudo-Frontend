import jwt_decode from 'jwt-decode'

export const decodeToken = <T>(token: string): T => {
  const decodedToken = jwt_decode(token)
  return decodedToken as T
}
