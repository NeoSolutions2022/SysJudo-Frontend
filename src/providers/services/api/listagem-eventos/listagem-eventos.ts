import api from "..";
import { IListagemEventos } from "../../../../models/listagem-eventos";

async function getListagemEventos(): Promise<IListagemEventos[]> {
  const response = await api.get("/registro-de-eventos");

  console.log(response.data); // Verifica a resposta completa no console
  
  // const last100Eventos = response.data.slice(-100);

  // return last100Eventos

  return response.data
}

getListagemEventos()

export const listagemEventosRoutes = {
  getListagemEventos,
};
