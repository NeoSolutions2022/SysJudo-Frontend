import { useState, useMemo, SyntheticEvent, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Box, CircularProgress, Container, Grid } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridToolbarQuickFilter,
  GridToolbar,
  GridValueGetterParams,
  useGridApiRef,
  ptBR,
} from "@mui/x-data-grid";
import {
  AddOutlined,
  CreateOutlined as EditIcon,
  Filter,
  FilterAlt,
  FilterAltOff,
  NoteAddOutlined,
  PlusOneOutlined,
  UploadFile,
} from "@mui/icons-material";

import {
  Search,
  FilterAltOffOutlined as FilterIcon,
} from "@mui/icons-material";
import { TextField } from "../../components/Form/TextAreaComponent/TextAreaComponent";

import { ModalFilterAgremiacao } from "../../components/Modal/Agremiacao/modalFilterAgremiacao";
import { ModalAnotacoesAgremiacao } from "../../components/Modal/Agremiacao/Anotacoes";
import { ModalExportarAgremiacao } from "../../components/Modal/Agremiacao/Exportar";
import { BackdropComponent } from "../../components/Backdrop";
import { useModal } from "../../hooks/useModalProvider";
import { useFormikProvider } from "../../hooks/useFormikProvider";

import { CadastroAgremiacao } from "./CadastroAgremiacao";
import { Home } from "../Home";
import { StyledButton as Button } from "../../components/Button";

import api from "../../providers/services/api";
import { agremiacaoRoutes } from "../../providers/services/api/agremiacao/agremiacao";
import parse from "html-react-parser";
import { parseISO, format } from 'date-fns';
import { Loading } from '../../components/Loading/Loading';


