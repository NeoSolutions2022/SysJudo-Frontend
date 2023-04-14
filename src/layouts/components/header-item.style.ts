import styled from "styled-components";

export const ButtonComponent = styled.button`
  width: 140px;
  height: 50px;
  font-size: 1.2rem;
  background-color: #eaeaea;
  border-top: none;
  border-left: 1px solid #b3b3b3;
  border-right: 1px solid #b3b3b3;
  border-bottom: 0px solid #b3b3b3;

  color: #1d9efa;
  position: relative;

  &:hover {
    div {
      display: flex;
    }
  }

  div {
    width: 140px;
    background-color: #eaeaea;
    position: absolute;
    top: 48px;

    button:first-child {
      border-top: 1px solid #b3b3b3;
    }

    display: none;
    flex-direction: column;

    button {
      font-weight: 400;
      width: 100%;
      height: 50px;
      background-color: #eaeaea;
      display: block;
      border: none;
      font-size: 1rem;
      color: #1d93ff;
      border-bottom: 1px solid #b3b3b3;
      transition: 0.2s;
      cursor: pointer;

      &:hover {
        filter: brightness(0.9);
      }
    }
  }
`;
