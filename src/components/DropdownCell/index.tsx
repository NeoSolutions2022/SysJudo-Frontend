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

  return (
    <S.Container>
      <S.Cell onClick={toggleDropdown}>{value}</S.Cell>
      {isDropdownIndexOpen == id && (
        <S.DropCell onClick={resetDropdown}>{parse(value)}</S.DropCell>
      )}
    </S.Container>
  );
};

export default DropDownCell;
