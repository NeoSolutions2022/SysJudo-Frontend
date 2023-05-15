import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Box, Container, Grid } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridValueGetterParams,
  ptBR,
} from "@mui/x-data-grid";
import {
  AddOutlined,
  CreateOutlined as EditIcon,
  FilterAlt,
  UploadFile,
} from "@mui/icons-material";
import {
  Search,
  FilterAltOffOutlined as FilterIcon,
} from "@mui/icons-material";
import { TextField } from "../../components/Form/TextAreaComponent/TextAreaComponent";
import { ModalGrupoAcesso } from "../../components/Modal/GrupoAcesso/modalFilterGrupoAcesso";
import { ModalExportarAgremiacao } from "../../components/Modal/Agremiacao/Exportar";
import { useModal } from "../../hooks/useModalProvider";
import { useFormikProvider } from "../../hooks/useFormikProvider";
import { Home } from "../Home";
import { StyledButton as Button } from "../../components/Button";
import parse from "html-react-parser";
import { parseISO, format } from "date-fns";
import { Loading } from "../../components/Loading/Loading";
import { useGrupoAcessoProvider } from '../../hooks/useGrupoAcessoProvider';
import { GrupoAcessoRoutes } from '../../providers/services/api/grupo-acesso/grupo-acesso';
import { ModalExportarGrupoAcesso } from '../../components/Modal/GrupoAcesso/ExportarGrupoAcesso';

