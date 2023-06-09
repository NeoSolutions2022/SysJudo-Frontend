import { useState, useEffect, useMemo, useInsertionEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik, ErrorMessage } from "formik";
import * as Yup from "yup";
import { BlockBlobClient } from "@azure/storage-blob";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";

import type { IAgremiacao } from "../../models/AgremiacaoModel";
import type { FormikErrors } from "formik";

const MockPermissions = [
  {
    "id": 1,
    "nome": "cadastro-agremiacao",
    "descricao": "Cadastro de agremiação",
    "categoria": "Cadastro"
  }
]


import {
  Snackbar,
  Alert,
  Grid,
  FormControlLabel,
  Checkbox,
  IconButton,
  MenuItem,
  InputLabel,
  Typography,
  Divider,
  Input,
  Link,
  Stepper,
  Step,
  StepLabel,
  Box,
} from "@mui/material";
import { TextField } from "../../components/Form/TextAreaComponent/TextAreaComponent";
import "../../../node_modules/react-notifications/lib/notifications.css";

import { StyledButton as Button, StyledButton } from "../../components/Button";

import {
  CreateOutlined as CreateOutlinedIcon,
  DeleteOutlineOutlined as DeleteOutlineOutlinedIcon,
  AddPhotoAlternateOutlined as AddPhotoAlternateOutlinedIcon,
  ClearOutlined as ClearOutlinedIcon,
  SaveOutlined as SaveOutlinedIcon,
  AttachFileOutlined as AttachFileOutlinedIcon,
  NoteAddOutlined as NoteAddOutlinedIcon,
  DeleteOutline as DeleteIcon,
} from "@mui/icons-material";


import { ModalAnotacoesAgremiacao } from "../../components/Modal/Agremiacao/Anotacoes";
import { ModalAnexosAgremiacao } from "../../components/Modal/Agremiacao/Anexar";
import { useModal } from "../../hooks/useModalProvider";
import { useAlertContext } from "../../hooks/useAlertProvider";
import { useFormikProvider } from "../../hooks/useFormikProvider";

import AvatarDefault from "../../assets/photo-user-default.png";
import LogoCorreios from "../../assets/correios.svg";
import "../../styles/cadastro-agremiacao.scss";
import { useGrupoAcessoProvider } from '../../hooks/useGrupoAcessoProvider';
import { GrupoAcessoRoutes } from '../../providers/services/api/grupo-acesso/grupo-acesso';


function transformPermissionObject(obj : any) {
  return Object.entries(obj).map(([permissaoId, tipo] : any) => ({
    permissaoId: parseInt(permissaoId),
    tipo: tipo.toString()
  }));
}

function revertObject(arr : any) {
  return arr.reduce((obj : any, item : any) => {
    obj[item.permissaoId] = item.tipo;
    return obj;
  }, {});
}


function revertTransformedPermission(arr : any) {
  const array =  arr.map((item : any)=> ({
    permissaoId: item.permissaoId,
    tipo: item.tipo
  }));
  return revertObject(array)
}

