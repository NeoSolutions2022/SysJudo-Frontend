import { ReactNode, useState } from "react";
import { Dialog, Typography, IconButton, DialogTitle, DialogContent } from "@mui/material";
import { Close } from "@mui/icons-material";


interface ModalProps {
  title?: string;
  children: ReactNode;
  width?: "xs" | "sm" | "md" | "lg" | "xl" | false;
  isOpen?: boolean;
  onClose?: (() => void);
}

export function SecondaryModal({ title, children, width, isOpen, onClose }: ModalProps) {
  return (
    <Dialog
      open={isOpen == true}
      onClose={onClose}
      aria-labelledby="form-dialog-title"
      fullWidth={true}
      maxWidth={width}
      PaperProps={{
        style: {
          borderRadius: "10px",
        }
      }}
      sx={{
        "& .MuiDialogContent-root": {
          p: 0,
        },
        
      }}
    >
      <DialogTitle sx={{ m: 0, mb: 0, ml: 1, p: 2, pb: 2 }}>
        {title && (
          <Typography
            color="#4887C8"
            fontWeight='normal'
            fontSize="1.3rem"
          >
            {title}
          </Typography>
        )}
        <IconButton
          type="button"
          sx={{ position: "absolute", top: 8, right: 8 }}
          aria-label="close"
          onClick={onClose}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{}}>
        {children}
      </DialogContent>
    </Dialog>
  );
}