export function ListagemGrupoAcessos() {
  document.title = "Grupo de Acessos";
  const navigate = useNavigate();
  const { handleClickOpen } = useModal();
  const {
    valuesFiltered,
    setValuesFiltered,
    setSelectedRowsAgremiacao,
    selectedRowsAgremiacao,
    setFiltersAgremiacao,
    filterWithZeroReturn,
    isFilterLoading,
    setIsFilterLoading,
  } = useGrupoAcessoProvider();
  const { data } = useQuery(
    ["grupo-acesso-list"],
    GrupoAcessoRoutes.getAllGrupoAcesso
  );

  const [valueTab, setValueTab] = useState(0);

  const TabPanel = (props: any) => {
    const { children, value, index, ...other } = props;

    return value === index ? <Box>{children}</Box> : null;
  };

  const [searchedValue, setSearchedValue] = useState("");
  const [isTextFieldVisible, setIsTextFieldVisible] = useState(false);

  function handleSearchBlur() {
    setIsTextFieldVisible(true);
  }
  function handleSearchBlurToFalse() {
    setIsTextFieldVisible(false);
  }
  async function handleSearchComponent() {
    setIsFilterLoading(true);
    if (searchedValue.length == 0) {
      setValuesFiltered([]);
      GrupoAcessoRoutes.postClearFilters();
      setFiltersAgremiacao([]);
      setSearchedValue("");
      handleSearchBlurToFalse();
    }
    if (searchedValue.length > 0) {
      const response = await GrupoAcessoRoutes.pesquisarGrupoAcesso(
        searchedValue
      );
      response.length == 0
        ? setValuesFiltered([{ ...filterWithZeroReturn }])
        : setValuesFiltered(response);
      handleSearchBlurToFalse();
    }
    setIsFilterLoading(false);
  }
  function QuickSearchToolbar() {
    return (
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          position: "fixed",
          flexDirection: "row-reverse",
          gap: 2,
          pr: 2,
          right: 40,
          top: "1vh",
          zIndex: 1100,
        }}
      >
        <button
          style={{
            color: valuesFiltered.length > 0 ? "#4887C8" : "#797878",
            fontSize: ".9rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "transparent",
            border: "none",
            cursor: valuesFiltered.length > 0 ? "pointer" : "default",
          }}
          onClick={() => {
            setValuesFiltered([]);
            GrupoAcessoRoutes.postClearFilters();
            setFiltersAgremiacao([]);
            setSearchedValue("");
            //Limpar o filtro no backend
          }}
          disabled={!(valuesFiltered.length > 0)}
        >
          <h4>Limpar Filtros</h4>
          <FilterIcon />
        </button>

        <TextField
          onBlur={handleSearchBlur}
          placeholder="Pesquisar"
          InputProps={{
            endAdornment: (
              <Search
                onClick={handleSearchComponent}
                sx={{
                  cursor: "initial",
                  color: searchedValue.length >= 1 ? "#4887C8" : "#ccc",
                }}
              />
            ),
          }}
          autoFocus={isTextFieldVisible}
          value={searchedValue}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setSearchedValue(event.target.value);
          }}
          onKeyUp={(
            event: React.KeyboardEventHandler<HTMLDivElement> | any
          ) => {
            const timeoutId = setTimeout(() => handleSearchBlurToFalse, 300);
            if (event.key === "Enter") {
              handleSearchComponent();
              handleSearchBlurToFalse();
            }
          }}
          onClick={handleSearchBlur}
          sx={{ maxWidth: 240, background: "#ffffff" }}
        />
      </Box>
    );
  }
  function handleDateFormat(dateString: string) {
    const date = parseISO(dateString);
    if (date.toString() == "Invalid Date") return "";
    return format(date, "dd/MM/yyyy");
  }

  const columns: GridColDef[] = [
    {
      field: "edit-action",
      headerName: "Editar",
      width: 62,
      //@ts-ignore
      renderCell: (params: GridValueGetterParams) => (
        <Button
          onClick={async (e: any) => {
            e.stopPropagation();
            //@ts-ignore
            setValueTab(1);
            navigate(`editar/${params.id}`, { replace: true });
          }}
          sx={{
            transform: "scale(.7)",
            ml: -1.4,
          }}
        >
          <EditIcon />
        </Button>
      ),
      disableColumnMenu: true,
      hideSortIcons: true,
    },
    { field: "nome", headerName: "Nome", width: 300 },
    { field: "descricao", headerName: "Descrição", width: 300 },
    { field: "administrador", headerName: "Tipo Administrador", width: 200, valueFormatter: item=> item.value == false ? 'Não' : 'Sim' },
    { field: "desativado", headerName: "Desativado", width: 200, valueFormatter: item=> item.value == false ? 'Não' : 'Sim' }
    
  ];

  function handleSelectionModelChange(selection: any) {
    setSelectedRowsAgremiacao(selection);
  }

  useEffect(() => {
    GrupoAcessoRoutes.postClearFilters();
  }, []);

  useEffect(() => {
    console.log(valuesFiltered);
  }, [valuesFiltered]);
  const handleSearchChange = () => {
    console.log("event.target.value");
  };

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
          <QuickSearchToolbar />
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
                  borderRadius: 1,
                }}
              >
                {isFilterLoading ? (
                  <Loading />
                ) : data?.itens ? (
                  <DataGrid
                    rows={
                      valuesFiltered.length == 0 ? data.itens : valuesFiltered
                    }
                    columns={columns}
                    checkboxSelection
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
                        disableMultipleActions: true,
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
                    Total de linhas:{" "}
                    {valuesFiltered.length == 0
                      ? data?.paginacao.total == undefined
                        ? "..."
                        : data.paginacao.total && data.paginacao.total
                      : valuesFiltered.length &&
                        valuesFiltered.length + " / " + data?.paginacao.total}
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
                    // disabled

                    onClick={() => navigate("cadastro", { replace: true })}
                  >
                    <AddOutlined /> Novo
                  </Button>
                  <Button
                    onClick={() => handleClickOpen(4)}
                  >
                    <UploadFile /> Exportar
                  </Button>
                  <Button
                    onClick={() => handleClickOpen(1)}
                    // disabled
                  >
                    <FilterAlt /> Filtrar
                  </Button>
                  <Button sx={{ marginRight: 3 }} onClick={() => navigate('/agremiacao')}>
                    Voltar
                  </Button>
                </Box>
              </Box>
              <ModalGrupoAcesso />
              <ModalExportarGrupoAcesso />
              {/* <BackdropComponent open={isLoading} /> */}
            </TabPanel>
            <TabPanel value={valueTab} index={1}></TabPanel>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