export function CadastroGrupoAcesso() {
  const navigate = useNavigate();
  const { id: userId } = useParams<{ id: string }>();
  const id = userId ? Number.parseInt(userId) : undefined;
  const handleTypePage = id ? "Edição" : "Cadastro";
  document.title = `${handleTypePage} de Agremiação`;
  const [avatarPreview, setAvatarPreview] = useState<string>(AvatarDefault);

  const { emitAlertMessage } = useAlertContext();
  const {
    reloadAgremiacao,
  } = useGrupoAcessoProvider();
  const [responsedCadastro, setResponsedCadastro] = useState<any>([]);
  const [isDisabled, setIsDisabled] = useState(false);

  const queryClient = useQueryClient();
  const initialValues = {
    nome: "",
    descricao: "",
    permissoes: [],
  };
  const formik = useFormik({
    // validateOnChange: false,
    initialValues: initialValues,
    validationSchema: Yup.object().shape({
      nome: Yup.string()
        .max(60, "Limite de 60 caracteres ultrapassado")
        .required("Nome é obrigatório"),
      descricao: Yup.string()
        .max(60, "Limite de 60 caracteres ultrapassado")
        .required("Nome é obrigatório"),
    }),
    onSubmit: () => {
      
      
      mutate();
    },
  });

  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(count + 1);
  }, [formik.isSubmitting]);
  useEffect(() => {
    let errorList = Object.keys(formik.errors);
    if (errorList.length > 0 && count > 1) {
      return emitAlertMessage("error", "Preencha os campos obrigatórios!");
      formik.handleSubmit;
    }
  }, [count]);

  const handleRoutes = async () => {
    const permissoes = transformPermissionObject(permissoesSelecionadas)
    const valuesToPost = { ...formik.values, permissoes }
    if (id) {
      return GrupoAcessoRoutes.updateGrupoAcesso(valuesToPost, id.toString());
    }

    return await GrupoAcessoRoutes.createGrupoAcesso(valuesToPost);
  };

  //@ts-ignore
  const { isLoading, mutate, data } = useMutation(() => handleRoutes(), {
    onSuccess: () => {
      //@ts-ignore
      queryClient.invalidateQueries("agremiacao-list");
      const successMsg = id
        ? "Grupo de acesso editado com sucesso!"
        : "Grupo de acesso cadastrado com sucesso!";
      emitAlertMessage("success", successMsg);
      navigate("/agremiacao");
    },
    onError: () => {
      const errorMsg = id
        ? "Erro ao editar grupo de acesso"
        : "Erro ao cadastrar grupo de acesso";
      emitAlertMessage("error", errorMsg);
    },
  });

  const campos = ["descricao", "nome"];
  const [erros, setErros] = useState([]);

  const handleUpdateFormikRegisterValues = async () => {
    if (id === undefined) return;
    const response = await GrupoAcessoRoutes.getGrupoAcesso(id.toString());
    formik.setValues(response);
    setPermissoesSelecionadas(revertTransformedPermission(response.permissoes) )
   
  };
  interface Ipermissao{
     id: string, 
     nome: string, 
     descricao: string, 
     categoria?: string ,
  }
  const [permissoesArray, setPermissoesArray] = useState<Ipermissao[]>([])
  async function getPermissoes(){
    const permissions = await GrupoAcessoRoutes.getPermissoes()
    setPermissoesArray(permissions)
  }
  useEffect(() => {
    formik.setErrors(initialErrors);
    //@ts-ignore
    window.addEventListener("load", handleUpdateFormikRegisterValues());
    return () => {
      //@ts-ignore
      window.removeEventListener("load", handleUpdateFormikRegisterValues());
    };
   

  }, []);

  useEffect(() => {
    async function reloadFieldValues() {
      // @ts-ignore
      const response = await GrupoAcessoRoutes.getAgremiacao(id);
      setResponsedCadastro(response);
      formik.setValues(response);
    }
    reloadFieldValues();
  }, [reloadAgremiacao]);

  const initialErrors = {
    nome: "O nome é obrigatório",
  };
  const [isNotEditted, setIsNotEditted] = useState(false);
  const [prevValue, setPrevValue] = useState<any>({});
  const [prevSelectValue, setPrevSelectValue] = useState<any>({});
  const [permissoesSelecionadas, setPermissoesSelecionadas] = useState<any>({});

  useEffect(
    ()=>{
      if(permissoesSelecionadas !== prevSelectValue)
        setIsNotEditted(false)
    },[permissoesSelecionadas]
  )

  useEffect(() => {
    if (id) {
      if (formik.values["nome"] != "") {
        if (Object.keys(prevValue).length < 2) {
          setPrevSelectValue(permissoesSelecionadas)
          setPrevValue(formik.values);
        } else {
          if (JSON.stringify(formik.values) !== JSON.stringify(prevValue)) {
            setIsNotEditted(false);
          } else {
            if (JSON.stringify(formik.values) == JSON.stringify(prevValue))
              if(prevSelectValue == permissoesSelecionadas)
                setIsNotEditted(false)
              else
              setIsNotEditted(true);
          }
        }
      }
    }
  }, [
    formik.values || permissoesSelecionadas
  ]);

  useEffect(() => {
    setIsDisabled(Object.keys(formik.errors).length > 0);
  }, [formik.errors]);

  const handleDeleteGrupoAcesso = () => {
    Swal.fire({
      title: "Tem certeza que deseja excluir?",
      text: "Você não poderá reverter essa ação!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, excluir!",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {

        id && GrupoAcessoRoutes.deleteGrupoAcesso(id.toString())
        //@ts-ignore
        queryClient.invalidateQueries("agremiacao-list");
        formik.setValues(initialValues);
        emitAlertMessage("success", "Grupo de acesso excluída com sucesso!");

        navigate("/grupo-de-acessos");
      }
    });
  };

  useEffect(()=>{
    getPermissoes()
  },[])


  const handleChange = (event : any, item : any) => {
    isAllDesabilited && setIsAllDesabilited('')
    isAllHabilited && setIsAllHabilited('')
    setPermissoesSelecionadas({
      ...permissoesSelecionadas,
      [item.id]: event.target.value
    });
  };

  const handleSetAllPermissoes = (value : string) => {
    const updatedPermissoesSelecionadas : any = {};
    permissoesArray.forEach((item) => {
      updatedPermissoesSelecionadas[item.id] = value;
    });
    setPermissoesSelecionadas(updatedPermissoesSelecionadas);
  };
  const [isAllHabilited, setIsAllHabilited] = useState('')
  const [isAllDesabilited, setIsAllDesabilited] = useState('')
  const setPermissionsToW = () => handleSetAllPermissoes('W')
  const ResetPermissions = () => handleSetAllPermissoes('')

  const handleChangeHabilitarTodas = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const text = e.target.value
    if(text == '')
      setIsAllHabilited('')
    if(text =='W'){
      setPermissionsToW()
      setIsAllHabilited('W')
      setIsAllDesabilited('')
    } 
  }
  const handleChangeDesabilitarTodas = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const text = e.target.value
    console.log(text)
    if(text != 'W')
    setIsAllDesabilited('')
    if(text =='W'){
      ResetPermissions() 
      setIsAllDesabilited('W')
      setIsAllHabilited('')
    }
  }



  return (
    <form
      onSubmit={formik.handleSubmit}
      encType="multipart/form-data"
      autoComplete="off"
    >
      <div
        id="cadastro"
        style={{
          height: "80vh",
        }}
      >
        <>
          {campos.map((campo) => {
                      
              if (
                  /* @ts-ignore */
                formik.errors[campo] && formik.touched[campo] && !erros.includes(formik.errors[campo])
              ) {
                  /* @ts-ignore */
                setErros([...erros, `${formik.errors[campo]}`]);
              } else {
                /* @ts-ignore */
                if (!formik.errors[campo] && formik.touched[campo]) {
                  /* @ts-ignore */
                  erros.splice(erros.indexOf(formik.errors[campo]));
                }
              }
           
          })}
          {erros.map((erro, index) => {
            return (
              <Snackbar
                key={index}
                open={true}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
              >
                <Alert
                  severity="error"
                  sx={{
                    position: "absolute",
                    bottom: `${40 + 60 * index}px`,
                    width: "300px",
                  }}
                >
                  {erro}
                </Alert>
              </Snackbar>
            );
          })}
        </>
        <div />
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Box
            sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <TextField
              type="text"
              label="Nome *"
              name="nome"
              id="nome"
              value={formik.values["nome"]}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched["nome"] && Boolean(formik.errors["nome"])}
              inputProps={{ maxLength: 60 }}
            />

            <TextField
              type="text"
              label="Descrição *"
              name="descricao"
              id="descricao"
              value={formik.values["descricao"]}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched["descricao"] &&
                Boolean(formik.errors["descricao"])
              }
              inputProps={{ maxLength: 60 }}
            />
          </Box>
          <Box
            sx={{
              background: "#fdfdfd",
              heigh:'50%',
              overflow: "auto",
              padding: 4,
              display: 'flex',
              flexDirection: 'column',
              gap: 3
            }}
          >
            <h3
              style={{ borderBottom: "1px solid black", display: 'flex', justifyContent:'space-between', alignItems:'center', paddingBottom:3}}
            >
              Permissões
              {/* <StyledButton onClick={ setPermissionsToW }>Habilitar todas</StyledButton> */}
            </h3>

            <Box sx={{display: 'grid', gridTemplateColumns: '1fr 1fr', rowGap:2}}>
            <Box sx={{ display: "grid", gridTemplateColumns: '250px 300px', placeItems: 'start',width: '100%', }}>
              <h4>Habilitar Todas<h6>Habilita Todas as Permissões</h6></h4>
              
              <TextField
                select
                label="Permissões *"
                name="Permissoes"
                onChange={event => handleChangeHabilitarTodas(event)}
                value={isAllHabilited}
                >
                <MenuItem value={''}>Desabilitado</MenuItem>
                <MenuItem value={'W'}>Habilitado</MenuItem>
              </TextField>
            </Box>
            <Box sx={{ display: "grid", gridTemplateColumns: '250px 300px', placeItems: 'start',width: '100%', }}>
              <h4>Desabilitar Todas<h6>Desabilita Todas as Permissões</h6></h4>
              
              <TextField
                select
                label="Permissões *"
                name="Permissoes"
                onChange={event => handleChangeDesabilitarTodas(event)}
                value={isAllDesabilited}
                >
                <MenuItem value={''}>Desabilitado</MenuItem>
                <MenuItem value={'W'}>Habilitado</MenuItem>
              </TextField>
            </Box>
              {permissoesArray.map(
                item =>  <Box sx={{ display: "grid", gridTemplateColumns: '250px 300px', placeItems: 'start' }}>
              <h4>{item.nome}<h6>({item.descricao})</h6></h4>
              
              <TextField
                select
                id={`${item.id}`}
                value={permissoesSelecionadas[item.id] || ''}
                onChange={event => handleChange(event, item)}
                // disabled={isAllDesabilited == 'W' || isAllHabilited == 'W'}
              >
                <MenuItem value={''}>Desabilitado</MenuItem>
                <MenuItem value={'W'}>Habilitado</MenuItem>
              </TextField>
            </Box>
              )}

            </Box>
          </Box>
        </Box>
      </div>
      <Box
        sx={{
          backgroundColor: "#F5F5F5",
          display: "flex",
          justifyContent: "right",
          py: 1,
          gap: "1rem",
          position: "absolute",
          width: "100vw",
          left: 0,
          bottom: 0,
        }}
      >
        <Button
          color="success"
          type="submit"
          disabled={isDisabled || isNotEditted}
        >
          <SaveOutlinedIcon />
          Salvar
        </Button>

        <Button
          type="button"
          style={{ marginRight: id !== undefined ? 0 : 38 }}
          onClick={(e) => {
            formik.handleReset(e);
            setAvatarPreview(AvatarDefault);
            navigate("/grupo-de-acessos");
          }}
        >
          <ClearOutlinedIcon />
          Cancelar
        </Button>
        {id !== undefined ? (
          <Button
            type="button"
            onClick={handleDeleteGrupoAcesso}
            color="error"
            style={{ marginRight: 38 }}
          >
            <DeleteIcon />
            Excluir
          </Button>
        ) : null}
      </Box>
    </form>
  );
}