export function Listagem() {
  document.title = "Listagem de Agremiação";
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
    setIsFilterLoading
  } = useFormikProvider();
  const { data, isError, isLoading } = useQuery(
    ["agremiacao-list"],
    agremiacaoRoutes.getAgremiacoes
  );

  const [valueTab, setValueTab] = useState(0);

  const [agremiacaoId, setAgremiacaoId] = useState(0);

  const handleChange = (e: SyntheticEvent, newValue: number) => {
    setAgremiacaoId(0);
    setValueTab(newValue);
  };

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
    setIsFilterLoading(true)
    if (searchedValue.length == 0){
      setValuesFiltered([]);
      agremiacaoRoutes.postClearFilters();
      setFiltersAgremiacao([]);
      setSearchedValue('')
      handleSearchBlurToFalse()
    } 
    if (searchedValue.length > 0){
      const response = await agremiacaoRoutes.pesquisarAgremiacao(searchedValue)
      response.length == 0 ? setValuesFiltered([{...filterWithZeroReturn}]) :  setValuesFiltered(response)
      handleSearchBlurToFalse()
    } 
    setIsFilterLoading(false)

  }
  function QuickSearchToolbar() {
    const inputRef = useRef(null);
    const handleBlurEffect = () => {
      if (inputRef.current !== document.activeElement) {
        handleSearchBlurToFalse()
        return false

      }else return true
    };
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
          top: "0.7vh",
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
            agremiacaoRoutes.postClearFilters();
            setFiltersAgremiacao([]);
            setSearchedValue('')
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
          InputProps={{ endAdornment: <Search onClick={handleSearchComponent} sx={{cursor: 'initial', color: searchedValue.length >= 1 ? '#4887C8' : '#ccc'}} /> }}
          autoFocus={isTextFieldVisible}
          value={searchedValue}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setSearchedValue(event.target.value);
          }}
          onKeyUp={(
            event: React.KeyboardEventHandler<HTMLDivElement> | any
          ) => {
            const timeoutId = setTimeout(() => handleSearchBlurToFalse ,300)
            if (event.key === "Enter") {
              handleSearchComponent();
              handleSearchBlurToFalse();
            }
          }}
          onClick={handleSearchBlur}
          sx={{ maxWidth: 240, background: '#ffffff' }}
        />
      </Box>
    );
  }
  function handleDateFormat(dateString: string) {
    const date = parseISO(dateString);
    if(date.toString() == 'Invalid Date')
      return '' 
    return format(date, 'dd/MM/yyyy');
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
            setAgremiacaoId(params.id);
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
    { field: "sigla", headerName: "Sigla", width: 120 },
    { field: "nome", headerName: "Nome", width: 300 },
    { field: "fantasia", headerName: "Fantasia", width: 300 },
    { field: "responsavel", headerName: "Responsável", width: 300 },
    { field: "representante", headerName: "Representante", width: 300 },
    {
      field: "dataFiliacao",
      headerName: "Data de Filiacao",
      width: 150,
      valueFormatter: (item) =>
        item.value ? handleDateFormat(item?.value) : "",
    },
    {
      field: "dataNascimento",
      headerName: "Data de Nascimento",
      width: 150,
      valueFormatter: (item) =>
        item.value ? handleDateFormat(item?.value) : "",
    },
    { field: "cep", headerName: "CEP", width: 90 },
    { field: "endereco", headerName: "Endereço", width: 300 },
    { field: "bairro", headerName: "Bairro", width: 300 },
    { field: "complemento", headerName: "Complemento", width: 150 },

    {
      field: "cidade",
      headerName: "Cidade",
      width: 200,
    },
    {
      field:  "estado",
      headerName: "Estado",
      width: 150,
    },
    {
      field:  "pais",
      headerName: "Pais",
      width: 100,
    },
    { field: "telefone", headerName: "Telefone", width: 150 },
    { field: "email", headerName: "Email", width: 300 },
    { field: "cnpj", headerName: "CNPJ", width: 150 },
    {
      field: "inscricaoMunicipal",
      headerName: "Inscrição Municipal",
      width: 150,
    },
    {
      field: "inscricaoEstadual",
      headerName: "Inscrição Estadual",
      width: 150,
    },
    {
      field: "dataCnpj",
      headerName: "Data CNPJ",
      width: 150,
      valueFormatter: (item) =>
        item.value ? handleDateFormat(item?.value) : "",
    },
    {
      field: "dataAta",
      headerName: "Data Ata",
      width: 150,
      valueFormatter: (item) =>
        item.value ? handleDateFormat(item?.value) : "",
    },
    // { field: 'alvaraLocacao', headerName: 'Alvará Locação', width: 150 },
    // { field: 'estatuto', headerName: 'Estatuto', width: 150 },
    // { field: 'contratoSocial', headerName: 'Contrato Social', width: 150 },
    // { field: 'documentacaoAtualizada', headerName: 'Documentação Atualizada', width: 200 },
    {
      field: `${valuesFiltered.length == 0 ? "regiao" : "regiaoNome"}`,
      headerName: "Região",
      width: 90,
      valueGetter: ({ value }) =>
        valuesFiltered.length == 0 ? value?.descricao : value,
    },
    {
      field: "anotacoes",
      headerName: "Anotações",
      width: 500,
      valueFormatter: (item) => (item.value != null ? item.value : ""),
      renderCell: (params) => (params ? parse(params.formattedValue) : ""),
    },
  ];

  function handleSelectionModelChange(selection: any) {
    setSelectedRowsAgremiacao(selection);
  }

  useEffect(() => {
    agremiacaoRoutes.postClearFilters();
  }, []);

  const customLocaleText = {
    footerTotalRows: `total de ${data?.itens.length} linhas`,
  };
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
                }}
              >
                {isFilterLoading ? <Loading/> : data?.itens ? (
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
                    // components={{ Toolbar: QuickSearchToolbar }}
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
                ) : <Loading/>}
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
                      ? data?.paginacao.total == undefined ? '...' : data.paginacao.total && data.paginacao.total
                      : valuesFiltered.length && valuesFiltered.length + ' / ' + data?.paginacao.total
                    }
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
                        ? selectedRowsAgremiacao.length +
                          " linha selecionada"
                        :selectedRowsAgremiacao.length +
                          " linhas selecionadas"
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
                    // disabled
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
                  <Button disabled sx={{ marginRight: 3 }}>
                    Voltar
                  </Button>
                </Box>
              </Box>
              <ModalFilterAgremiacao />
              <ModalExportarAgremiacao />
              {/* <BackdropComponent open={isLoading} /> */}
            </TabPanel>
            <TabPanel value={valueTab} index={1}>
              <CadastroAgremiacao />
            </TabPanel>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
