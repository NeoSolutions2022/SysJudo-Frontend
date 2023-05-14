import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
//import '../../node_modules/react-quill/dist/quill.snow.css';
import "../../../../node_modules/react-quill/dist/quill.snow.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormik, useFormikContext } from "formik";
import * as Yup from "yup";

import "../../../styles/global.scss";

import { Modal } from "../index";
import { Container, Stack, TextField, DialogActions } from "@mui/material";
import {
  ClearOutlined as ClearIcon,
  CheckOutlined as CheckIcon,
} from "@mui/icons-material";

import { StyledButton as Button } from "../../Button";

import { useAlertContext } from "../../../hooks/useAlertProvider";

import { useModal } from "../../../hooks/useModalProvider";
import { useFormikProvider } from "../../../hooks/useFormikProvider";
import { agremiacaoRoutes } from "../../../providers/services/api/agremiacao/agremiacao";
import { useParams } from "react-router";

import Swal from "sweetalert2";
import { Permissions } from "../../../core/adapters";
import { useAuthContext } from "../../../hooks/useAuthProvider";

interface ModalAnotacoesAgremiacaoProps {
  agremiacaoId: number;
  currentNotes?: any;
  isRegister?: boolean;
}

export function ModalAnotacoesAgremiacao({
  agremiacaoId,
  currentNotes,
  isRegister = false,
}: ModalAnotacoesAgremiacaoProps) {
  const queryClient = useQueryClient();
  const { handleClose } = useModal();
  const { emitAlertMessage } = useAlertContext();
  const { setNotes } = useFormikProvider();
  const { allows } = useAuthContext();
  useEffect(() => {}, [currentNotes]);

  const [content, setContent] = useState("");

  const hasAnotarAgremiacaoPermission = allows(Permissions.AnotarAgremiacao);
  function handleChange(value: string) {
    setContent(value);
  }

  const { id } = useParams<{ id: string }>();
  const handleUpdateFormikRegisterValues = async () => {
    if (id === undefined) return;
    //@ts-ignore
    const response = await agremiacaoRoutes.getAgremiacao(id);
    setContent(response.anotacoes);
  };

  useEffect(() => {
    handleUpdateFormikRegisterValues();
  }, []);

  function handleSubmit() {
    if (id != undefined) {
      agremiacaoRoutes.anotacoesAgremiacao(id, content);
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Anotação salva com sucesso",
        showConfirmButton: false,
        timer: 1500,
      });
    }
    setNotes(content);
    handleClose();
  }

  return (
    <Modal title="Anotações" width="lg" modalId={2}>
      <form onSubmit={handleSubmit}>
        <Container maxWidth={false}>
          <Stack
            spacing={2}
            direction="column"
            alignItems="center"
            justifyContent="center"
            sx={{ p: 3 }}
          >
            <ReactQuill
              theme="snow"
              id="anotacoes"
              className="anotacoesTextfield"
              value={content}
              onChange={handleChange}
              //onBlur={formik.handleBlur}
              style={{
                width: "100%",
                pointerEvents:
                  hasAnotarAgremiacaoPermission == false ? "none" : "inherit",
              }}
            />

            <DialogActions
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                width: "100%",
                gap: 2,
                mt: 2,
              }}
            >
              <Button
                variant="contained"
                color="primary"
                type="button"
                onClick={handleSubmit}
                startIcon={<CheckIcon />}
                size="medium"
                sx={{ minWidth: "120px", textTransform: "none" }}
                disabled={hasAnotarAgremiacaoPermission == false}
              >
                Salvar
              </Button>
              <Button
                variant="contained"
                color="error"
                type="button"
                onClick={handleClose}
                startIcon={<ClearIcon />}
                size="medium"
                sx={{ minWidth: "120px", textTransform: "none" }}
              >
                Cancelar
              </Button>
            </DialogActions>
          </Stack>
        </Container>
      </form>
    </Modal>
  );
}
