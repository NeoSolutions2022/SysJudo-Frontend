import { useContext } from 'react';
import { FormikContext } from '../providers/context/FormikContext';
import { GrupoAcessoContext, GrupoAcessoProvider } from '../providers/context/GrupoAcessoContext';

export function useGrupoAcessoProvider() {
  const context = useContext(GrupoAcessoContext);

  const {
    filtersAgremiacao,
    setFiltersAgremiacao,
    filtersToPost,
    handleFilterChange,
    setFiltersToPost,
    valuesFiltered,
    setValuesFiltered,
    selectedRowsAgremiacao,
    setSelectedRowsAgremiacao,
    reloadAgremiacao,
    setReloadAgremiacao,
    filterWithZeroReturn,
    isFilterLoading, 
    setIsFilterLoading
  } = context;

  return {
    // AgremiacaoFilterFormik,
    // AgremiacaoRegisterFormik,
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
  };
}