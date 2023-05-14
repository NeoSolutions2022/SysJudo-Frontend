import { parseCookies } from 'nookies';
import { decodeToken } from '../../utils/cryptography/jwt'
import { ContaUsuario } from '../../types';

export const getCurrentAccount = <T>(): ContaUsuario | undefined => {
  const { "judo-auth-token": accessToken } = parseCookies();
  if (accessToken) {
    const decodedToken = decodeToken<T>(accessToken)
    console.log(decodedToken)

    return decodedToken as ContaUsuario | undefined
  }
}
