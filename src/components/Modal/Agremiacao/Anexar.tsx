import { useParams } from "react-router-dom";
import { Modal } from "../index";
import Dropzone, { DropzoneRootProps, useDropzone } from "react-dropzone";
import { useFormik } from "formik";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  Container,
  Grid,
  InputLabel,
  Input,
  IconButton,
  Typography,
  DialogActions,
  Box,
} from "@mui/material";
import {
  PictureAsPdfOutlined as PdfIcon,
  CloudUpload as CloudUploadIcon,
  UploadFile,
  FileUploadOutlined,
  FileUploadRounded,
  FilePresent,
  Close,
  CountertopsOutlined,
} from "@mui/icons-material";
import { StyledButton as Button } from "../../Button";
import { UploadDocumentComponent } from "../../UploadDocument";
import { ListDocumentsUploaded } from "../../UploadDocument/list";

import { useFormikProvider } from "../../../hooks/useFormikProvider";

import { agremiacaoRoutes } from "../../../providers/services/api/agremiacao";
import { useAlertContext } from "../../../hooks/useAlertProvider";
import { useModal } from "../../../hooks/useModalProvider";
import { useState, useCallback, useEffect } from "react";
import Swal from "sweetalert2";
import { AlertComponent } from "../../Alert";

export function ModalAnexosAgremiacao() {
  const formik = useFormik({
    initialValues: {
      files: [],
    },
    onSubmit: (values) => {
      // try {
      //   const response = await anexarArquivoAgremiacao(id, values)
      // } catch (error) {
      //   console.log('error', error)
      // }
    },
  });

  function extractFilenameFromLink(link : string) {
    const lastSlashIndex = link.lastIndexOf("/");
    const filenameWithExtension = link.substring(lastSlashIndex + 1);
    const filenameWithoutExtension = filenameWithExtension.replace(/\.[^/.]+$/, "");
    const decodedFilename = decodeURIComponent(filenameWithoutExtension.replace(/\+/g, " "));
    return decodedFilename.slice(33);
  }

  const filesUploadedList = formik.values.files?.map((file: File) => (
    <Grid
      item
      key={file.name}
      lg={12}
      xs={12}
      sx={{
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
      }}
    >
      <IconButton aria-label={file.name} component="span">
        <PdfIcon />
      </IconButton>
      <Typography variant="body1" sx={{ color: "black" }}>
        {file.name}
      </Typography>
    </Grid>
  ));

  const { id } = useParams<{ id: string }>();
  const {
    currentFileToCreate,
    setCurrentFileToCreate,
    fileLinkFromGetAgremiacao,
    setReloadAgremiacao,
    setFileLinkFromGetAgremiacao
    
  } = useFormikProvider();
  const queryClient = useQueryClient();
  const { handleClose } = useModal();
  const { emitAlertMessage } = useAlertContext();
  const { anexarArquivoAgremiacao } = agremiacaoRoutes;

  async function handleSubmit() {
    if (id) {
      
      try {
        //@ts-ignore
        anexarArquivoAgremiacao(id, files);
        handleClose();
      } catch (error) {
        handleClose();
      }
      setFiles([]);
      Swal.fire({
        title:  ( files.length > 9) ? "Você anexou " + files.length + ' Arquivos' : ( files.length > 1) ? "Você anexou 0" + files.length + ' Arquivos' :  "Você anexou 0" +  files.length + ' arquivo',
        icon: "success",
        confirmButtonColor: "#3085d6",
      }).then((result) => {
        //@ts-ignore
        setReloadAgremiacao(prev => !prev)
        
      });
    }
    
    setCurrentFileToCreate(files);
    handleClose();
  }

  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  }, []);

  return (
    <Modal title="Anexos" modalId={3} width="md">
      <form>
        <Container maxWidth={false} sx={{ flexGrow: 1, p: 5 }}>
          <Grid
            container
            spacing={0}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Dropzone onDrop={onDrop}>
              {({ getRootProps, getInputProps, isDragActive, isFocused }) => (
                <div
                  {...getRootProps<DropzoneRootProps>()}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "200px",
                    cursor: "pointer",
                    width: "100%",
                    gap: 10,
                    backgroundColor:
                      isDragActive || isFocused ? "#eaf6ff" : "inherit",
                    border:
                      isDragActive || isFocused
                        ? "1px dashed #2196f3"
                        : "1px dashed black",
                    borderRadius: "5px",
                  }}
                >
                  <input {...getInputProps()} />
                  <UploadFile
                    style={{
                      display: "block",
                      color: isDragActive || isFocused ? "#0a83df" : "#2d6c9c",
                    }}
                    fontSize="large"
                  />
                  <p style={{ margin: "0", fontSize: "16px", color: "#888" }}>
                    Arraste um arquivo para aqui, ou clique e selecione
                  </p>
                </div>
              )}
            </Dropzone>
            <div
              style={{
                width: "100%",
                display: "grid",
                columnGap: 15,
                marginTop: 10,
                gridTemplateColumns: '1fr 1fr 1fr 1fr',
              }}
            >
              {fileLinkFromGetAgremiacao.length > 0 &&
                fileLinkFromGetAgremiacao.map((item, index) => (
                  <div
                    style={{
                      paddingBottom: 4,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 5,
                      border: "none",
                    }}
                  >
                    {" "}
                    <a
                      href={item}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 3,
                        color: "black",
                        textDecoration: "none",
                      }}
                    >
                      {" "}
                      <PdfIcon /> 
                      <h5> {extractFilenameFromLink(item)} </h5>{" "}
                    </a>{" "}
                  </div>
                ))}
            </div>
            <div
              style={{
                display:'flex',
                flexDirection: 'column',
                gap: 10,
            }}
            >
            {files.map((file) => (
              <p
                key={file.name}
                style={{
                  color: "#3f6787",
                  display: "flex",
                  alignItems: "center",
                  zIndex: 1000,
                  paddingLeft: "5px",
                }}
              >
                <FilePresent /> {file.name}{" "}
                <Close
                  color="warning"
                  sx={{ cursor: "pointer" }}
                  onClick={() =>
                    setFiles(files.filter((item) => item.name !== file.name))
                  }
                />
              </p>
            ))}

            </div>
            <DialogActions sx={{ display: "flex", gap: 2 }}>
              <Button onClick={handleSubmit} disabled={files.length == 0}>
                <CloudUploadIcon /> {"Enviar"}
              </Button>
              <Button
                color="error"
                type="button"
                onClick={() => {
                  formik.setFieldValue("files", []);
                  return handleClose();
                }}
              >
                <Close />
                Cancelar
              </Button>
            </DialogActions>
          </Grid>
        </Container>
      </form>
    </Modal>
  );
}
