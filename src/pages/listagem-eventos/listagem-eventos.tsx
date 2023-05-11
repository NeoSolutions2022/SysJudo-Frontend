import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Box, Container, Grid } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  ptBR,
} from "@mui/x-data-grid";
import { ModalFilterAgremiacao } from "../../components/Modal/Agremiacao/modalFilterAgremiacao";
import { ModalExportarAgremiacao } from "../../components/Modal/Agremiacao/Exportar";
import { useFormikProvider } from "../../hooks/useFormikProvider";
import { Home } from "../Home";
import { StyledButton as Button } from "../../components/Button";
import { parseISO, format } from "date-fns";
import { Loading } from "../../components/Loading/Loading";
import { listagemEventosRoutes } from "../../providers/services/api/listagem-eventos/listagem-eventos";


export function ListagemEventos() {
  document.title = "Listagem de Agremiação";
  const navigate = useNavigate();
  const {
    setSelectedRowsAgremiacao,
    selectedRowsAgremiacao,
    isFilterLoading,
  } = useFormikProvider();
  const { data } = useQuery(
    ["eventos-list"],
    listagemEventosRoutes.getListagemEventos
  );

  const last100Eventos = data ? data.slice(-100) : [];

  const [valueTab, setValueTab] = useState(0);

  const TabPanel = (props: any) => {
    const { children, value, index, ...other } = props;

    return value === index ? <Box>{children}</Box> : null;
  };

  function handleDateFormat(dateString: string) {
    const date = parseISO(dateString);
    if (date.toString() == "Invalid Date") return "";
    return format(date, "dd/MM/yyyy");
  }

  function extrairHorario(data: string) {
    const dateTime = new Date(data);
    const horario = dateTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    console.log(horario);
    return horario;
  }

  function formatarDataHora(dataHora: string) {
    const data = new Date(dataHora);
    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const ano = data.getFullYear();
    const horas = String(data.getHours()).padStart(2, "0");
    const minutos = String(data.getMinutes()).padStart(2, "0");
    const segundos = String(data.getSeconds()).padStart(2, "0");
    return `${dia}/${mes}/${ano} \u00A0 ${horas}:${minutos}:${segundos}`;
  }

  const columns: GridColDef[] = [
    {
      field: "descricao",
      headerName: "Descrição",
    
      minWidth: 50,
      maxWidth: 450,
      flex: 1,
    },
    {
      field: "dataHoraEvento",
      resizable: true,
      headerName: "Data/Hora",
      width: 250,
      valueFormatter: (item) =>
        item.value ? formatarDataHora(item?.value) : "",
    },

    {
      field: "computadorId",
      headerName: "Computador ID",
      width: 150,
      resizable: true,
    },
    {
      field: "clienteId",
      headerName: "Cliente ID",
      resizable: true,
      width: 150,
    },
    { field: "tipoOperacaoId", headerName: "Tipo de Operação", width: 150 },
    { field: "usuarioId", headerName: "Usuário ID", width: 150 },
    { field: "funcaoMenuId", headerName: "Função Menu ID", width: 150 },
  ];

  function handleSelectionModelChange(selection: any) {
    setSelectedRowsAgremiacao(selection);
  }

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <Container maxWidth={false}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <TabPanel value={valueTab} index={2}>
              <Home />
            </TabPanel>
            <TabPanel value={valueTab} index={0}>
              <Box
                sx={{
                  width: "100%",
                  backgroundColor: "#FFF",
                  height: {
                    xs: "40vh",
                    sm: "50vh",
                    md: "70vh",
                    lg: "65vh",
                    xl: "83vh",
                  },
                  flexGrow: 2,
                  position: "relative",
                  zIndex: 2,
                }}
              >
                {isFilterLoading ? (
                  <Loading />
                ) : data ? (
                  <DataGrid
                    rows={last100Eventos}
                    columns={columns}
                    disableSelectionOnClick
                    disableColumnMenu
                    hideFooterPagination
                    hideFooterSelectedRowCount
                    density="compact"
                    rowsPerPageOptions={[25]}
                    localeText={{
                      ...ptBR.components.MuiDataGrid.defaultProps.localeText,
                    }}
                    componentsProps={{
                      toolbar: {
                        disableMultipleActions: false,
                      },
                      baseTooltip: {
                        style: { color: "#4887C8", fontWeight: "bold" },
                      },
                      footer: {
                        sx: {
                          color: "#4887C8",
                          fontWeight: "bold",
                          position: "fixed",
                          bottom: 0,
                        },
                      },
                    }}
                    experimentalFeatures={{ newEditingApi: true }}
                    style={{
                      height: "100%",
                    }}
                    onSelectionModelChange={handleSelectionModelChange}
                    selectionModel={selectedRowsAgremiacao}
                  />
                ) : (
                  <Loading />
                )}
              </Box>
              <Box
                sx={{
                  backgroundColor: "#F5F5F5",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  py: "6px",
                  pl: 3,
                  gap: "1rem",
                  maxHeight: "8vh",
                  position: "absolute",
                  width: "100%",
                  left: 0,
                  bottom: 0,
                }}
              >
                <Box
                  sx={{
                    height: "100%",
                    display: "flex",
                    gap: 2,
                    color: "#4887C8",
                    fontWeight: "bold",
                  }}
                >
                  <p>
                    Total de ações: {data == undefined ? "..." : data.length}
                  </p>
                  <p
                    style={{
                      borderLeft:
                        selectedRowsAgremiacao.length > 0
                          ? "2px solid #ccc"
                          : "1px solid #ccc",
                      height: "100%",
                      paddingLeft: 10,
                    }}
                  >
                    {selectedRowsAgremiacao.length > 0
                      ? selectedRowsAgremiacao.length == 1
                        ? selectedRowsAgremiacao.length + " linha selecionada"
                        : selectedRowsAgremiacao.length + " linhas selecionadas"
                      : ""}
                  </p>
                </Box>
                <Box
                  sx={{
                    height: "100%",
                    display: "flex",
                    justifyContent: "right",
                    flexDirection: "row",
                    width: "900px",
                    gap: 3,
                    color: "#4887C8",
                    fontWeight: "bold",
                  }}
                >
                  <Button
                    sx={{ marginRight: 3 }}
                    onClick={() => navigate("/agremiacao")}
                  >
                    Voltar
                  </Button>
                </Box>
              </Box>
              <ModalFilterAgremiacao />
              <ModalExportarAgremiacao />
              {/* <BackdropComponent open={isLoading} /> */}
            </TabPanel>
            <TabPanel value={valueTab} index={1}></TabPanel>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
