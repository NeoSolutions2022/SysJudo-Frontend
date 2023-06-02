import { useContext } from 'react';
import { FormikContext } from '../providers/context/FormikContext';

export function useFormikProvider() {
  const context = useContext(FormikContext);

  const {
    // AgremiacaoFilterFormik,
    // AgremiacaoRegisterFormik,
    filtersAgremiacao,
    setFiltersAgremiacao,
    filtersToPost,
    handleFilterChange,
    setFiltersToPost,
    valuesFiltered,
    setValuesFiltered,
    notes,
    setNotes,
    files,
    handleChangeFile,
    currentFileToCreate,
    setCurrentFileToCreate,
    selectedRowsAgremiacao,
    setSelectedRowsAgremiacao,
    fileLinkFromGetAgremiacao,
    setFileLinkFromGetAgremiacao,
    reloadAgremiacao,
    setReloadAgremiacao,
    filterWithZeroReturn,
    isFilterLoading, 
    setIsFilterLoading,
    ordenacaoColumnAgremiacaoToExport,
    setOrdenacaoColumnAgremiacaoToExport
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
    notes,
    setNotes,
    files,
    handleChangeFile,
    currentFileToCreate,
    setCurrentFileToCreate,
    selectedRowsAgremiacao,
    setSelectedRowsAgremiacao,
    setFileLinkFromGetAgremiacao,
    fileLinkFromGetAgremiacao,
    reloadAgremiacao,
    setReloadAgremiacao,
    filterWithZeroReturn,
    isFilterLoading, 
    setIsFilterLoading,
    ordenacaoColumnAgremiacaoToExport,
    setOrdenacaoColumnAgremiacaoToExport
  };
}