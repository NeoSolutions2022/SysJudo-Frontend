import { SetStateAction, createContext, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import type { ReactNode } from "react";
import type {
  IGrupoAcesso,
  IFiltersGrupoAcesso,
  GrupoAcessoOptions
} from "../../models/GrupoAcessoModel";

import { validation as ValidationSchema } from "../../components/Form/Agremiacao/validation/register";

const InitialValues = {
  nome: "",
  descricao: "",
  permissoes: [],
};


interface FormikContextProps {
  AgremiacaoFilterFormik: any;
  filtersAgremiacao: IFiltersGrupoAcesso[];
  setFiltersAgremiacao: (filtersAgremiacao: IFiltersGrupoAcesso[]) => void;
  filtersToPost: any;
  setFiltersToPost: React.Dispatch<SetStateAction<NewFilterFormattedProps[]>>;
  handleFilterChange: (newFilter: IFiltersGrupoAcesso[]) => void;
  valuesFiltered: IGrupoAcesso[];
  setValuesFiltered: (valuesFiltered: IGrupoAcesso[]) => void;
  selectedRowsAgremiacao: never[],
  setSelectedRowsAgremiacao :React.Dispatch<SetStateAction<never[]>>,
  reloadAgremiacao: boolean,
  setReloadAgremiacao : React.Dispatch<SetStateAction<boolean>>
  filterWithZeroReturn: any,
  isFilterLoading: boolean,
  setIsFilterLoading: React.Dispatch<SetStateAction<boolean>>
}

import { GrupoAcessoRoutes } from "../services/api/grupo-acesso/grupo-acesso";
import { useAuthContext } from "../../hooks/useAuthProvider";

interface FormikProviderProps {
  children: ReactNode;
}

export const GrupoAcessoContext = createContext({} as FormikContextProps);

interface NewFilterFormattedProps {
  nomeParametro: string;
  operacaoId: number;
  valorString?: string;
  valorId1?: number;
  valorId2?: number;
  dataInicial?: string;
  dataFinal?: string;
  operadorLogico: number;
  operacoesMatematicas: boolean;
}

export function GrupoAcessoProvider({ children }: FormikProviderProps) {
  const [filtersAgremiacao, setFiltersAgremiacao] = useState<
    IFiltersGrupoAcesso[]
  >([]);
  const [filtersToPost, setFiltersToPost] = useState<NewFilterFormattedProps[]>(
    []
  );
  
    const filterWithZeroReturn = {
        id: 1, 
        sigla: 'Sem Correspondencia',
        nome: 'Sem Correspondencia',
        descricao: 'Sem Correspondencia',
        administrador: 'Sem Correspondencia',
        desativado: 'Sem Correspondencia',     
      
    }
  const [currentFileToCreate, setCurrentFileToCreate] = useState<File[]>([]);
  const [valuesFiltered, setValuesFiltered] = useState<IGrupoAcesso[]>([]);
  const [fileLinkFromGetAgremiacao, setFileLinkFromGetAgremiacao] = useState<string[]>([])
  const [reloadAgremiacao, setReloadAgremiacao] = useState<boolean>(false)
  const [selectedRowsAgremiacao, setSelectedRowsAgremiacao] = useState([])
  const { verifyToken } = useAuthContext();
  const [isFilterLoading, setIsFilterLoading] = useState(false)

  useEffect(() => {
    verifyToken();
  }, []);


  const AgremiacaoFilterFormik = useFormik({
    validateOnChange: false,
    initialValues: {
      initialParentheses: "",
      column: "",
      firstValue: "",
      operator: "",
      secondValue: "",
      finalParentheses: "",
      logicOperator: "",
    },
    validationSchema: Yup.object().shape({
      initialParentheses: Yup.string().required("Campo obrigatório"),
      column: Yup.string().required("Campo obrigatório"),
      firstValue: Yup.string().required("Campo obrigatório"),
      operator: Yup.string().required("Campo obrigatório"),
      secondValue: Yup.string().notRequired(), //.required('Campo obrigatório')
      finalParentheses: Yup.string().required("Campo obrigatório"),
      logicOperator: Yup.string().notRequired(), //.required('Campo obrigatório')
    }),
    onSubmit: (values: IFiltersGrupoAcesso) => {
      const newArrayFiltersWithoutSort = [...filtersAgremiacao, values];

      const newArrayFilters = newArrayFiltersWithoutSort.sort((a, b) => {
        switch (a.initialParentheses) {
          case "(":
            if (
              b.initialParentheses === "((" ||
              b.initialParentheses === "((("
            ) {
              return -1;
            }
            if (b.initialParentheses === "(") {
              return 0;
            }
          case "((":
            if (b.initialParentheses === "(") {
              return 1;
            }
            if (b.initialParentheses === "((") {
              return 0;
            }
            if (b.initialParentheses === "(((") {
              return -1;
            }
          case "(((":
            if (b.initialParentheses === "(" || b.initialParentheses === "((") {
              return 1;
            }
            if (b.initialParentheses === "(((") {
              return 0;
            }
          default:
            return 0;
        }
      });

      setFiltersAgremiacao(newArrayFilters);
      console.log("array filters in context", newArrayFilters);
      AgremiacaoFilterFormik.resetForm();
    },
  });

  const handleFilterChange = (filters: IFiltersGrupoAcesso[]) => {
    const operatorsOptions = ["", "CONTEM", "=", "#", "<", "<=", ">", ">=", 'ENTRE'];
    const logicOperatorsOptions = ["", "E", "OU"];

    function handleFormatFilter(filter: IFiltersGrupoAcesso) {
      if (
        filter.column == "DataCnpj" ||
        filter.column == "DataAta" ||
        filter.column == "DataFiliacao" ||
        filter.column == "DataNascimento"
      ) {
        return {
          nomeParametro: filter.column,
          operacaoId: operatorsOptions.indexOf(filter.operator) - 1,
          dataInicial: filter.firstValue, //TODO: change to date
          dataFinal: filter.secondValue, //TODO: change to date
          operadorLogico: logicOperatorsOptions.indexOf(filter.logicOperator),
          operacoesMatematicas: true, //TODO: change to boolean
        };
      } else {
        return {
          nomeParametro: filter.column,
          operacaoId: operatorsOptions.indexOf(filter.operator),
          valorString: filter.firstValue,
          valorString2: filter.secondValue,
          operadorLogico: logicOperatorsOptions.indexOf(filter.logicOperator),
          operacoesMatematicas: true, //TODO: change to boolean
        };
      }
    }
    console.log('filters', filters)
    filters.map((filter) => {
      setFiltersToPost((old) =>
        old.length == 0
          ? [handleFormatFilter(filter)]
          : [...old, handleFormatFilter(filter)]
      );
    });
  };
  
  useEffect(() => {
    if (filtersToPost.length <= 0){
      return
    }else{

      async function atribuittingApiValue() {
        const response = await GrupoAcessoRoutes.postGrupoAcessoFilter(
          filtersToPost
        );
        console.log('r',response)
        if(response.length ==0){
          setIsFilterLoading(false)
          // @ts-ignore
          return setValuesFiltered([{...filterWithZeroReturn}])
        } else{
          setIsFilterLoading(false)
          return setValuesFiltered(response);
  
        }
      }
      
      atribuittingApiValue();

    }

    // This code will be executed after filtersToPost has been updated
  }, [filtersToPost]);

  return (
    <GrupoAcessoContext.Provider
      value={{
        AgremiacaoFilterFormik,
        filtersAgremiacao,
        setFiltersAgremiacao,
        filtersToPost,
        setFiltersToPost,
        handleFilterChange,
        valuesFiltered,
        setValuesFiltered,
        selectedRowsAgremiacao,
        setSelectedRowsAgremiacao,
        reloadAgremiacao,
        setReloadAgremiacao,
        filterWithZeroReturn,
        isFilterLoading, 
        setIsFilterLoading
        
      }}
    >
      {children}
    </GrupoAcessoContext.Provider>
  );
}
