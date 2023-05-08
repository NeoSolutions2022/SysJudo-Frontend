import api from "..";
import { IListagemEventos } from "../../../../models/listagem-eventos";

async function getListagemEventos(): Promise<IListagemEventos[]> {
  const response = await api.get("/registro-de-eventos");

  console.log(response)

  return response.data
}

getListagemEventos()

export const listagemEventosRoutes = {
  getListagemEventos,
};
