import React from "react";
import { useState } from "react";
import parse from "html-react-parser";
import * as S from "./dropdown-cell.style";

type DropCellProps = {
  value: string;
  id: string;
};

export const DropDownCell: React.FC<DropCellProps> = ({ value, id }) => {
  const [isDropdownIndexOpen, setIsDropdownIndexOpen] = useState("0");
  const resetDropdown = () => {
    setIsDropdownIndexOpen("");
  };
  const toggleDropdown = () => {
    setIsDropdownIndexOpen(id);
  };

  let formattedValue = ""; // Declare a variável fora do bloco 'if'

  if (value !== null && value !== undefined) {
    formattedValue = value.split(";").join(";<br>"); // Atribua o valor dentro do bloco 'if'
  } else {
    formattedValue
  }

  return (
    <S.Container>
      <S.Cell onClick={toggleDropdown}>{value}</S.Cell>
      {isDropdownIndexOpen == id && (
        <S.DropCell onClick={resetDropdown}>{parse(formattedValue)}</S.DropCell>
      )}
    </S.Container>
  );
};

export default DropDownCell;
