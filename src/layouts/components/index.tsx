import React from "react";
import { ReactNode } from "react";
import * as S from "./header-item.style";

export type HeaderItemProps = {
  children: ReactNode;
  title: string;
};

export const HeaderItemComponent: React.FC<HeaderItemProps> = ({
  children,
  title,
}) => {
  return (
    <S.ButtonComponent>
      {title}

      <div>{children}</div>
    </S.ButtonComponent>
  );
};

export default HeaderItemComponent;
