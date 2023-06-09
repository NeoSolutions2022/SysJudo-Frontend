import styled from "styled-components";

export const ButtonComponent = styled.button`
  width: 8.75rem;
  height: 100%;
  font-size: 19.2px;
  background-color: #eaeaea;
  border-left: 0.0625rem solid #b3b3b3;
  border-right: 0.0625rem solid #b3b3b3;
  border-bottom: 0.125rem solid #b3b3b3;
  border-top: none;
  cursor: pointer;

  color: #1d9efa;
  position: relative;

  &:hover {
    filter: brightness(0.96);
    div {
      display: flex;
    }
  }

  div {
    width: 8.75rem;
    background-color: #000;
    position: absolute;
    top: 3.8rem;

    button:first-child {
      border-top: 0.0625rem solid #b3b3b3;
    }

    display: none;
    flex-direction: column;
    border-radius: 0rem 0rem 0.4375rem 0.4375rem;

    button {
      font-weight: 400;
      width: 100%;
      height: 3.75rem;
      background-color: #eaeaea;
      display: block;
      border: none;
      font-size: 16px;
      color: #1d93ff;
      border-bottom: 0.0625rem solid #b3b3b3;
      transition: 0.2s;
      cursor: pointer;
      text-decoration: none;
      &:hover {
        filter: brightness(1.1);
      }

      &:last-child {
        border-radius: 0rem 0rem 0.3125rem 0.3125rem;
      }
    }
  }
`;
