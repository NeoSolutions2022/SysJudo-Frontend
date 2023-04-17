import { useState } from "react";
import { IAgremiacao } from "../../../../models/AgremiacaoModel";
import type { Page } from "../../../../types/page";

import api from "..";
import { format, parse, parseISO } from "date-fns";
async function getAgremiacoes(filters?: any): Promise<Page<IAgremiacao>> {
  const response = await api.get(
    "/gerencia/agremiacao?Pagina=1&TamanhoPagina=64",
    { params: filters }
  );

  return response.data;
}
async function postClearFilters() {
  api.post("/gerencia/agremiacao/limpar-filtro");
}

async function postAgremiacaoFilter(payload: any): Promise<IAgremiacao[]> {
  console.log(payload);
  const response = await api.post(
    "/gerencia/agremiacao/filtrar/agremiacao",
    payload
  );
  console.log(response.data);
  return response.data;
}

async function getAgremiacao(id: number) {
  const response = await api.get(`/gerencia/agremiacao/${id}`);

  return response.data;
}

function handleDateFormat(dateString: string) {
  if (/^[0-9]*$/.test(dateString)) {
    console.log("aaaa");
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

async function pesquisarAgremiacao(payload: string) {
  const searchedItem = handleDateFormat(payload);
  const response = await api.get(
    `/gerencia/agremiacao/pesquisar-${searchedItem}`
  );
  console.log(response.data);
  return response.data;
}

async function createAgremiacao(payload: IAgremiacao): Promise<IAgremiacao> {
  const formData = new FormData();
  Object.keys(payload).forEach((key) => {
    // To pegando cada propriedade e mandando pro formData
    if (key == "Documentos")
      payload[key].map((item) => formData.append(key, item));
    //@ts-ignore
    else formData.append(key, payload[key]);
  });
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };

  const response = await api.post("gerencia/agremiacao", formData, config);

  return response.data;
}

async function updateAgremiacao(payload: IAgremiacao): Promise<IAgremiacao> {
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };

  const response = await api.put(
    `/gerencia/agremiacao/${payload.id}`,
    payload,
    config
  );

  return response.data;
}

type AnotacaoObject = {
  anotacoes: string;
};

async function anotacoesAgremiacao(
  id: number,
  anotacao: string
): Promise<void> {
  const response = await api.patch(`/gerencia/agremiacao/${id}`, anotacao);

  return response.data;
}

async function deleteAgremiacao(id: number): Promise<void> {
  const response = await api.delete(`/gerencia/agremiacao/${id}`);

  return response.data;
}

async function exportarAgremiacao(payload: any): Promise<any> {
  const response = await api.get("/gerencia/agremiacao/exportar", {
    params: payload,
  });

  return response.data;
}

async function anexarArquivoAgremiacao(
  id: number,
  payload: File[]
): Promise<any> {
  const formData = new FormData();
  payload.map((item) => {
    formData.append("Documentos", item);
  });
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };
  const response = await api.patch(
    `/gerencia/agremiacao/${id}/enviardocumentos`,
    formData,
    config
  );

  console.log(response);
  return response.data;
}

async function deleteArquivoAgremiacao(
  documentoId: number,
  id: number
  ): Promise<void> {
    
  const response = await api.patch(
    `/gerencia/agremiacao/${id}/removerdocumentos?documentoId=${documentoId}`,
    {id, documentoId}
  );


  console.log(response);

  return response.data;
}

export const agremiacaoRoutes = {
  getAgremiacoes,
  postAgremiacaoFilter,
  getAgremiacao,
  createAgremiacao,
  updateAgremiacao,
  deleteAgremiacao,
  anotacoesAgremiacao,
  exportarAgremiacao,
  anexarArquivoAgremiacao,
  deleteArquivoAgremiacao,
  postClearFilters,
  pesquisarAgremiacao,
};
