import { useState, useEffect, createContext, ReactNode } from "react";
import { setCookie, parseCookies, destroyCookie } from "nookies";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { Permissions } from '../../core/adapters/permissions/permissions';

interface SignInProps {
  email: string;
  senha: string;
  ip?: string | null;
}

interface AuthContextData {
  user: string | null;
  isAuthenticated: boolean;
  signIn: ({ email, senha }: SignInProps) => Promise<any>;
  signInAdmin:  ({ email, senha }: SignInProps) => Promise<any>;
  logout: () => void;
  registerAgremiacao?: (values: any) => Promise<any>;
  verifyToken: () => void;
  allows: (perms: Permissions | Permissions[]) => boolean;
}

interface AuthProviderProps {
  getPermissions: () => string[]
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children, getPermissions }: AuthProviderProps) {
  const { "judo-auth-token": authToken } = parseCookies();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const isAuthenticated = !!user;
  async function logout() {
    destroyCookie(undefined, "judo-auth-token");
    setUser(null);
    navigate("/login", { replace: true });
  }
  async function verifyToken() {
    const { "judo-auth-token": authToken } = parseCookies();
    if (!authToken) {
      logout();
    }
  }

  useEffect(() => {
    verifyToken();
    // if (token) {
    //   api.get('/me').then((response) => {
    //     setUser(response.data);
    //   }).catch(() => {
    //     destroyCookie(undefined, 'judo-auth-token');
    //     navigate('/login', { replace: true });
    //   });
    // 
  }, []);

  async function signIn({ email, senha, ip }: SignInProps) {
    try {
      const response = await api.post("administrador/usuario-auth/login", {
        email,
        senha,
        ip
      });

      const { token, id } = response.data;

      const currentTime = new Date();
      currentTime.setHours(currentTime.getHours() + 3);
      const expireDate = currentTime;

      setCookie(undefined, "judo-auth-token", token, {
        maxAge: 60 * 60 * 2, // 2 hour
      });

      setUser(response.data);

      api.defaults.headers.Authorization = `Bearer ${token}`;

      return response;
    } catch (err) {
      console.log(err);
    }

    return false;
  }

  const permissions = getPermissions()
  const allows = (perms: Permissions | Permissions[]) => {
    if (Array.isArray(perms)) {
      return perms.every(perm => permissions.includes(perm))
    }

    return permissions.includes(perms)
  }
  

  async function signInAdmin({ email, senha, ip }: SignInProps) {
    try {
      const response = await api.post("administrador/auth", {
        email,
        senha,
        ip
      });

      const { token, id } = response.data;

      const currentTime = new Date();
      currentTime.setHours(currentTime.getHours() + 3);
      const expireDate = currentTime;

      setCookie(undefined, "judo-auth-token", token, {
        maxAge: 60 * 60 * 2, // 2 hour
      });

      setUser(response.data);

      api.defaults.headers.Authorization = `Bearer ${token}`;

      return response;
    } catch (err) {
      console.log(err);
    }

    return false;
  }

  async function registerAgremiacao(values: any) {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    try {
      const response = await api.post("gerencia/agremiacao", values, config);
      return response.data;
    } catch (err) {
      console.log(err);
    }

    return false;
  }

  // async function getAdmUserInfo (id: string) {
  //   try {
  //     const response = await api.get(`administrador/usuario/${id}`);
  //     return response.data;
  //   } catch (err) {
  //     console.log(err);
  //   }

  //   return false;
  // }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, signIn, signInAdmin, logout, user, verifyToken, allows }}
    >
      {children}
    </AuthContext.Provider>
  );
}
