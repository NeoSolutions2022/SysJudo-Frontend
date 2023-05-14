import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Router from "./Routes";
import { AuthProvider } from "./providers/context/AuthContext";
import { ModalProvider } from "./providers/context/ModalContext";
import { AlertProvider } from "./providers/context/AlertContext";
import { FormikProvider } from "./providers/context/FormikContext";

import { AlertComponent } from "./components/Alert";
import { GrupoAcessoProvider } from "./providers/context/GrupoAcessoContext";
import { getPermissions } from './core/adapters';

const queryClient = new QueryClient();


export default function App() {
  return (
    <AuthProvider getPermissions={getPermissions}>
      <QueryClientProvider client={queryClient}>
        <GrupoAcessoProvider>
          <FormikProvider>
            <AlertProvider>
              <ModalProvider>
                <AlertComponent />
                <Router />
              </ModalProvider>
            </AlertProvider>
          </FormikProvider>
        </GrupoAcessoProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}
