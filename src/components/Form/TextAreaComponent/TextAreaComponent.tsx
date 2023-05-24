
import {
  TextField as MuiTextArea,
  TextFieldProps
} from "@mui/material";
import InputMask from 'react-input-mask'
import { useField } from "formik";
import { ReactNode } from "react";
import { useFormik, FormikProps } from "formik";

export function TextField( {inputProps, ...rest} : TextFieldProps) {
  return (
    <MuiTextArea 
      {...rest}
      size="small"
      fullWidth
      InputLabelProps={{
        shrink: true,
      }}
      inputProps={{
        autocomplete: 'new-password',
        form: {
          autocomplete: 'off',
        },
        ...inputProps
      }}
      autoComplete='off'      
    />
  )

}

type MaskedFieldProps = TextFieldProps & {
  mask: string;
};



export function MaskedTextField({ mask, value, onChange, onBlur, error, ...rest } : any) {
  return (
    <InputMask
      mask={mask}
      maskChar=""
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      {...rest}
    >
      {() => (
        <TextField
          disabled={rest.disabled}
          type={rest.type}
          label={rest.label}
          name={rest.name}
          id={rest.id}
          sx={rest.sx}
          error={error}
        />
      )}
    </InputMask>
  );
}