import { Formik, useFormik } from "formik";
import * as Yup from "yup";

import { MenuItem, Paper, Stack, TextField, Box } from "@mui/material";
import { Add, Close, Edit } from "@mui/icons-material";

import type { IFiltersAgremicao } from "../../../models/AgremiacaoModel";
import { AgremiacaoOptions } from "../../../models/AgremiacaoModel";

import { useFormikProvider } from "../../../hooks/useFormikProvider";
import { useEffect, useState } from "react";
import { InitialParenthesesValue } from "../../../types/Filters/Agremiacao/parentheses";
import { beBY } from "@mui/material/locale";
import { event } from "jquery";

interface FormFilterAgremiacaoProps {
  values?: IFiltersAgremicao;
  indexValues?: number;
  
}

export function FormFilterAgremiacao({
  values,
  indexValues
}: FormFilterAgremiacaoProps) {
  // verify, if operator != between, then secondValue is not required

  const [column, setColumn] = useState(values?.column ?? '')
  const [firstValue, setFirstValue] = useState(values?.firstValue ?? '')
  const [operator, setOperator] = useState(values?.operator ?? '')
  const [secundValue, setSecundValue] = useState(values?.secondValue ?? '')
  const [logicOperator, setLogicOperator] = useState(values?.logicOperator ?? '')

  const { filtersAgremiacao, setFiltersAgremiacao } = useFormikProvider();

  const formik = useFormik({
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
      initialParentheses: Yup.string().notRequired(),
      column: Yup.string().required("Campo obrigatório"),
      firstValue: Yup.string().required("Campo obrigatório"),
      operator: Yup.string().required("Campo obrigatório"),
      secondValue: Yup.string().notRequired(), //.required('Campo obrigatório')
      finalParentheses: Yup.string().notRequired(),
      logicOperator: Yup.string().notRequired(), //.required('Campo obrigatório')
    }),
    onSubmit: (values: IFiltersAgremicao) => {
      const newArrayFiltersWithoutSort = [...filtersAgremiacao, values];
      setFiltersAgremiacao(
        newArrayFiltersWithoutSort.sort(
          (a: IFiltersAgremicao, b: IFiltersAgremicao) =>
            a.initialParentheses > b.initialParentheses
              ? 1
              : b.initialParentheses > a.initialParentheses
              ? -1
              : 0
        )
      );
      formik.resetForm();
    },
  });

  function handleDateFormat(dateString: string) {
    if (/^\d+$/.test(dateString)) {
      // Se a string contiver apenas dígitos, retorna false imediatamente
      return dateString;
    }
  
    const date = new Date(dateString);
    const day = date.getDate() + 1;
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const text = `${day > 10 ? day : "0" + day}/${
      month > 10 ? month : "0" + month
    }/${year}`;
    if( text== '0NaN/0NaN/NaN' || text == '010/03/1971'){
      return dateString
    } else 
    return text
  }

  const handleRemoveFilter = () => {
    const newArrayFilters = filtersAgremiacao.filter((_, index) => index !== indexValues);
    console.log(newArrayFilters, 'aie')

    setFiltersAgremiacao(newArrayFilters);
  }

  const [ valuess, setValues ] = useState({})

  const handleEditFilter = () => {
    const editedFilters = [...filtersAgremiacao];
    const editedFilter = editedFilters[indexValues ?? 0];
  
    editedFilter.initialParentheses = values?.initialParentheses || "";
    editedFilter.column = values?.column || "";
    editedFilter.operator = values?.operator || "";
    editedFilter.logicOperator = values?.logicOperator || "";
  
    setFiltersAgremiacao(editedFilters);
  }

  // const handleEditFilter = () => {
  //   // Filtra o array para retornar apenas o elemento selecionado para edição
  //   const editedFilter = filtersAgremiacao.filter((_, index) => index === indexValues);
  
  //   // Define o estado dos valores do formulário com o elemento selecionado para edição
  //   setValues({
  //     initialParentheses: editedFilter[0].initialParentheses,
  //     column: editedFilter[0].column
  //   });
  
  //   // Remove o elemento selecionado para edição do array original
  //   const newArrayFilters = filtersAgremiacao.filter((_, index) => index !== indexValues);
  
  //   // Define o estado dos filtros com o novo array resultante
  //   setFiltersAgremiacao(newArrayFilters);
  // };

  const HandleRenderButtons = () => {
    if (values) {
      return (
        <Box display='flex' alignItems='center' sx={{
           gap: 2,
           margin: '10px'
             
           
        }}>
        <Edit
          sx={{ 
            color: 'darkorange',// color: 'darkorange',
            pointerEvents:'cursor',
            cursor: 'pointer',
            fontSize: '1.45rem'   
          }}
          
          onClick={handleEditFilter}
        />
          <Close
            sx={{ cursor: 'pointer' }}
            onClick={handleRemoveFilter}
          />
        </Box>
      )
    }
    return (
      <Box display='flex' alignItems='center' sx={{ gap: 2 }}>
        <Add
          sx={{ color: 'green', cursor: 'pointer' }}
          onClick={(e:any) => formik.handleSubmit(e)}
        />
        <Close
          sx={{ color: 'red', cursor: 'pointer' }}
          onClick={(e: any) => formik.handleReset(e)}
        />
      </Box>
    );
  }

  const handleChangeOperator = (event: React.ChangeEvent<{ value: unknown }>) => {
    const operatorValue = event.target.value as string;
    if (['', 'CONTEM', '=', '#', '>', '<', '>=', '<=', 'ENTRE'].includes(operatorValue)) {
      setOperator(operatorValue as "" | "CONTEM" | "=" | "#" | ">" | "<" | ">=" | "<=" | "ENTRE");
    } else {
      setOperator('');
    }
  }

  const handleChangeLogicOperator = (e: React.ChangeEvent<{ value: unknown }>) => {
    const newOperator = e.target.value as "" | "E" | "OU";
    setLogicOperator(newOperator);
  };
  

  const HandleRenderForm = () => {
    return (
      <form>
      <Stack
        spacing={1}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          m: 3
        }}
        >
          <TextField
            select
            variant="outlined"
            name='initialParentheses'
            id='initialParentheses'
            value={values?.initialParentheses ?? formik.values['initialParentheses']}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched['initialParentheses'] && Boolean(formik.errors['initialParentheses'])}
            helperText={formik.touched['initialParentheses'] && formik.errors['initialParentheses']}
            sx={{ width: 150 }}
            fullWidth
            disabled={values !== undefined}
          >
            {
              AgremiacaoOptions.AgremiacaoParenthesesValues
                .initial.map((parentheses: { value: string, label: string }) => (
                  <MenuItem value={parentheses.value}>{parentheses.label}</MenuItem>
                ))
            }
          </TextField>

          <TextField
            select
            variant="outlined"
            name='column'
            id='column'
            value={column ?? formik.values['column']}
            onChange={e => setColumn(e.target.value)}
            onBlur={formik.handleBlur}
            error={formik.touched['column'] && Boolean(formik.errors['column'])}
            helperText={formik.touched['column'] && formik.errors['column']}
            sx={{ width: 150 }}
            fullWidth
            disabled={values === undefined}
            InputLabelProps={{
              shrink: true,
            }}
          >
            {
              AgremiacaoOptions.AgremiacaoHeaderValues.map((item) => (
                <MenuItem value={item.value}>{item.label}</MenuItem>
              ))
            }
          </TextField>

          <TextField
            select
            variant="outlined"
            name='operator'
            id='operator'
            value={operator ?? formik.values['operator']}
            onChange={handleChangeOperator}
            onBlur={formik.handleBlur}
            error={formik.touched['operator'] && Boolean(formik.errors['operator'])}
            helperText={formik.touched['operator'] && formik.errors['operator']}
            sx={{ width: 150 }}
            fullWidth
            disabled={values === undefined}
            InputLabelProps={{
              shrink: true,
            }}
            
          >
            {
              AgremiacaoOptions.AgremiacaoOperatorsValues
                .operator.map((operator) => (
                  <MenuItem value={operator.value}>{operator.label}</MenuItem>
                ))
            }
          </TextField>

          <TextField
            type='text'
            variant="outlined"
            name='firstValue'
            id='firstValue'
            value={!isColumnDate ? (values?.firstValue && handleDateFormat(values?.firstValue)) ?? formik.values['firstValue'] : values?.firstValue ?? formik.values['firstValue'] }
            onChange={(event) => {
              const value = event.target.value;
              const formattedValue = !isColumnDate ? handleDateFormat(value) : value;
              formik.setFieldValue('firstValue', formattedValue);
            }}
            onBlur={formik.handleBlur}
            error={formik.touched['firstValue'] && Boolean(formik.errors['firstValue'])}
            helperText={formik.touched['firstValue'] && formik.errors['firstValue']}
            sx={{ width: 150 }}
            fullWidth
            disabled={values === undefined}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            type='text'
            variant="outlined"
            name='secondValue'
            id='secondValue'
            value={values?.secondValue ?? formik.values['secondValue']}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched['secondValue'] && Boolean(formik.errors['secondValue'])}
            helperText={formik.touched['secondValue'] && formik.errors['secondValue']}
            sx={{ width: 150 }}
            fullWidth
            disabled={formik.values['operator'] !== 'ENTRE' || values !== undefined}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            select
            variant="outlined"
            name='finalParentheses'
            id='finalParentheses'
            value={values?.finalParentheses ?? formik.values['finalParentheses']}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched['finalParentheses'] && Boolean(formik.errors['finalParentheses'])}
            helperText={formik.touched['finalParentheses'] && formik.errors['finalParentheses']}
            sx={{ width: 150 }}
            fullWidth
            disabled={values !== undefined}
            InputLabelProps={{
              shrink: true,
            }}
          >
            {
              AgremiacaoOptions.AgremiacaoParenthesesValues
                .final.map((parentheses) => (
                  <MenuItem value={parentheses.value}>{parentheses.label}</MenuItem>
                ))
            }
          </TextField>

          <TextField
            select
            variant="outlined"
            name='logicOperator'
            id='logicOperator'
            value={logicOperator ?? formik.values['logicOperator']}
            onChange={handleChangeLogicOperator}
            onBlur={formik.handleBlur}
            error={formik.touched['logicOperator'] && Boolean(formik.errors['logicOperator'])}
            helperText={formik.touched['logicOperator'] && formik.errors['logicOperator']}
            sx={{ width: 150 }}
            fullWidth
            disabled={values === undefined}
            InputLabelProps={{
              shrink: true,
            }}
          >
            {
              AgremiacaoOptions.AgremiacaoOperatorsValues
                .logicOperator.map((operator) => (
                  <MenuItem value={operator.value}>{operator.label}</MenuItem>
                ))
            }
          </TextField>

          <HandleRenderButtons />
        </Stack>
      </form>
    );
  }

  useEffect(() => {
    const a = formik.getFieldProps("initialParentheses").value;
    switch (a) {
      case "(":
        formik.setFieldValue("finalParentheses", ")");
        break;

      case "((":
        formik.setFieldValue("finalParentheses", "))");
        break;

      case "(((":
        formik.setFieldValue("finalParentheses", ")))");
        break;
    }
  }, [formik.values["initialParentheses"]]);
  
  useEffect(() => {
    if(
    formik.values["column"] == "DataCnpj" ||
    formik.values["column"] == "DataAta" ||
    formik.values["column"] == "DataFiliacao" ||
    formik.values["column"] == "DataNascimento"
    ){

    }
  }, [formik.values["column"]]);

  const [isColumnDate, setisColumnDate] = useState(false)
  const [isColumnNumber, setIsColumnNumber] = useState(false)
  useEffect(() => {
    const a = formik.getFieldProps("column").value; 
    if(
      a == "DataCnpj" ||
      a == "DataAta" ||
      a == "DataFiliacao" ||
      a == "DataNascimento"
    ){
      setisColumnDate(true)
      return
    }
    else{
      setisColumnDate(false)
      if(
        a == 'Cep' ||
        a == 'Cnpj' ||
        a == 'InscricaoMunicipal' ||
        a == 'InscricaoEstadual'
      ){
        setIsColumnNumber(true)
        return
      }else{
        setIsColumnNumber(false)
      }
    }
  }, [formik.values["column"]]);

  return values !== undefined ? (
    <HandleRenderForm />
  ) : (
    <Paper sx={{ alignItems: "center", p: 1, mb: 2 }}>
      <form>
        <Stack
          spacing={2}
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            m: 2,
          }}
        >
          <TextField
            select
            variant="outlined"
            label="Abre ("
            name="initialParentheses"
            id="initialParentheses"
            value={formik.values["initialParentheses"]}
            onChange={formik.handleChange}
            error={
              formik.touched["initialParentheses"] &&
              Boolean(formik.errors["initialParentheses"])
            }
            helperText={
              formik.touched["initialParentheses"] &&
              formik.errors["initialParentheses"]
            }
            sx={{ width: 150 }}
            fullWidth
            disabled
            InputLabelProps={{
              shrink: true,
            }}
          >
            {AgremiacaoOptions.AgremiacaoParenthesesValues.initial.map(
              (parentheses: { value: string; label: string }) => (
                <MenuItem value={parentheses.value}>
                  {parentheses.label}
                </MenuItem>
              )
            )}
          </TextField>

          <TextField
            select
            variant="outlined"
            label="Campo"
            name="column"
            id="column"
            value={formik.values["column"]}
            onChange={formik.handleChange}
            error={formik.touched["column"] && Boolean(formik.errors["column"])}
            helperText={formik.touched["column"] && formik.errors["column"]}
            sx={{ width: 150 }}
            fullWidth
            disabled={values !== undefined}
            InputLabelProps={{
              shrink: true,
            }}
          >
            {AgremiacaoOptions.AgremiacaoHeaderValues.map((item) => (
              <MenuItem value={item.value}>{item.label}</MenuItem>
            ))}
          </TextField>

          <TextField
            select
            variant="outlined"
            label="Operador Lógico"
            name="operator"
            id="operator"
            value={formik.values["operator"]}
            onChange={formik.handleChange}
            error={
              formik.touched["operator"] && Boolean(formik.errors["operator"])
            }
            helperText={formik.touched["operator"] && formik.errors["operator"]}
            sx={{ width: 150 }}
            fullWidth
            disabled={values !== undefined}
            InputLabelProps={{
              shrink: true,
            }}
          >
            {
              !isColumnDate ?
              AgremiacaoOptions.AgremiacaoOperatorsValues.operator.map(
                (operator) => (
                  <MenuItem value={operator.value}>{operator.label}</MenuItem>
                )
            ) : AgremiacaoOptions.AgremiacaoOperatorsValues.operatorData.map(
              (operator) => (
                <MenuItem value={operator.value}>{operator.label}</MenuItem>
              )
          )
          
            }
          </TextField>

          <TextField
            type= {isColumnDate ? "date" : isColumnNumber ? "number" : "text"}
            variant="outlined"
            label={"Valor 1"}
            name="firstValue"
            id="firstValue"
            value={formik.values["firstValue"]}
            onChange={formik.handleChange}
            error={
              formik.touched["firstValue"] &&
              Boolean(formik.errors["firstValue"])
            }
            helperText={
              formik.touched["firstValue"] && formik.errors["firstValue"]
            }
            sx={{ width: 150 }}
            fullWidth
            InputProps={{
              inputProps: { min: 0 }
            }}
            disabled={values !== undefined}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            variant="outlined"
            type= {isColumnDate ? "date" : isColumnNumber ? "number" : "text"}
            label={"Valor 2"}
            name="secondValue"
            id="secondValue"
            value={formik.values["secondValue"]}
            onChange={formik.handleChange}
            error={
              formik.touched["secondValue"] &&
              Boolean(formik.errors["secondValue"])
            }
            helperText={
              formik.touched["secondValue"] && formik.errors["secondValue"]
            }
            sx={{ width: 150 }}
            fullWidth
            disabled={
              formik.values["operator"] !== "ENTRE" || values !== undefined
            }
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            select
            label="Fecha )"
            variant="outlined"
            name="finalParentheses"
            id="finalParentheses"
            value={formik.values["finalParentheses"]}
            onChange={formik.handleChange}
            error={
              formik.touched["finalParentheses"] &&
              Boolean(formik.errors["finalParentheses"])
            }
            helperText={
              formik.touched["finalParentheses"] &&
              formik.errors["finalParentheses"]
            }
            sx={{
              "& .MuiInputBase-input.Mui-disabled": {
                WebkitTextFillColor: "#000000",
              },
              width: 150,
            }}
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            disabled
          >
            {AgremiacaoOptions.AgremiacaoParenthesesValues.final.map(
              (parentheses) => (
                <MenuItem value={parentheses.value}>
                  {parentheses.label}
                </MenuItem>
              )
            )}
          </TextField>
          <TextField
            select
            variant="outlined"
            name="logicOperator"
            id="logicOperator"
            value={formik.values["logicOperator"]}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched["logicOperator"] &&
              Boolean(formik.errors["logicOperator"])
            }
            helperText={
              formik.touched["logicOperator"] && formik.errors["logicOperator"]
            }
            sx={{ width: 150 }}
            fullWidth
            disabled={values !== undefined}
          >
            {AgremiacaoOptions.AgremiacaoOperatorsValues.logicOperator.map(
              (operator) => (
                <MenuItem value={operator.value}>{operator.label}</MenuItem>
              )
            )}
          </TextField>
          {/*@ts-ignore */}
          <HandleRenderButtons />
        </Stack>
      </form>
    </Paper>
  );
}
