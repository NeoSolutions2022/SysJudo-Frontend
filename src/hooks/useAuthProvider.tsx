import { useContext } from 'react';
import { AuthContext } from '../providers/context/AuthContext';

export function useAuthContext() {
  const context = useContext(AuthContext);

  const {
    isAuthenticated,
    user,
    signIn,
    signInAdmin,
    logout,
    registerAgremiacao,
    verifyToken,
    allows
  } = context;

  return {
    isAuthenticated,
    user,
    signIn,
    signInAdmin,
    logout,
    registerAgremiacao,
    verifyToken,
    allows
  };
};