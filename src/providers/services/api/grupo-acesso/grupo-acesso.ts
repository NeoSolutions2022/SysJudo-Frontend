import { useState } from "react";
import { IGrupoAcesso } from "../../../../models/GrupoAcessoModel";
import type { Page } from "../../../../types/page";

import api from "..";
import { format, parse, parseISO } from "date-fns";
async function getAllGrupoAcesso(filters?: any): Promise<Page<IGrupoAcesso>> {
  const response = await api.get(
    "/grupos-acesso?Pagina=1&TamanhoPagina=64&Desativado=false",
    { params: filters }
  );

  return response.data;
}

async function postGrupoAcessoFilter(payload: any): Promise<IGrupoAcesso[]> {
  console.log(payload);
  const response = await api.post(
    "/grupos-acesso/filtrar/grupo-acesso",
    payload
  );
  console.log(response.data);
  return response.data;
}

async function getGrupoAcesso(id: string) {
  const response = await api.get(`/grupos-acesso/${id}`);

  return response.data;
}

function handleDateFormat(dateString: string) {
  if (/^[0-9]*$/.test(dateString)) {
    // Se a string contiver apenas dígitos, retorna false imediatamente
    return dateString;
  } else {
    if (/^[a-z]+$/i.test(dateString)) {
      return dateString;
    } else {
      console.log(parse(dateString, "dd/MM/yyyy", new Date()));
      const date = parse(dateString, "dd/MM/yyyy", new Date());
      if (date.toString() == "Invalid Date")
        return dateString.replace(/\//g, "");
      else {
        const formattedDate = format(date, "yyyy-MM-dd");

        return formattedDate == "Invalid Date" ? dateString : formattedDate;
      }
    }
  }
}

async function pesquisarGrupoAcesso(payload: string) {
  const searchedItem = handleDateFormat(payload);
  const response = await api.get(
    `/grupos-acesso/pesquisar-${searchedItem}`
  );
  console.log(response.data);
  return response.data;
}

async function createGrupoAcesso(payload: IGrupoAcesso): Promise<IGrupoAcesso> {
  const response = await api.post("/grupos-acesso", payload);
  return response.data;
}

async function updateGrupoAcesso(payload: IGrupoAcesso, id: string): Promise<IGrupoAcesso> {
  const response = await api.put(
    `/grupos-acesso/${payload.id}`,
    payload
  );

  return response.data;
}

async function deleteGrupoAcesso(id: string): Promise<void> {
  const response = await api.delete(`/grupos-acesso/${id}`);

  return response.data;
}


interface Ipermissao{
   id: string, 
   nome: string, 
   descricao: string, 
   categoria: string ,
}

async function postClearFilters() {
  api.post("/grupos-acesso/limpar-grupo-acesso");
}

async function getPermissoes() : Promise<Ipermissao[]> {
  console.log('oi')
  const response = await api.get(
    "permissao",
  );
    console.log(response)
  return response.data.itens;
}

async function exportarGrupoAcesso(payload: any): Promise<any> {
  const response = await api.get("/grupos-acesso/exportar", {
    params: payload,
  });

  return response.data;
}

export const GrupoAcessoRoutes = {
  getAllGrupoAcesso,
  postGrupoAcessoFilter,
  getGrupoAcesso,
  createGrupoAcesso,
  updateGrupoAcesso,
  deleteGrupoAcesso,
  postClearFilters,
  pesquisarGrupoAcesso,
  getPermissoes,
  exportarGrupoAcesso
};
